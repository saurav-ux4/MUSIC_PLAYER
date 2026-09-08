const Song = require("../models/Song");

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
    const { title, duration, audioUrl, coverImage } = req.body;

    if (!title || duration === undefined || !audioUrl || !coverImage) {
      return res.status(400).json({
        message: "All song fields are required",
      });
    }

    const song = await Song.create({
      title,
      duration,
      audioUrl,
      coverImage,
    });

    res.status(201).json(song);
  } catch (error) {
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

module.exports = {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
};


