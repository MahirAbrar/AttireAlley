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
  return mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Successfully connected to MongoDB Database"))
    .catch((e) => {
      console.log("error connecting to database", e.message);
    });
};

export default connectToDB;
