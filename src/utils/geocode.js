const request = require('request');

const geocode = (address, callback) =>
{
    //encodeURIComponent - для обработки специальных символов для url(?, &). если они будут в строке адресса без вызова этой функции скрипт просто крашнется
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1Ijoic29tZWNvZGVyIiwiYSI6ImNqeTJ2ZmV5bzBwdW8zY284NXhpbHRsY2EifQ.ox7CPfEosoZBPauWYOP31A&limit=1";
    request({url, json:true}, (error, response)=>
    {
        if(error)
        {
            callback("Unable to connect to geocoding service. :c", undefined);
            return;
        }
        const {body} = response;
        if(body.message)
        {
            callback("Error: " + body.message, undefined);
            return;        
        }
        if(body.features.length === 0)
        {
            callback("Location is not found. :c", undefined);
            return;
        }
        callback(undefined, {
            latitude: body.features[0].center[1],
            longitude: body.features[0].center[0],
            location: body.features[0].place_name
        });
    })
}

module.exports = geocode;