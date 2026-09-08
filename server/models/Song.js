const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
     title:{
         type:String,
         required:true,
         trim:true
     },

     duration:{
        type:Number,
        required:true
     },

     audioUrl:{
         type:String,
         required:true
     },
    },
    {
        timestamps:true
    }
);

const Song = mongoose.model("Song", songSchema);

module.exports= Song;