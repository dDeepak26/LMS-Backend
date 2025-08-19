import mongoose from "mongoose";

const DbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error in connect to MongoDb", err);
  }
};

export default DbConnect;
