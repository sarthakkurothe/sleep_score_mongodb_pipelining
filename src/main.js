const { connectToDatabase } = require('./config');
const { importData } = require('./import_data');
const { getPerceivedEnergyScores } = require('./aggregation_pipeline');
const fs = require('fs').promises;

async function main() {
  try {
    const db = await connectToDatabase();

    // Import data (only need to run this once)
     await importData();

    // Get perceived energy scores for a specific date
    const date = '2024-04-01';
    const scores = await getPerceivedEnergyScores(db, date);

    // Write results to a file
    await fs.writeFile('perceived_energy_scores.json', JSON.stringify(scores, null, 2));

    console.log('Perceived energy scores calculated and saved successfully');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();