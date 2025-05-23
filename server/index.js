import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { fetchData } from './main.js';
import { sendMessageToDiscord } from './lib/discordBot.js';
import { updateCoordinatesAI } from './ai/index.js';
import pool from './lib/db.js';
import { createPropertiesTable } from './sql/queries.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.get('/properties', async (req, res) => {
    await pool.query(createPropertiesTable)
    const { rows } = await pool.query('SELECT * FROM properties');
    res.send(rows);
});

app.get('/properties/refresh-data', async (req, res) => {
    try {
        await pool.query(createPropertiesTable);
        const data = await fetchData();
        let messages = [];
        let counter = 0

        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                const checkQuery = `SELECT * FROM properties WHERE link = $1`;
                const checkValues = [data[i].link];
                const existingRecord = await pool.query(checkQuery, checkValues);

                if (existingRecord.rows.length > 0) {
                    messages.push(`Property ${i + 1} already exists. Skipping.`);
                    continue;
                }

                const insertQuery = `
                INSERT INTO properties (details, street, image, city_area, price, price_per_m2, is_match, link, lat, lon)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;
                const insertValues = [
                    data[i].details,
                    data[i].street,
                    data[i].image,
                    data[i].cityArea,
                    data[i].price,
                    data[i].pricePerM2,
                    data[i].isMatch,
                    data[i].link,
                    data[i].lat,
                    data[i].lon,
                ];

                try {
                    await pool.query(insertQuery, insertValues);
                    await sendMessageToDiscord(data[i], "offer");
                    counter++;
                    messages.push(`Property ${i + 1} inserted successfully.`);
                } catch (err) {
                    messages.push(`Error inserting property ${i + 1}: ${err.message}`);
                }
                
            }
            if(counter == 0){
                await sendMessageToDiscord(data[i], "notification");
            }
            res.json({ message: "Finished adding data", details: messages, success: true });
        }
    } catch (err) {
        console.error('Error in /properties/refresh-data:', err);
        res.status(500).json({ message: "Internal Server Error", error: err.message, success: false });
    }
});

app.get('/properties/update-coordinates', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM properties');

        if (rows.length === 0) {
            return res.status(404).json({ message: "No properties found in the database." });
        }

        await updateCoordinatesAI(rows);

        res.status(200).json({ message: "Coordinates updated successfully." });
    } catch (error) {
        console.error("Error in /update-coordinates route:", error);
        res.status(500).json({ message: "An error occurred while updating coordinates.", error: error.message });
    }
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});