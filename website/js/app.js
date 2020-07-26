//OpenWeatherMap API key and base
const base = "http://api.openweathermap.org/data/2.5/weather?zip="
const key = "&appid=&units=metric"

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
        console.log("GET successful", newData);
        return newData;
    } catch (err){
        console.log("GET error",err);
    }
};

//GET weather from api function
const getWeather = async (zip, countryCode) => {
    const response = await getData(base + zip + "," + countryCode + key);
    const weatherData = {
        temp: response.main.temp,
        icon: response.weather[0].icon,
    };
    return weatherData;
};


//generate new entry when form submitted
function submitEntry() {
    const zip = document.getElementById("zip").value;
    const countryCode = document.getElementById("countryCode").value;
    const feelings = document.getElementById("feelings").value;
    const d = Date.now();
    const currentDate = new Date(d).toDateString();

    //get weather data from api
    getWeather(zip,countryCode)
    //then construct data object and send post request
    .then((weatherData) => {
        const data = {
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
            document.getElementById("date").innerHTML = data.date;
            document.getElementById("temp").innerHTML = `${data.temp}°C`;
            document.getElementById("content").innerHTML = data.feelings;
            const icon = document.getElementById("icon");
            icon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
            document.getElementById("entryHolder").style.display = "flex";
        }
    });
}

//get all entries
const getAllEntries = async () => {
    const response = await getData("/all");
    console.log("Get all", response);
    return response;
}

//hide/show all entries variables 
const showEntriesBtn = document.getElementById("show-all-entries");
const hideEntriesBtn = document.getElementById("hide-all-entries");
const allEntriesContainer = document.getElementById("all-entries-container");

//show all entries
function showAllEntries() {
    getAllEntries()
    .then ((entries) => {
        const fragment = new DocumentFragment();
        for(entry of entries) {
            const container = document.createElement("div");
            container.classList.add("entryContainer");
            container.innerHTML = `<div class="entryDate">${entry.date}</div>
            <div class="entryWeather">
                <img src="http://openweathermap.org/img/wn/${entry.icon}@2x.png" alt="weather icon" class="entryIcon">
                <div class="entryTemp">${entry.temp}°C</div>
            </div>
            <div class="entryContent">${entry.feelings}</div>`;
            fragment.append(container);
        }
        showEntriesBtn.style.display = "none";
        allEntriesContainer.append(fragment);
        allEntriesContainer.style.display = "block";
        hideEntriesBtn.style.display = "block";
    });
}

//hide all entries
function hideAllEntries () {
    allEntriesContainer.style.display = "none";
    hideEntriesBtn.style.display = "none";
    showEntriesBtn.style.display = "block";
}


//execution (event listeners)
document.addEventListener("DOMContentLoaded", () =>{

    //generate new entry when form submitted 
    document.getElementById("generate").addEventListener("click", (event) => {
        event.preventDefault();
        submitEntry();
    });

    //show all entries 
    showEntriesBtn.addEventListener("click", showAllEntries);

    //hide entries when shown
    hideEntriesBtn.addEventListener("click", hideAllEntries);

});
