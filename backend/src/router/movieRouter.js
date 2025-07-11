const {Router} = require('express');
const { getAllMovies, getTopMovies, MoviesForYou, MovieOnDemand, getMovieById } = require('../controller/movieController');

const router = Router()

router.get('/',getAllMovies);
router.get('/top',getTopMovies);
router.get('/for-you',MoviesForYou);
router.get('/on-demand',MovieOnDemand);
router.get('/get/:id',getMovieById);

module.exports = router
