let mapboxAccessToken = 'pk.eyJ1Ijoiam9uYXRoYW5tb3JnYW5wIiwiYSI6ImNreXVlMzBqZzFtbWkyb3BtM3VtdnJ1NmwifQ.FbfKr4KSPmE5gVCt815oqw';

let map = L.map('map').setView([25.6802019, -100.315258], 13);
let query='';
const KEYAPI='a08ab980938843789855fc7e05f161d3';
const APIGEO=`https://api.opencagedata.com/geocode/v1/json`;
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
{
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxAccessToken
}).addTo(map);


$(async()=>{
    let response= await $.ajax({
        method:"GET",
        datatype:'JSON',
        data:{
            'key':KEYAPI,
            'no_annotations': 1,
            'language':'es',
            'query':'25.6802019, -100.315258'
        },
        url:APIGEO
    });
});
