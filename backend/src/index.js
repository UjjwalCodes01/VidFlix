const express = require('express')
const fileUpload = require('express-fileupload');
const path = require('path');
const connect = require('./connection/db');
const cors = require('cors')
require('dotenv').config({ path: path.resolve(__dirname, '../..env') });
const userRoutes = require('./router/userRouter')
const movieRoutes = require('./router/movieRouter')
const adminRoutes = require('./router/adminRouter')
const app = express();
const PORT = process.env.PORT
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(fileUpload({ 
    useTempFiles: true , 
    tempFileDir: path.join(__dirname, 'tmp'),
    limits :{
        fileSize: 100*1024*1024
    }
}));

app.use('/api/users',userRoutes)
app.use('/api/movies',movieRoutes);
app.use('/api/admin',adminRoutes);
const start = async ()=>{
    await connect()
    app.listen(PORT, ()=>{
    console.log("Server started at ",PORT)
})
}

start()
