$(function () {

    //this is used to create different sized and coloured
    //circles according to how many deaths there have been
    let circleConfigs = {
        51: {//less than 51
            radius: 2,
            color: 'green',
            fillColor: '#00ff22',
            fillOpacity: 0.5
         },
         101: { //less than 101
            radius: 5,
            color: 'blue',
            fillColor: '#009dff',
            fillOpacity: 0.5
         },
         201: {
            radius: 10,
            color: 'blue',
            fillColor: '#009dff',
            fillOpacity: 0.5
         },
         501: {
            radius: 10,
            color: 'magenta',
            fillColor: '#FF00FF',
            fillOpacity: 0.5
         },
         1001: {
            radius: 10,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
         },
         1000000: {
            radius: 15,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1
         }
    }

    //function called to assign circle config
    //by the number passed
    function getCircle(num){
        let output = {
            radius: 10,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1
        };
        for(key in circleConfigs){
            if(num < key){
                output = circleConfigs[key];
                break;
            }
        }
        return output;
    }

    //lookup object for coordinates
    let geocodedAddresses = {}

    //load the address list with corresponding coordinates
    $.getJSON("/js/geocoded-addresses.json", function (data, status) {
        data.forEach(function (item) {
            //add the data to a dictionary style object
            //so that it is easy to look up each address
            geocodedAddresses[item.address] = {
                formatted: item.formatted, // just a nicer looking address - incase we want it
                geometry: item.geometry// lats & longs
            }
        })

    });

    //create map object and set default positions and zoom level
    let map = L.map('map').setView([20, 13], 2);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //headers we need to pass to rapidapi
    let opts = {
        headers:{
            "x-rapidapi-host" : "covid-19-coronavirus-statistics.p.rapidapi.com",
            "x-rapidapi-key": "6cd7107b6cmsh88259036196657dp1338ecjsn8042a1e8263b"
        }
    };

    //REST service endpoint
    let url = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats";


    let stats = [];
    //call the service
    $.ajax(url,opts).done(function (data, status) {
        stats = data.data.covid19Stats;

        //now create the circle markers
        for (let i = 0; i < stats.length; i++) {
            let item = stats[i];
            let address = item.province + "," + item.country;
            let geo = geocodedAddresses[address];
            if (geo) {
                if (geo.geometry && geo.geometry.lat) {
                    let txt = geo.formatted + "<br>Deaths: " + item.deaths;
                    let circle = getCircle(item.deaths);
                    L.circleMarker([geo.geometry.lat, geo.geometry.lng],circle)
                    .bindPopup(txt).addTo(map);
                } else {
                    console.log("Missing geometry: " + address);
                    console.log(geo);
                }
            } else {
                console.log("Missing: " + address);
            }
        }
    });

});