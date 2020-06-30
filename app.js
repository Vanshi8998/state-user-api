const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const apiRoutes = require('./routes')
require('dotenv/config')
port=8080
const app = express()

app.use(bodyParser.json())
app.use('/api', apiRoutes)


const moongoose=require('mongoose');

//connect to database
moongoose.connect('mongodb://localhost/project_db');

//acquire the connection

const db= moongoose.connection;
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
//error
db.on('error', console.error.bind(console, 'connection error:'));

//up and running
db.once('open',function()
{
    console.log('Connected to database successfully');
})


app.listen(port,function(err)
{
    if(err)
    {
        console("ERROR: Server is not listening on the port", port);
        return;
    }
    console.log("Server is up & Successfully running on the port",port);
})
