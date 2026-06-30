import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  mongoose.connection.on("connected", () =>
    console.log("MongoDB connected successfully")
  );
  await mongoose.connect(`${process.env.MONGO_URI}/MediHelp`);
};

export default connectDB;
