import pool from "../lib/db";
import { createPropertiesTable } from "../sql/queries";

export const createTable = async () => {
    try {
      await pool.query(createPropertiesTable);
      console.log('Table created or already exists.');
      return true
    } catch (err) {
      console.error('Error creating table:', err);
      return false
    }
  };