//OpenWeatherMap API key and base
const base = "http://api.openweathermap.org/data/2.5/weather?zip="
const key = "&appid=77b20d75a9a41af403cfd8678dbdb7fd"

//async post function
const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(data),
    });

    try{
        const newData = await response.json();
        return newData;
    } catch(err){
        console.log("POST error", err);
    }
}

//async GET function
const getData = async (url = "") => {
    const response = await fetch(url);

    try{
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch (err){
        console.log("GET error",err);
    }
};

//GET weather from api function
const getWeather = async (zip, countryCode) => {
    const response = await getData(base + zip + "," + countryCode + key);
    let weatherData = {
        temp: response.main.temp,
        icon: response.weather.icon,
    };
    return weatherData;
};


//generate new entry when form submitted
function submitEntry() {
    let zip = document.getElementById("zip").value;
    let countryCode = document.getElementById("countryCode").value;
    let feelings = document.getElementById("feelings").value;
    //TODO: check syntax for date
    let currentDate = Date.now();

    //get weather data from api
    getWeather(zip,countryCode)
    //then construct data object and send post request
    .then((weatherData) => {
        let data = {
            temp: weatherData.temp,
            icon: weatherData.icon,
            date: currentDate,
            content: feelings
        };
        postData("/addEntry", data);
    })
    //then get latest entry
    .then(() => {
        const response = getData("/getLatest");
        return response;
    })
    //then change document according to data
    .then((data) => {
        //check that data array on server side is not empty
        if (data !== null){
            document.getElementById("date").innerText = data.date;
            document.getElementById("temp").innerText = data.temp;
            document.getElementById("content").innerText = data.feelings;
            //TODO: check and add src for images from icon
        }
    });
}


//execution (event listeners)
document.addEventListener("DOMContentLoaded", () =>{

    //generate location automatically using geolocation
    document.getElementById("locationBtn").addEventListener("click", generateLocation());

    //generate new entry when form submitted 
    document.getElementById("generate").addEventListener("click", (event) => {
        event.preventDefault();
        submitEntry();
    });

    //show all entries 
    //document.getElementById("all-entries").addEventListener("click", showAllEntries());

});