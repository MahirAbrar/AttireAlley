import mongoose from "mongoose";
import dns from "dns";

const user = process.env.DB_HOST;
const pass = process.env.DB_PASS;

const configOptions = {};

// Connecting to MongoDB function
const connectToDB = async () => {
  // --- Configuration for DNS Override ---
  // Set to true if system DNS fails for SRV records locally.
  const FORCE_GOOGLE_DNS = false;
  // -------------------------------------

  if (FORCE_GOOGLE_DNS) {
    // Attempt to set DNS servers for this Node.js process
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (err) {
      console.error("Error setting DNS servers:", err);
      // Continue regardless, maybe it works without it
    }
  }

  // Check if already connected or in the process of connecting
  if (
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    return;
  }

  const connectionUrl = `mongodb+srv://${user}:${pass}@cluster0.c6uaqdr.mongodb.net/`;
  try {
    await mongoose.connect(connectionUrl, configOptions);
  } catch (error) {
    console.error("Error connecting to MongoDB Database:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    throw error;
  }
};

export default connectToDB;
