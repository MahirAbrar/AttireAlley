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
  const connectionUrl = `mongodb+srv://${user}:${pass}@cluster0.c6uaq.mongodb.net/databasename`; // replace 'databasename'
  try {
    await mongoose.connect(connectionUrl, configOptions);
    console.log("Ecommerce database connected successfully!");
  } catch (err) {
    console.log(`Unable to connect to database: ${err.message}`);
  }
};

export default connectToDB;
