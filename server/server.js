
import express from "express";
import cors from "cors";



import connectDB from "./config/db.js";
import songRoutes from "./routes/songRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";





const app= express();


app.use(cors());
app.use(express.json());
app.use("/api/likes", likeRoutes);


app.get("/",(req,res)=>{
     res.status(200).json({
         message:"music player  api is  running"
     });
});

app.use("/api/songs", songRoutes);

app.use("/api/auth", authRoutes);//here

const PORT = process.env.PORT||5000;

const startServer =async ()=>{
    await connectDB();

    app.listen(PORT,()=>{
     console.log(`server running  on port ${PORT}`);
});
}

startServer();



