//set up express and create instance
const express = require("express");
const app = express();

//point express instance to project folder
app.use(express.static("website"));

//dependencies
const cors = require("cors");
const bodyParser = require("body-parser");

//middleware
//use cors
app.use(cors());
//use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//spin up server
const port = 8000;
const server = app.listen(port, () => {
    //console.log(server);
    console.log(`running on localhost:${port}`);
});

//API ednpoints
//for entries
const projectData = [ ];


//POST route to add new entry
app.post("/addEntry", (req, res) => {
    //console.log("req", req.body);
    let newData = {
        temp: req.body.temp,
        date: req.body.date,
        icon: req.body.icon,
        feelings: req.body.content
    }
    projectData.push(newData);
    console.log("POST successful", projectData);
    res.send(JSON.stringify(newData));
});

//GET route to get latest entry
app.get("/getLatest", (req, res) => {
    let len = projectData.length;
    if(len > 0){
        console.log("GET latest", projectData[len-1]);
        res.send(projectData[len-1]);
    }
    else{
        res.send(null);
    }
});

//GET route to get all entries
app.get("/all", (req,res) => {
    console.log(projectData);
    res.send(projectData);
});