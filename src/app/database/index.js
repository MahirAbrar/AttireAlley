import mongoose from "mongoose";

// Connecting to the database here by calling connectToDB() function

const configOptions = {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
};

let user = process.env.DB_HOST;
let pass = process.env.DB_PASS;

// connecting to database function
let connectToDB = async () => {
  const connectionUrl = `mongodb+srv://${user}:${pass}@cluster0.c6uaqdr.mongodb.net/`;
  console.log("connecting to database");
  try {
    await mongoose.connect(connectionUrl, configOptions);
    console.log("Successfully connected to MongoDB Database");
  } catch (e) {
    console.error("error connecting to database", e.message);
    throw e; // throw the error to be caught in the calling function
  }
};

export default connectToDB;
