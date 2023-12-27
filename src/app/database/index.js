import mongoose from "mongoose";

// Connecting to the database here by calling connectToDB() function

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let user = process.env.DB_HOST;
let pass = process.env.DB_PASS;

// connecting to database function
const connectToDB = async () => {
  const connectionUrl = `mongodb+srv://${user}:${pass}cluster0.c6uaqdr.mongodb.net/`;
  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Ecommerce database connected successfully!"))
    .catch((err) =>
      console.log(`Unable to connect to database: ${err.message}`),
    );
};

export default connectToDB;
