const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://211420:abcd1234@cluster0.kfl3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "wysa_db";

async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(DB_NAME);
}

module.exports = { connectToDatabase };