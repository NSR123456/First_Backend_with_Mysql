const express = require("express");
const colors = require("colors");
const morgan = require("morgan"); //kon api hit hoilo,tar detail show korbe, morgan - a middleware
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");

dotenv.config();

//rest obj
const app = express();

//middleware
// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for '${req.url}'`);
    next();
});


app.use(express.json()); 
app.use(morgan("dev"));

//routes
app.use('/api/v1/student',require('./routes/studentsRoutes'))

app.get("/test", (req,res) =>{
    res.status(200).send("<h1>Nodejs new  Mysql App<h1>");
});
//for app enhancement, use nodemon
//port for running application
const port = process.env.PORT || 8000;
//conditionally listen
mySqlPool
.query("SELECT 1")
.then(() => {
//my sql
console.log('MySQL DB connected'.bgCyan.white);

//listen
app.listen(port,()=> {
    console.log(`Server Running on port ${port}`.bgMagenta.white);
    });
})
.catch((error) => {
    console.log(error);
}); // create 1st api
