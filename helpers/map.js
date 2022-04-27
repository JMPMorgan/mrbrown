let mapboxAccessToken = 'pk.eyJ1Ijoiam9uYXRoYW5tb3JnYW5wIiwiYSI6ImNreXVlMzBqZzFtbWkyb3BtM3VtdnJ1NmwifQ.FbfKr4KSPmE5gVCt815oqw';


let query='';
const KEYAPI='a08ab980938843789855fc7e05f161d3';
const APIGEO=`https://api.opencagedata.com/geocode/v1/json`;

let map_main,layerGroup;

$(async()=>{

    map_main = L.map('map').setView([25.6802019, -100.315258], 13);
    addToMap(map_main);
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
    console.log(response);
    $('#buscar-direccion').on('click',async()=>{
        const calle=$('#calle').val();
        const colonia=$('#colonia').val();
        const num_casa=$('#num-casa').val();
        const municipio=$('#municipio option:selected').val();
        if(calle.length>0){
            calle.replace(" ","%20");
        }
        if(colonia.length>0){
            colonia.replace(" ","%20");
        }
        const query=`MEXICO,NUEVO LEON, ${municipio.toUpperCase()},  ${calle.toUpperCase()}, ${colonia.toUpperCase()}`;
        let response=await searchDirection(query);
        if(response.results[0].state_code!=='NLE'){
        let control=0;
        do {
            let query;
            control===0 ?
             query=`MEXICO, NUEVO LEON, ${municipio.toUpperCase()}, ${colonia.toUpperCase()}`:
             query=`MEXICO, NUEVO LEON, ${municipio.toUpperCase()}, ${calle.toUpperCase()}`
            if(control===0 || control===1){
                control++;
            }else{
                break;
            }
            response= await searchDirection(query);
        } while (response.results[0].state_code!=='NLE');
        
        }

        if(response.status.message==="OK"){
            if(response.results[0].state_code!=='NLE'){
                await Swal.fire(
                    "INFORMACION",
                    "Debido a que el buscador esta en estado beta, identiifque la direccion exacta de su pedido",
                    "info"
                );
                map_main.remove();
            //L.map('map').remove();
                map_main =L.map('map').setView([response.results[0].geometry.lat,response.results[0].geometry.lng],16);
                addToMap(map_main);
            }else{
                Swal.fire(
                    'No se pudo encontrar la direccion que solicito',
                    'Ingrese de nuevo la direccion o intente con una nueva',
                    'error'
                );
            }
        }
    });
    $('#btn-oculto').on('click',()=>{
        const lat_home=$('#confirmar-pedido').attr('data-x');
        const lng_home=$('#confirmar-pedido').attr('data-y');
        const sucursal_lat=$('#sucursal option:selected').attr('data-x');
        const sucursal_lng=$('#sucursal option:selected').attr('data-y');
        map_main.remove();
        //map_main = L.map('map').setView([25.6802019, -100.315258], 10);
        map_main=L.map('map', {
            layers: MQ.mapLayer(),
            center: [25.6802019, -100.315258],
            zoom: 12
        });
        addToMap(map_main);
        let dir = MQ.routing.directions();
        const dir1=`${lat_home}, ${lng_home}`;
        const dir2=`${sucursal_lat}, ${sucursal_lng}`;
        console.log(dir.route);
        console.log(dir);
        dir.route({
            locations:[
                {latlng:{lat:lat_home,lng:lng_home}},
                {latlng:{lat:sucursal_lat,lng:sucursal_lng}}
            ]
        });
        console.log(dir.route);
        
        CustomRouteLayer = MQ.Routing.RouteLayer.extend({
            createStartMarker: (location) => {
                let custom_icon;
                let marker;

                custom_icon = L.icon({
                    iconUrl: '../assets/img/red_maker.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            },

            createEndMarker: (location) => {
                let custom_icon;
                let marker;

                custom_icon = L.icon({
                    iconUrl: '../assets/img/red_maker.png',
                    iconSize: [20, 29],
                    iconAnchor: [10, 29],
                    popupAnchor: [0, -29]
                });

                marker = L.marker(location.latLng, {icon: custom_icon}).addTo(map);

                return marker;
            }
        });
        
        map_main.addLayer(new CustomRouteLayer({
            directions: dir,
            fitBounds: true
        })); 
        /*map_main.addLayer(MQ.routing.routeLayer({
            directions:dir,
            fitBounds:true
        }));*/
    });
});


const searchDirection=async(query)=>{
    const response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        data:{
            'key':KEYAPI,
            'no_annotations':1,
            'language':'es',
            'query':query   

        },
        url:APIGEO
    });
    //console.log(response);
    return response;
}


const addToMap=(map)=>{

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', 
    {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapboxAccessToken
    }).addTo(map);
    layerGroup=L.layerGroup().addTo(map);
    map.on('click',(event)=>{
        layerGroup.clearLayers();
        map.closePopup();
        const lat = event.latlng.lat;
        const lng= event.latlng.lng;
        const marker = L.marker([lat,lng]).addTo(map);
        marker.addTo(layerGroup);
        marker.bindPopup("Lugar de pedido").openPopup();
        $('#confirmar-pedido').attr('data-x',lat);
        $('#confirmar-pedido').attr('data-y',lng);
    });
}
