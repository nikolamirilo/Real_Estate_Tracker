import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { updateProperty } from "../sql/queries.js";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Please provide a valid API key.");
}

export async function updateCoordinatesAI(data) {
    try {
        const unmatchedData = data.filter((item) => item.is_match === false);
        const client = new Groq({ apiKey: apiKey });

        for (let i = 0; i < unmatchedData.length; i++) {
            const { street, city_area: cityPart, id } = unmatchedData[i];
            console.log(`Updating coordinates for property ID: ${id}, Address: ${street}, ${cityPart}`);

            const chatCompletion = await client.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `Get lat and long of address: ${street}, ${cityPart}. Format: Return just lat and lon as JS object, don't add any additional text.`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.9
            });

            try {
                const coordinates = JSON.parse(chatCompletion.choices[0].message.content);
                if (!coordinates.lat || !coordinates.lon) {
                    throw new Error("Invalid coordinates format received from the API.");
                }
                unmatchedData[i].lat = coordinates.lat;
                unmatchedData[i].lon = coordinates.lon;
                await updateProperty(unmatchedData[i]);
                console.log(`Successfully updated coordinates for property ID: ${id}`);
            } catch (error) {
                console.error(`Error processing coordinates for property ID: ${id}:`, error);
            }
        }
    } catch (error) {
        console.error("Error updating coordinates:", error);
    }
}