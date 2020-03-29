$(function () {

    //this is used to create different sized and coloured
    //circles according to how many deaths there have been
    let circleConfigs = {
        51: { //less than 51
            radius: 2,
            color: 'green',
            fillColor: '#00ff22',
            fillOpacity: 0.5
        },
        101: { //less than 101
            radius: 5,
            color: 'green',
            fillColor: '#00ff22',
            fillOpacity: 1
        },
        201: {
            radius: 5,
            color: 'blue',
            fillColor: '#009dff',
            fillOpacity: 0.5
        },
        501: {
            radius: 10,
            color: 'blue',
            fillColor: '#009dff',
            fillOpacity: 1
        },
        1001: {
            radius: 5,
            color: 'magenta',
            fillColor: '#FF00FF',
            fillOpacity: 0.5
        },
        2501: {
            radius: 5,
            color: 'magenta',
            fillColor: '#FF00FF',
            fillOpacity: 1
        },
        5001: {
            radius: 5,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        },
        10001: {
            radius: 10,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        },
        20001: {
            radius: 15,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1
        }
    }

    //function called to assign circle config
    //by the number passed
    function getCircle(num) {
        let output = {
            radius: 10,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 1
        };
        for (key in circleConfigs) {
            if (num < key) {
                output = circleConfigs[key];
                break;
            }
        }
        return output;
    }

    //lookup object for coordinates
    let geocodedAddresses = {};
    let addressKeys = [];
    function findCoords(address){
        let key = "";
        addressKeys.every(item => {
            return item.indexOf(item);
        });
        if(key){
            return geocodedAddresses[key].geometry;
        }
    }

    //load the address list with corresponding coordinates
    $.getJSON("/js/geocoded-addresses.json", function (data, status) {
        data.forEach(function (item) {
            //add the data to a dictionary style object
            //so that it is easy to look up each address
            geocodedAddresses[item.address] = {
                formatted: item.formatted, // just a nicer looking address - incase we want it
                geometry: item.geometry // lats & longs
            }
        });
        addressKeys = Object.keys[geocodedAddresses];

    });

    //create map object and set default positions and zoom level
    let map = L.map('map').setView([20, 13], 2);
    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        zoomControl: false,
        scrollWheelZoom: false
    }).addTo(map);
    map.zoomControl.remove();
    map.scrollWheelZoom.disable();


    //headers we need to pass to rapidapi
    let opts = {
        headers: {
            "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
            "x-rapidapi-key": "6cd7107b6cmsh88259036196657dp1338ecjsn8042a1e8263b"
        }
    };

    //REST service endpoint
    let url = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats";


    let stats = [];
    let countryList = {
        "US": {
            lat: 37.0902,
            lng: -95.7129,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "United Kingdom": {
            lat: 55.3781,
            lng: -3.4360,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "France": {
            lat: 46.2276,
            lng: 2.2137,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "China": {
            lat: 35.8617,
            lng: 104.1954,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "Germany": {
            lat: 35.8617,
            lng: 104.1954,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "Spain": {
            lat: 40.4637,
            lng: 3.7492,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "Italy": {
            lat: 41.8719,
            lng: 12.5674,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        "Iran": {
            lat: 41.8719,
            lng: 12.5674,
            confirmed: 0,
            deaths: 0,
            recovered: 0
        }
    };
    let cumulativeUS = 0;
    function addToCountryList(item,geo) {
 
            if(countryList[item.country]){
                countryList[item.country].confirmed = countryList[item.country].confirmed + item.confirmed;
                countryList[item.country].deaths = countryList[item.country].deaths + item.deaths;
                countryList[item.country].recovered = countryList[item.country].recovered + item.recovered;
                if(geo){
                    if(!countryList[item.country].lat || countryList[item.country].lat == 0 ){
                        countryList[item.country].lat = geo.lat;
                        countryList[item.country].lng = geo.lng;
                    }
                }
            }else {
                countryList[item.country] = {
                    confirmed: parseInt(item.confirmed),
                    deaths: parseInt(item.deaths),
                    recovered: parseInt(item.recovered),
                    lat: geo ? geo.lat : 0,
                    lng: geo ? geo.lng : 0
                }
            }
        

    }
    let txt = "";
    //call the service
    $.ajax(url, opts).done(function (data, status) {
        stats = data.data.covid19Stats;

        //now create the circle markers
        for (let i = 0; i < stats.length; i++) {
            let item = stats[i];
            let address = item.province + "," + item.country;
            let geo = geocodedAddresses[address];
            if(!geo){
                if(countryList[item.country]){
                    geo = {
                        geometry: {
                            lat: countryList[item.country].lat,
                            lng: countryList[item.country].lng,
                        }
                    }
                }
            }
            addToCountryList(item,geo);
            if (geo) {
                if (geo.geometry && geo.geometry.lat) {
                    if(item.deaths > 0 ){
                        let loc = geo.formatted || item.keyId;
                        txt = loc + "<br>Deaths: " + item.deaths;
                        let circle = getCircle(item.deaths);
                        L.circleMarker([geo.geometry.lat, geo.geometry.lng], circle)
                            .bindPopup(txt).addTo(map);
                    }
                } else {
                    //console.log("Missing geometry: " + address);
                    //console.log(geo);
                }
            } else {
                //console.log("Missing: " + address);
            }
        }
        txt = "All United States<br>Deaths: " + countryList.US.deaths;
        let circle = getCircle(countryList.US.deaths);
        L.circleMarker([countryList.US.lat, countryList.US.lng], circle)
            .bindPopup(txt).addTo(map);

            txt = "All UK<br>Deaths: " + countryList["United Kingdom"].deaths;
            circle = getCircle(countryList["United Kingdom"].deaths);
            L.circleMarker([countryList["United Kingdom"].lat, countryList["United Kingdom"].lng], circle)
                .bindPopup(txt).addTo(map);
        var content = "<div class='row'><h5>Deaths..</h5><div> {{content}}</div></div>"
        var tpl = "<span class='col-md-2'>{{country}}: {{deaths}},</span>   ";
        var txt = tpl.replace("{{country}}","USA").replace("{{deaths}}",countryList.US.deaths);
        txt = txt + tpl.replace("{{country}}","UK").replace("{{deaths}}",countryList["United Kingdom"].deaths);
        txt = txt + tpl.replace("{{country}}","Italy").replace("{{deaths}}",countryList["Italy"].deaths);
        txt = txt + tpl.replace("{{country}}","China").replace("{{deaths}}",countryList["China"].deaths);
        txt = txt + tpl.replace("{{country}}","Spain").replace("{{deaths}}",countryList["Spain"].deaths);
        txt = txt + tpl.replace("{{country}}","France").replace("{{deaths}}",countryList["France"].deaths);
        txt = txt + tpl.replace("{{country}}","Germany").replace("{{deaths}}",countryList["Germany"].deaths);
        txt = txt + tpl.replace("{{country}}","Australia").replace("{{deaths}}",countryList["Australia"].deaths);
        txt = content.replace("{{content}}",txt);
        $(".map-container .alert").html(txt);

    });


});