const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    videoUrl : {
        type : String,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },


},{timestamps: true})

const movie = new mongoose.model('movies',movieSchema);

module.exports = movie;