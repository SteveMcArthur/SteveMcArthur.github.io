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
    let countryList = {};
    let cumulativeUS = 0;
    function addToCountryList(item,geo) {
        if(geo){

            if(countryList[item.country]){
                countryList[item.country].confirmed = countryList[item.country].confirmed + item.confirmed;
                countryList[item.country].deaths = countryList[item.country].deaths + item.deaths;
                countryList[item.country].recovered = countryList[item.country].recovered + item.recovered;
            }else {
                countryList[item.country] = {
                    confirmed: parseInt(item.confirmed),
                    deaths: parseInt(item.deaths),
                    recovered: parseInt(item.recovered),
                    lat: geo.lat,
                    lng: geo.lng
                }
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
            addToCountryList(item,geo);
            if (geo) {
                if (geo.geometry && geo.geometry.lat) {
                    if(item.deaths > 0 ){
                        txt = geo.formatted + "<br>Deaths: " + item.deaths;
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
        L.circleMarker([37.0902, -95.7129], circle)
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