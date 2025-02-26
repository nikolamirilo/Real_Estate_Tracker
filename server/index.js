import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pool from './lib/db.js'; // Import the database connection
import { createPropertiesTable } from './sql/queries.js';
import { fetchData } from './main.js';
import { sendMessageToDiscord } from './lib/discordBot.js';
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



// Basic route
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
      res.write(JSON.stringify({ message: "Started with scraping data and inserting into DB" }) + '\n');
      await pool.query(createPropertiesTable);
      const data = await fetchData();

      for (let i = 0; i < data.length; i++) {
          const checkQuery = `
              SELECT * FROM properties 
              WHERE link = $1 
          `;
          const checkValues = [
              data[i].link,
          ];

          const existingRecord = await pool.query(checkQuery, checkValues);

          if (existingRecord.rows.length > 0) {
              console.log(`Property ${i + 1} already exists in the database. Skipping insertion.`);
              continue; // Skip this iteration if the record already exists
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
              await sendMessageToDiscord(data[i]);
              console.log(`Property ${i + 1} inserted successfully.`);
          } catch (err) {
              console.error(`Error inserting property ${i + 1}:`, err);
          }
      }
      res.status(200).json(({ message: "Finished with adding data", success: true }));
  } catch (err) {
      console.error('Error in /properties/refresh-data:', err);
      res.status(500).json({ message: "Internal Server Error", error: err.message, success: false });
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});