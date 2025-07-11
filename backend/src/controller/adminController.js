const cloudinary = require("../connection/cloudinary");
const movie = require("../models/movieModel");


const UploadToCloudinary = async (file,isVideo = false)=>{
    try {
        console.log("uploading to cloudinary ", file.tempFilePath)
    const result = await cloudinary.uploader.upload(file.tempFilePath ,{
        resource_type : isVideo ? "video" : "image"
    })
    console.log(result.secure_url);
    return result.secure_url
    } catch (error) {
        console.error(" Cloudinary Upload Error:");
        console.error("Full Error:", error);
        console.error("File Path:", file?.tempFilePath);
        throw new Error("error uploading to cloudinary");
    }
}

const addMovies = async(req,res)=>{

    try {
        const imageFile = req.files?.image;
        const videoFile = req.files?.video;
        if (!imageFile || !videoFile) {
  console.log("Please upload all files");
  return res.status(400).json({ message: "Upload all files" });
}
    const {title , type ,duration} = req.body;

     const imageUrl = await UploadToCloudinary(imageFile,false);
     const videoUrl = await UploadToCloudinary(videoFile, true)

    const Movie = await movie.create({
        title,
        type,
        imageUrl,
        videoUrl,
        duration : parseInt(duration)
    });
    await Movie.save();
    if(!Movie){
        console.log('movie not created')
        return res.status(402).json({message : "movie not created"})
    }
    return res.status(201).json(Movie)
    } catch (error) {
        console.log("movie is not created");
        return res.status(500).json({message : error})
    }
}

const deleteMovie = async (req,res)=>{
    try {
    const {id} = req.params;
    await movie.findByIdAndDelete(id);
    return res.status(201).json({message : "movie delete successfully"})
    } catch (error) {
        console.log("delete movie failed", error);
        return res.status(501).json({message : error});
    }
}
module.exports = {addMovies , deleteMovie}