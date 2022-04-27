const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

$(()=>{
    /*console.log(window.parent);
    console.log(window.parent.parent);*/
    const check=window.parent.parent.document.querySelector('#check-iframe');
    /*console.log(window.parent.parent);
    console.log(check);
    check.value=1;
    console.log(check);*/
    $('#btn-add').on('click',async()=>{
        const num_card=$('#ed-num').val();
        const date_exp=$('#ed-date').val();
        const ccv=$('#ed-ccv').val();
        const actual=new Date(Date.now());
        const date1=new Date(date_exp);
        const errors=[];
        if(num_card.length!==16){
            errors.push('El numero de tarjeta debe tener una longitud de 16');
        }
        if(checkOnlyNumbers(num_card)===false){
            errors.push('Solo debe ingresar numeros en el campo de  el numero de tarjeta');
        }
        if(checkOnlyNumbers(ccv)===false){
            errors.push('Solo debe ingresar numeros en el campo de CCV');
        }
        if(actual>=date1){
            errors.push('La fecha de expiracion de la tarjeta debe ser mayor al dia actual');        
        }
        if (ccv.length>4||ccv.length<2){
            errors.push('El codigo de seguridad debe tener una longitud de 2 a 4 numeros');
        }
        if(errors.length>0){
            printErrors(errors);
        }else{
            let response = await $.ajax({
                method:'POST',
                datatype:'JSON',
                data:{
                    id:2,
                    num_card,
                    date_exp,
                    ccv
                },
                url:'../backend/payment_info.php'
            });
            response=JSON.parse(response);
            if(response.success===true){
                check.value='success-payment';
                const query=getParameterByName('query');
                await Swal.fire(
                    "Informacion Añadida",
                    "El metodo de pago se añado con exito",
                    "success"
                );
                if(query!=undefined){
                    if(query==='pago'){//Esto se pregunta ya que  puede referirse desde esta pagina y para regresar
                        window.parent.parent.location='preorder.html';
                    }
                }
            }else{
                if(response.logged===true){
                    printErrors(response.error);
                }
                else{

                }
            }
        }
    });
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

const checkOnlyNumbers=(str)=>{
    const regex_number = /^[0-9]+$/;
    return regex_number.test(str);
}

function getParameterByName(str) {
    str = str.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + str + "=([^&#]*)"),
    results = regex.exec(window.parent.parent.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}