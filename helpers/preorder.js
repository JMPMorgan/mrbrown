$(async ()=>{
 let response = await $.ajax({
     method:'GET',
     datatype:'JSON',
     url:'../backend/preorder.php'
 });
 response=JSON.parse(response);
 if(response.logged===false){
    console.log('Error');
 }else{
    if(response.success===true){
         const order=JSON.parse(response.info.preorder);
         console.log(order); 
         putOrder(order.uuidsOrder);
         $('#order').attr('data',response.info.id);
    }else{
        console.log('Error');
    }
 }
 response= await $.ajax({
    method:'GET',
    datatype:'JSON',
    data:{
        id:1
    },
    url:'../backend/payment_info.php'
 });
 response=JSON.parse(response);
 if(response.success===true){
    //Informacion de pago cargada correctamente
    console.log(response);
    const info=response.info;
    let i=1;
    info.forEach(element=>{
        const last_numbers=element.card.slice(12,16);
        const html=`<div>
                        <input type='radio' name='metodo' id='metodo${i}' data='${element.id}'>
                        <label for='metodo${i}'>**** **** **** ${last_numbers}</label>
                    </div>`;
        $('#payment-info').append(html);
        i++;
    });
 }else{
     if(response.logged===false){
        //El usuario no esta logeado
     }else{
        const errors=response.error;
        const no_payment=errors.find(element=>element===2);
        if(no_payment===2){
            await Swal.fire(
                "No se pudo encontrar informacion de pago",
                "Debe registrar una tarjeta para realizar el pago",
                "info"
            );
            window.location='profile.html?query=pago';
        }
        else{
            printErrors(response.error);
        }
     }
 }
 response =await $.ajax({
    method:'GET',
    datatype:'JSON',
    data:{
        id:1
    },
    url:'../backend/sucursal.php'
 });
 response=JSON.parse(response);
 if(response.success===true){
    const info=response.info;
    info.forEach(element=>{
        const html=`<option value='${element.id}' data-x='${element.lat}' data-y='${element.lng}'>
        ${element.nombre}</option>`;
        $('#sucursal').append(html);
    });
 }else{
     if(response.logged===false){

     }else{
         printErrors(response.errors);
     }
 }
 $('#confirmar-pedido').on('click',()=>{

     makeOrder();
 })
});

const putOrder=(order)=>{
    let total=0;
    order.forEach(element => {
        const html=$(`<li class='d-flex justify-content-between order-food'  data='${element.uuid}'>
            <span>${element.name} X <span id='number-food'>${element.number}</span></span>
            <span>${element.price_food}</span>
        </li>`);
        total+=Number(element.price_food);
        $('#lista-orden').append(html);
    })
    const html_total=`<li class='d-flex justify-content-end'>
                        <span>TOTAL   : $ ${total}.00</total>
                    </li>`;
    $('#lista-orden').append(html_total);
}

const makeOrder=async()=>{
    const lat=$('#confirmar-pedido').attr('data-x');
    const lng=$('#confirmar-pedido').attr('data-y');
    const method=$('input[type="radio"]:checked').attr('data');//
    const sucursal=$('#sucursal option:selected').val();
    const sucursal_lat=$('#sucursal option:selected').attr('data-x');
    const sucursal_lng=$('#sucursal option:selected').attr('data-y');
    const id_order=$('#order').attr('data');//
    const data_food=[];
    $('#lista-orden .order-food').each((i,element)=>{
        const food={};
        food.uuid=$(element).attr('data');
        food.number=$(element).find('#number-food').text();
        /*const num_food=$(element).find('#number-food').text();
        data_food.push( $(element).attr('data'));*/
        data_food.push(food); 
   });
    console.log(data_food)
    
    if(sucursal!=='0'){
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                lat,
                lng,
                method,
                sucursal,
                data_food,
                id:1
            },
            url:'../backend/orders.php'
        });
        response=JSON.parse(response);
        if(response.success===true){
            Swal.fire({
                icon: 'success',
                title: 'Pedido Hecho',
                text: 'Su pedido se ha realizado con exito',
              });
            $('input').attr('disabled','true');
            $('select').attr('disabled','true');
            $('#buscar-direccion').css('display','none');
            $('#confirmar-pedido').css('display','none');
            const html=`<h3>Numero de Orden:${response.info}</h3>`
            $('#text-direccion').before(html);
            const btn=$(`<button class='btn btn-primary'>Regresar a Pagina Principal</button>`);
            $('#text-direccion').before(btn);
            $(btn).on('click',()=>window.location='index.html');
            $('#btn-oculto').click();
        }else{
            printErrors(response.error);
        }
    }

    /*
    Swal.fire({
        icon: 'success',
        title: 'Pedido Hecho',
        text: 'Su pedido se ha realizado con exito',
      });
    $('input').attr('disabled','true');
    $('select').attr('disabled','true');
    $('#buscar-direccion').css('display','none');
    $('#confirmar-pedido').css('display','none');
    const html=`<h1>Numero de Orden:000001</h1>`
    $('#text-direccion').before(html);
    const btn=$(`<button class='btn btn-primary'>Regresar a Pagina Principal</button>`);
    $('#text-direccion').before(btn);
    $(btn).on('click',()=>window.location='index.html');
    */
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

const printErrors = (error) => {
    let html = 'Verificar información:';
    let li = '<li>';
    let li_last = '</li>';
    for (let i = 0; error.length > i; i++) {
      let text = li + error[i] + li_last;
      html = html + text;
    }
    Toast.fire({
      icon: 'warning',
      html: html
    });
  }

/*
function getParameterByName(str) {
  str = str.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  let regex = new RegExp("[\\?&]" + str + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
 */