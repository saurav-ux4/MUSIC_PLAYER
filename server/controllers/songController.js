import Song from "../models/Song.js";
import cloudinary from "../config/cloudinary.js";

//GET /api/songs

const getSongs = async (req,res)=>{
    try{
         const songs = await Song.find().sort({createdAt: -1});

         res.status(200).json(songs);
    }catch(error){
         res.status(500).json({
             message: " failed to fetch songs"
         });
    }
};

//GET /api/songs/:id

const getSong =async(req,res)=>{
     try{
        const song=await Song.findById(req.params.id);

        if(!song){
             return res.status(404).json({
                message:"song not found"
             });
        }

        res.status(200).json(song);
     }catch(error){
        res.status(404).json({
            message: "invalid song ID"
        });
     }
};



//POST /api/songs
const createSong = async (req, res) => {
  try {
    const { title, duration } = req.body;
    console.log("FILES:", req.files);//here

    if (!title || duration === undefined) {
      return res.status(400).json({
        message: "Title and duration are required",
      });
    }

     if (!req.files?.audio?.[0]) {
      return res.status(400).json({
        message: "MP3 file is required",
      });
    }

     if (!req.files?.cover?.[0]) {
      return res.status(400).json({
        message: "Cover image is required",
      });
    }

     const audioFile = req.files.audio[0];
     const coverFile = req.files.cover[0];


    const audioUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "video",
            folder: "music-player/audio",
          
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(audioFile.buffer);
    });

    const coverUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "music-player/covers",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
                }
          }
        )
        .end(coverFile.buffer);
    });


     const song = await Song.create({
      title,
      duration,
      audioUrl: audioUpload.secure_url,
      coverImage: coverUpload.secure_url,
    });

    res.status(201).json(song);
  } catch (error) {
    console.error("Song upload error:", error);
    
    res.status(500).json({
      message: "Failed to create song",
    });
  }
};


//PUT /api/songs/:id
const updateSong = async (req, res) => {
  try {
    const { title, duration, audioUrl, coverImage } = req.body;

    const song = await Song.findByIdAndUpdate(
      req.params.id,
      {
        title,
        duration,
        audioUrl,
        coverImage,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update song",
    });
  }
};


// DELETE /api/songs/:id
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) {
      return res.status(404).json({
        message: "Song not found",
      });
    }

    res.status(200).json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete song",
    });
  }
};

export {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
};


