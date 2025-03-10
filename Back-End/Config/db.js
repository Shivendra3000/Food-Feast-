import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://shivendrabajpai1701:32321175@cluster0.fr28tfe.mongodb.net/food-del&appName=Cluster0').then(()=>console.log("DB Connnected"));
}
