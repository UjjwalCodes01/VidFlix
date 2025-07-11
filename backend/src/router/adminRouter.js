const {Router} = require('express');
const { addMovies, deleteMovie } = require('../controller/adminController');


const router = Router();

router.post('/create', addMovies);
router.delete('/delete/:id', deleteMovie);

module.exports = router