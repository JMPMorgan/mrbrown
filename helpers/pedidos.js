
$(async()=>{
 let response= await $.ajax({
    method:'GET',
    datatype:'JSON',
    url:'../backend/pedidos.php'
 });
 response=JSON.parse(response);
 console.log(response);
 if(response.success===true){
     console.log(response.info);
     const info=response.info;
     const btn_email=$(`<button class=' my-2 d-flex justify-content-end btn btn-primary'>Enviar a Email</button>`);
     $('#all-pedidos').before(btn_email);
     $(btn_email).on('click',()=>sendEmail());
     info.forEach(element=>{
        let total=0;
        const order=element.order;
        let html_order='';
        order.forEach(ele=>{
            html_order+=`<li class='d-flex justify-content-between'><span>${ele.name_food} X ${ele.how_many} </span><span>$ ${ele.price_food}.00</span></li>`
            total+=ele.price_food;
        });
        const html=`<div class='col-12 border-bottom'>
        <p class='text-muted h4'>NUMERO DE ORDEN: #<span id='n-order'>${element.id}</span></p>
        <ul id='lista-orden'>
        ${html_order}
        <li class='d-flex justify-content-end border-top'><span>TOTAL: ${total}.00</span></li>
        </ul>
         </div>`;
         $('#all-pedidos').append(html);
     });

     /*let total=0;
     let html_mid='';
     let html_top=`<div class='col-12 border-bottom'>
     <p class='text-muted h4'>NUMERO DE ORDEN: #<span id='n-order'>${response.info[0].id}</p>
     <ul id='lista-orden'>`;

    const html_btm=`
    <li class='d-flex justify-content-end border-top'><span>$ ${total}.00</span></li>
    </ul>
    </div>`;
    html_top=html_top+html_mid+html_btm;*/
    
 }else{
     if(response.logged===false){

     }else{
        printErrors(response.error);
     }
 }

});

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

const sendEmail=async()=>{
  const text=$('#all-pedidos').html();
  $('#loader').removeClass('loader--hidden');
  $('#loader').addClass('loader');
  $('#all-pedidos').css('display','none');
  const data=new FormData();
  data.append('text',text);
  let response=await fetch('../backend/sendEmail.php',{
    method:'POST',
    body:data
  }).then((response)=>{
    return response.text();
  }).finally(()=>{
    $('#loader').removeClass('loader');
    $('#loader').addClass('loader--hidden');
    $('#all-pedidos').css('display','block');
  });
   console.log(response);
   response=JSON.parse(response);
}