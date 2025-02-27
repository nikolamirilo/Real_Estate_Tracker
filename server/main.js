import axios from "axios";
import { scrape4zidaOffers } from "./web_scrapers/4zidaScraper.js";
import { findBestMatch, getRandomOffset } from "./utils/index.js";
import { scrapeHaloOffers } from "./web_scrapers/haloScraper.js";
import fs from "fs";

export async function fetchData() {
  const offersHalo = await scrapeHaloOffers();
  const offers4zida = await scrape4zidaOffers();

  const flattened4ZidaOffers = Array.isArray(offers4zida) ? offers4zida.flat() : [];
  const allOffers = [...offersHalo, ...flattened4ZidaOffers];

  if (allOffers.length === 0) {
    console.log("No offers to process.");
    return [];
  }

  const results = [];

  for (let i = 0; i < allOffers.length; i++) {
    try {
      const item = allOffers[i];
      console.log(item);

      if ((item.street || item.cityArea) && item.cityArea) {
        const encodedAddress = encodeURIComponent(item.street || '');
        const url = `https://nominatim.openstreetmap.org/search.php?street=${encodedAddress}&city=Beograd&country=Serbia&state=Serbia&format=jsonv2`;

        console.log(`Fetching: ${url}`);
        const res = await axios.get(url, {
          headers: { 'User-Agent': 'YourAppName (contact@email.com)' }
        });

        if (res.data?.length > 0) {
          const trimmedCityArea = item.cityArea.split(",")[0].trim();
          console.log(trimmedCityArea);
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
          results.push({
            ...item,
            lat: 44.8133048 + getRandomOffset().deltaLat,
            lon: 20.4183382 + getRandomOffset().deltaLon,
            isMatch: false
          });
          console.log(`No results for: ${item.street}`);
        }
      } else {
      }

      // Add a delay between requests (e.g., 1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Save results to a file
  try {
    fs.writeFileSync("../client/data.json", JSON.stringify(results, null, 2));
    console.log("Data saved.");
  } catch (error) {
    console.error('Error saving data to file:', error.message);
  }

  return results;
}

fetchData();