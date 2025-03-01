import pool from "../lib/db.js";

export const createPropertiesTable = `
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY, -- Auto-incrementing primary key
    details TEXT NOT NULL, -- Property details (e.g., "112m² | 3 sobe | 1. sprat")
    street TEXT NOT NULL, -- Street name (e.g., "Braće Panić")
    image TEXT NOT NULL, -- Street name (e.g., "Braće Panić")
    city_area TEXT NOT NULL, -- City area (e.g., "Jakovo, Surčin opština, Beograd")
    price NUMERIC NOT NULL, -- Price in euros (e.g., 84000)
    price_per_m2 NUMERIC NOT NULL, -- Price per square meter (e.g., 750)
    is_match BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates if the location is a match
    lat NUMERIC NOT NULL, -- Latitude (e.g., 44.747758209749264)
    lon NUMERIC NOT NULL, -- Longitude (e.g., 20.25902768093329)
    link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of record creation
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of last update
);
`;

export async function updateProperty(property) {
    try {
        const {
            id,
            details,
            street,
            image,
            city_area,
            price,
            price_per_m2,
            is_match,
            lat,
            lon,
            link,
        } = property;

        if (!id) {
            throw new Error("Property ID is required for updating.");
        }

        const query = `
        UPDATE properties
        SET
          details = $1,
          street = $2,
          image = $3,
          city_area = $4,
          price = $5,
          price_per_m2 = $6,
          is_match = $7,
          lat = $8,
          lon = $9,
          link = $10,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $11
        RETURNING *;
      `;

        const values = [
            details,
            street,
            image,
            city_area,
            price,
            price_per_m2,
            true,
            lat,
            lon,
            link,
            id,
        ];
        try {
            await pool.query(query, values);
            return true;
        } catch (error) {
            return false;
        }
    } catch (error) {
        console.error("Error updating property:", error);
        throw false;
    }
}
