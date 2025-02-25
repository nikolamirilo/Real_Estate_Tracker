import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import pool from './lib/db.js'; // Import the database connection
import { createPropertiesTable } from './sql/queries.js';
import { fetchData } from './main.js';
import { sendMessageToDiscord } from './lib/discordBot.js';
import Parse from 'parse/node.js';

// Initialize with your Back4app keys
Parse.initialize("63L46OGDNRq8XLXn623qinQ3mLug9WWFuaLCeBYh", "JnLFC5BmualgArA6USOGQxPIq6Tl5KH2s31MBqon");  // Replace with your App ID and JS Key
Parse.serverURL = 'https://parseapi.back4app.com';

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
    const testConnection = async () => {
      const Person = new Parse.Object("Person");
      Person.set("name", "Jon Snow");
      Person.set("age", 30);
    
      try {
        await Person.save();
        console.log("Successfully connected to Back4app!");
      } catch (error) {
        console.error("Connection error:", error.message);
      }
    };
    
    testConnection();
});
app.get('/properties', async (req, res) => {
    await pool.query(createPropertiesTable)
    const { rows } = await pool.query('SELECT * FROM properties');
    res.send(rows);
});
app.get('/properties/refresh-data', async (req, res) => {
    try {
      res.write(JSON.stringify({ message: "Started with scraping data and inserting into DB" }) + '\n');
      await pool.query(createPropertiesTable)
      const data = await fetchData();
      for (let i = 0; i < data.length; i++) {
        const query = `
          INSERT INTO properties (details, street, image, city_area, price, price_per_m2, is_match, lat, lon)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const values = [
          data[i].details,
          data[i].street,
          data[i].image,
          data[i].cityArea,
          data[i].price,
          data[i].pricePerM2,
          data[i].isMatch,
          data[i].lat,
          data[i].lon,
        ];
  
        try {
          await pool.query(query, values);
          await sendMessageToDiscord(data[i])
          console.log(`Property ${i + 1} inserted successfully.`);
        } catch (err) {
          console.error(`Error inserting property ${i + 1}:`, err);
        }
      }
  
      // Notify the client that the process has finished
      res.write(JSON.stringify({ message: "Finished with adding data" }) + '\n');
      res.end(); // End the response
    } catch (err) {
      console.error('Error in /properties/refresh-data:', err);
      res.status(500).json({ message: "Internal Server Error", error: err.message });
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