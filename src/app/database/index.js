import mongoose from "mongoose";

let user = process.env.DB_HOST;
let pass = process.env.DB_PASS;

const configOptions = {};

// Connecting to MongoDB function
const connectToDB = async () => {
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
    console.error("Error connecting to MongoDB Database:", error.message);
    throw error; // Propagate the error to be caught by the calling function
  }
};

export default connectToDB;
