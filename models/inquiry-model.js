const pool = require("../database");

async function createInquiry({ inv_id, customer_name, customer_email, message }) {
  const sql = `
    INSERT INTO inquiry_requests (inv_id, customer_name, customer_email, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [parseInt(inv_id), customer_name, customer_email, message];

  try {
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

async function getInquiriesByVehicleId(inv_id) {
  const sql = `
    SELECT * FROM inquiry_requests
    WHERE inv_id = $1
    ORDER BY created_at DESC;
  `;
  try {
    const result = await pool.query(sql, [parseInt(inv_id)]);
    return result.rows;
  } catch (error) {
    throw new Error("Database error: " + error.message);
  }
}

async function getAllInquiries() {
  try {
    const result = await pool.query("SELECT * FROM inquiry_requests ORDER BY created_at DESC;");
    return result.rows;
  } catch (error) {
    throw new Error("Failed to fetch inquiries.");
  }
}

module.exports = {
  createInquiry,
  getInquiriesByVehicleId,
  getAllInquiries
};
