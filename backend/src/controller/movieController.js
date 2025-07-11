const movie = require("../models/movieModel");

const getAllMovies = async (req,res)=>{
    try {
        const movies = await movie.find().sort({ createdAt: -1 });;
        if(!movies) return res.status(402).json({success: false , message : "movies not found"})
            return res.status(200).json(movies)
    } catch (error) {
        console.log("error in fetching all movies", error);
        return res.status(500).json({
            success : false,
            error : error,
            message : "failed to fetch all movies"
        })
    }
}

const getMovieById = async (req,res)=>{
    try {
        const {id} = req.params;
        const result = await movie.findById(id)
        if(!result){
            return res.status(404).json({
                success : false,
                message : "not find any movie"
            })
        }
        return res.status(200).json(result)
    } catch (error) {
        console.log("error in getting movies by id", error);
        return res.status(500).json({
            success : false,
            error : error,
            message : "failed to get movies"
        })
    }
}

const getTopMovies = async (req,res)=>{
    try {
        const movies = await movie.aggregate([
            {
                $sample : {size : 6}
            },
            {
                $project : {
                    _id : 1,
                    title : 1,
                    type: 1,
                    imageUrl : 1,
                    videoUrl: 1,
                }
            },
        ])
        return res.status(200).json(movies);
    } catch (error) {
        console,log("unable to get top movies", error);
        return res.status(500).json({
            success : false,
            error : error,
            message : "unable to fetch movies"
        })
    }
}

const MoviesForYou = async (req,res)=>{
    try {
        const movies = await movie.aggregate([
            {
                $sample : {size : 6}
            },
            {
                $project : {
                    _id :1,
                    title : 1,
                    type :1,
                    imageUrl:1,
                    videoUrl :1
                }
            }
        ])
        return res.status(200).json(movies);
    } catch (error) {
        console.log('error in getting movies for you', error);
        return res.status(201).json({
            success : false,
            error : error,
            message : "unable to fetch movies"
        })
    }
}

const MovieOnDemand = async (req,res)=>{
    try {
        const movies = await movie.aggregate([
            {
                $sample : {size : 6}
            },
            {
                $project : {
                    _id :1,
                    title : 1,
                    type :1,
                    imageUrl:1,
                    videoUrl :1
                }
            }
        ])
        return res.status(200).json(movies)
    } catch (error) {
        console.log("error in getting movies on demand", error);
        return res.status(201).json({
            success : false,
            error : error,
            message : "unable to fetch movies",

        })
    }
}

module.exports = {getAllMovies,getMovieById,getTopMovies,MoviesForYou,MovieOnDemand}