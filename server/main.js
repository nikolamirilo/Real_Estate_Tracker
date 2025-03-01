import axios from "axios";
import { scrape4zidaOffers } from "./web_scrapers/4zidaScraper.js";
import { findBestMatch, getRandomOffset } from "./utils/index.js";
import pool from "./lib/db.js";

export async function fetchData() {
  try {
    const offers4zida = await scrape4zidaOffers();

    if (offers4zida.length === 0) {
      console.log("No offers to process.");
      return [];
    }
    const results = [];
    const { rows } = await pool.query('SELECT * FROM properties');
    const existingRecords = rows;
    for (let i = 0; i < offers4zida.length; i++) {
      try {
        const item = offers4zida[i];
        if (item.street && item.cityArea && !existingRecords.some(singleItem => singleItem.image === item.image)) {
          const encodedAddress = encodeURIComponent(item.street || '');
          const url = `https://nominatim.openstreetmap.org/search.php?street=${encodedAddress}&city=Beograd&country=Serbia&state=Serbia&format=jsonv2`;

          console.log(`Fetching: ${url}`);
          const res = await axios.get(url, {
            headers: { 'User-Agent': 'YourAppName (contact@email.com)' }
          });

          if (res.data?.length > 0) {
            const trimmedCityArea = item.cityArea.split(",")[0].trim();
            const bestMatch = findBestMatch(res.data, trimmedCityArea);

            if (bestMatch?.lat && bestMatch?.lon) {
              results.push({
                ...item,
                lat: bestMatch.lat,
                lon: bestMatch.lon,
                isMatch: bestMatch.isMatch
              });
            } else {
              console.log(`No valid match for: ${item.street}, ${item.cityArea}`);
            }
          } else {
            const randomOffset = getRandomOffset();
            results.push({
              ...item,
              lat: 44.8133048 + randomOffset.deltaLat,
              lon: 20.4183382 + randomOffset.deltaLon,
              isMatch: false
            });
            console.log(`No results for: ${item.street}`);
          }
        }
      } catch (error) {
        console.error('Error processing item:', error.message);
      }
    }
    console.log("Items to be added in DB: ", results)
    return results;
  } catch (error) {
    console.error('Error in fetchData:', error.message);
  }
}