import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import dotenv from 'dotenv';
import { logInfo, logError } from '../server/src/util/logging.js';
import Machine from './schemas/machine.js'; 
import Review from './schemas/review.js'; 

const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const url = process.env.MONGODB_URL;

mongoose
  .connect(url)
  .then(() => {
    logInfo('Connected to MongoDB');
    createDatabase();
  })
  .catch((err) => {
    logError('Error connecting to MongoDB:', err);
  });

async function createDatabase() {
  try {
    const db = mongoose.connection.db;
    await dropCollectionIfExists(db, 'machines');
    await insertMachinesData('MTS.csv');
    logInfo('Data insertion complete');
  } catch (err) {
    logError('Error:', err);
  } finally {
    mongoose.disconnect();
    logInfo('Disconnected from MongoDB');
  }
}

async function dropCollectionIfExists(db, collectionName) {
  const collections = await db.listCollections({ name: collectionName }).toArray();
  if (collections.length > 0) {
    await db.dropCollection(collectionName);
    logInfo(`Dropped collection: ${collectionName}`);
  }
}

async function insertMachinesData(fileName) {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
        data.push({
          address: row.Address,
          location: { lat: parseFloat(row.Lat), lon: parseFloat(row.Lon) },
          status: parseInt(row.Status),
          status_update_time: new Date(row.Status_Update_Time),
          history: [
            {
              status: parseInt(row.Status),
              status_update_time: new Date(row.Status_Update_Time),
            },
          ],
          reviews: [], 
          image: null,
          score: null,
        });
      })
      .on('end', async () => {
        try {
          const machines = await Machine.insertMany(data);
          logInfo(`Inserted ${data.length} documents into collection: machines`);
          await insertReviewsForMachines(machines);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}


async function insertReviewsForMachines(machines) {
  try {
    const reviewsData = machines.map(machine => ({
      comment: "Great machine!",
      stars: 5,
      machine: machine._id, 
      user: new mongoose.Types.ObjectId() 
    }));

    const insertedReviews = await Review.insertMany(reviewsData);
    console.log('Reviews inserted successfully');

    for (let i = 0; i < machines.length; i++) {
      const machine = machines[i];
      const machineReviews = insertedReviews.filter(review => review.machine.equals(machine._id));
      await Machine.findByIdAndUpdate(machine._id, { $push: { reviews: { $each: machineReviews.map(review => review._id) } } });
    }

    console.log('Machines updated with reviews');
  } catch (error) {
    console.error('Error inserting reviews:', error);
  }
}




