//Features present: - Unsplash API background with randomized photos based on category specification.
// - Background theme updates based on time of day (morning, afternoon, evening).
// - Time and date display updates each second. - Progress bar updates every minute and displays percent of day passed thus far.
// - Contenteditable user input name that stores in local storage. - Greeting updates based on time of day.


'use strict';
let time, interval, hour, dayTime, dayTimeArr = ['morning', 'afternoon', 'evening'], headerArr = ['Morning', 'Afternoon', 'Evening'];
let date = document.querySelector('.date'), header = document.querySelector('.daytime'),
background = document.documentElement;

class ProgressBar {
    constructor (element) {
        this.valueElemn = element.querySelector(".progress-bar-value");
        this.fillElem = element.querySelector(".progress-bar-fill");
        //this.minute is used to keep track of whether the minute has changed, checked each second by setTime().
        this.minute = null;
    }

    setProgress() {
        let time2 = new Date();
        //calculate the percentage of minutes passed out of the total minutes in a day.
        let totalMin = (((time2.getHours() * 60) + time2.getMinutes()) / 1440) * 100;
        const percentage = totalMin + '%';
        //Update the width property with percent.
        this.fillElem.style.width = percentage;
    }
}

function searchPhotos() {
    let clientId = 'mRzRRSFM-J_PstQodQwPE51W7AWJoP44RJpt4pvK1jk';
    //Format the GET request using personal clientId. Query passes what is to be searched.
    let url = 'https://api.unsplash.com/photos/random?' + 'query=' + dayTimeArr[dayTime] + '&client_id=' + clientId;

    //Fetch JSON of retrieved photo
    fetch(url)
    .then(function (data) {
        return data.json();
    })
    .then(function (photo) {
        //We are only interested in the photo and nothing else, so we retrieve the photo URL in regular size.
        background.style.backgroundImage = `url('${photo.urls.regular}')`;
    })
    //Display error in case the API fails to retrieve a photo
    .catch(e => console.error("Failure: " + e.message));
}

function checkDayTime() {
    hour = time.getHours();
    //Check what time of day it is. 0 is morning, 1 is afternoon, 2 is night.
    if (hour <= 11) {
        dayTime = 0;
    } else if ((hour > 11) && (hour < 18)) {
        dayTime = 1;
    } else if (hour >= 18) {
        dayTime = 2;
    }
}

function setTime() {
    time = new Date();
    //Every second, update get current time and reassign the text of p tag with class date.
    date.textContent = 'Local Time: ' + time;
    //Preserve the current dayTime state to check whether the state should be changed.
    let old_dayTime = dayTime;
    //Check whether morning has switched to afternoon, etc.
    checkDayTime();
    //If the daytime state has changed, switch the Unsplash theme and greeting header to the correct state.
    if (old_dayTime != dayTime) {
        searchPhotos();
        header.textContent = `Good ${headerArr[dayTime]}`;
    }
    let minutes = time.getMinutes();
    //Update progress bar if the minute has changed.
    if (minutes > pb.minute) {
        pb.setProgress();
    }
}

function setup() {
    //Set interval that updates time and checks whether the time of day state should change.
    interval = setInterval(setTime, 1000);
    
    let name = document.getElementById("name");
    //Check whether user's name has been entered previosuly and saved in local storage.
    //If so, display the name.
    let saved_name = localStorage.getItem("name");
    if (saved_name != null) {
        name.textContent = saved_name;
    }
    //Listens for changes to contenteditable name 
    name.addEventListener("input", () => {
        //If a change has been made, update the user's name in local storage
        if (name.textContent != "") {
            localStorage.setItem("name", name.textContent);
        }
        //If the user enters nothing, reset back to the original text
        else {
            localStorage.setItem("name", "[Enter Your Name]")
        }
    }, false);
}


//Initialize everything
const pb = new ProgressBar(document.querySelector('.progress-bar'));
time = new Date();
//For progress bar: Store the current minute so that we can compare whether the current minute has changed.
pb.minute = time.getMinutes();
//Initialize the progress bar.
pb.setProgress();
//Initialize event listeners and intervals.
setup();