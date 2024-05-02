import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import dotenv from "dotenv";
import { logInfo, logError } from "../server/src/util/logging.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => {
    logInfo("Connected to MongoDB");
    createDatabase();
  })
  .catch((err) => {
    logError("Error connecting to MongoDB:", err);
  });

const machineSchema = new mongoose.Schema({
  address: String,
  location: {
    lat: Number,
    lon: Number,
  },
  status: Number,
  status_update_time: Date,
  history: [
    {
      status: Number,
      status_update_time: Date,
    },
  ],
  reviews: [String],
  image: String,
  score: Number,
});

const Machine = mongoose.model("Machine", machineSchema);

async function createDatabase() {
  try {
    const db = mongoose.connection.db;
    await dropCollectionIfExists(db, "machines");
    await insertMachinesData("MTS.csv");
    logInfo("Data insertion complete");
  } catch (err) {
    logError("Error:", err);
  } finally {
    mongoose.disconnect();
    logInfo("Disconnected from MongoDB");
  }
}

async function dropCollectionIfExists(db, collectionName) {
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();
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
      .on("data", (row) => {
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
          reviews: null,
          image: null,
          score: null,
        });
      })
      .on("end", async () => {
        try {
          await Machine.insertMany(data);
          logInfo(
            `Inserted ${data.length} documents into collection: machines`
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
