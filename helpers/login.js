import{onlyLetters,onlyMinus,validateEmail,validateEntirePassword,validatePhoneNumber}from'../helpers/auxiliar/auxiliarMethods.js'

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });

$(()=>{
    let errors=[];
    $('#btn-submit').on('click',async()=>{
        if(onlyMinus($('#txt-user').val())==false||$('#txt-user').val().length<=0){
            errors.push('Debe ser rellanado con el user ');
        }
        const isPasswordCorrect=validateEntirePassword($('#txt-pass').val());

        if(isPasswordCorrect.error==true){
            errors.push(isPasswordCorrect.text);
        }
        if(errors.length>0){
            printErrors(errors);
        }
        else{
            const user=$('#txt-user').val();
            const password=$('#txt-pass').val();
            let response= await $.ajax({
                method:'POST',
                data:{
                    user,
                    password
                },
                url:'../backend/login.php',
                datatype:'JSON'
            });
            response=JSON.parse(response);
            if(response.success===true){
                window.location='index.html';
            }else if(response.success===false){
                printErrors(response.error);
            }
        }
    });
})

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