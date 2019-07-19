const request = require('request');

module.exports = (latitude, longitude, callback, lang) =>{
    const url = "https://api.darksky.net/forecast/ab96fe91843dbfed9219d45a2eb655cf/" + latitude + "," + longitude + "?units=si&lang=" + (lang || "en");
    request({url, json:true}, (error, response)=>{
        //ошибка на стороне запроса(т.е. низкоуровневая ошибка)
        if(error)
        {
            callback("Unable to connect to weather service. :c", undefined)
            return;
        }
        const {body} = response;
        //более высокоуровневая ошибка, которую возвращает api сайта
        if(body.error)
        {
            callback(body.error, undefined);
            return;
        }
        
        callback(undefined, "Week: " + body.daily.summary + ". It's currently " + body.currently.temperature + " degrees out. It's " + body.currently.precipProbability + " chanse of rain. " + 
        "Current UV index: " + body.currently.uvIndex + ", current wind: " + body.currently.windSpeed + "m/s.");
    })
}

