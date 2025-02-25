import axios from "axios";
import { fetchOffers } from "./scraper.js";
import { findBestMatch } from "./utils.js";

export async function fetchData() {
  const offers = await fetchOffers();
  const results = [];

  for (let i = 0; i < offers.length; i++) {
    try {
      const item = offers[i];
      if (item.street && item.cityArea) {
        const encodedAddress = encodeURIComponent(item.street);
        const url = `https://nominatim.openstreetmap.org/search.php?street=${encodedAddress}&city=Beograd&country=Serbia&state=Serbia&format=jsonv2`;

        console.log(`Fetching: ${url}`);
        const res = await axios.get(url, {
          headers: { 'User-Agent': 'YourAppName (contact@email.com)' } // Set a valid user-agent
        });

        if (res.data?.length > 0) {
          const trimedCityArea = item.cityArea.split(",")[0]
          console.log(trimedCityArea)
          const bestMatch = findBestMatch(res.data, trimedCityArea);
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
          console.log(`No results for: ${item.street}`);
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // fs.writeFileSync("../client/data.json", JSON.stringify(results, null, 2));
  console.log("Data saved.");
  return results
}