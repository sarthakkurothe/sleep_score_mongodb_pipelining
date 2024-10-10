const fs = require('fs').promises;
const { connectToDatabase } = require('./config');

async function importData() {
  const db = await connectToDatabase();

  // Import activity data
  const activityData = JSON.parse(await fs.readFile('../data/activity_data.json', 'utf8'));
  await db.collection('activities').insertMany(activityData);

  // Import sleep data
  const sleepData = JSON.parse(await fs.readFile('../data/sleep_data.json', 'utf8'));
  await db.collection('sleep').insertMany(sleepData);

  console.log('Data imported successfully');
}

module.exports = { importData };
