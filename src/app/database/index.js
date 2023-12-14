import mongoose from "mongoose";

// Connecting to the database here

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  const connectionUrl =
    "mongodb+srv://abrawny:Hamidmahir123@cluster0.c6uaqdr.mongodb.net/";

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Ecommerce database connected successfully!"))
    .catch((err) =>
      console.log(`Unable to connect to database: ${err.message}`)
    );
};

export default connectToDB;