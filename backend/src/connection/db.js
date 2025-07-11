const mongoose = require('mongoose');

const connect = async ()=>{
    try {
    const database = await mongoose.connect('mongodb://127.0.0.1:27017/mx-player');
    console.log("mongoose is connected at", database.connection.host);
    } catch (error) {
        console.log('mongoose is not connected ', error)
        throw(error);
    }

}

module.exports = connect