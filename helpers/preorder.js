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
         putOrder(order.uuidsOrder);
         
    }else{
        console.log('Error');
    }
 }
 $('#confirmar-pedido').on('click',()=>{
     makeOrder();
 })
});

const putOrder=(order)=>{
    let total=0;
    order.forEach(element => {
        const html=$(`<li class='d-flex justify-content-between'>
            <span>${element.name} X ${element.number}</span>
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

const makeOrder=()=>{
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
}