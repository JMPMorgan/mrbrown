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
    });
}
