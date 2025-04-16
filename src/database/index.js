import mongoose from "mongoose";
import dns from 'dns';

let user = process.env.DB_HOST;
let pass = process.env.DB_PASS;

const configOptions = {};

// Connecting to MongoDB function
const connectToDB = async () => {

  // --- Configuration for DNS Override ---
  // Set to true if system DNS fails for SRV records locally. 
  const FORCE_GOOGLE_DNS = false;
  // -------------------------------------

  if (FORCE_GOOGLE_DNS) {
    console.log("Set DNS to Google DNS");
    // Attempt to set DNS servers for this Node.js process
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      console.log('Attempted to set DNS servers to Google DNS for this process.');
    } catch (err) {
      console.error('Error setting DNS servers:', err);
      // Continue regardless, maybe it works without it
    }
  }

  // Check if already connected or in the process of connecting
  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    console.log("Already connected or connecting to MongoDB Database");
    return;
  }

  const connectionUrl = `mongodb+srv://${user}:${pass}@cluster0.c6uaqdr.mongodb.net/`;
  console.log("Connecting to MongoDB Database...");

  try {
    await mongoose.connect(connectionUrl, configOptions);
    console.log("Successfully connected to MongoDB Database");
  } catch (error) {
    console.error("Error connecting to MongoDB Database:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

export default connectToDB;

