const mysql = require("mysql2/promise"); // Import promise API

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "expensetracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to test the database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to the database");
    connection.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// Call the test connection function
testConnection();

module.exports = pool;
