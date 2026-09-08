const express =require("express");
const cors = require("cors");

const app= express();
const PORT= 5000;

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
     res.status(200).json({
         message:"music player  api is  running"
     });
});


app.listen(PORT,()=>{
     console.log(`server running  on port ${PORT}`);
});
