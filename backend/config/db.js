const mongoose = require('mongoose');

// Connects to MongoDB Atlas (or local Mongo) using the URI in .env.
// Fails loudly and exits the process if the connection cannot be made,
// since the API is useless without a database.
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[DB] MONGO_URI is not set in your .env file.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] Connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
