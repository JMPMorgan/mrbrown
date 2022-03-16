import{onlyLetters,onlyMinus,validateEmail,validateEntirePassword,validatePhoneNumber}from'../helpers/auxiliar/auxiliarMethods.js'

const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 4500,
    timerProgressBar: false
  });


$(()=>{
    $('#btn-register').on('click',async()=>{
        let errors=[];
        console.log($("#txt-name").val(),$('#txt-lastname').val());
        console.log($('#txt-user').val(),$('#txt-email').val());
        console.log($('#txt-password').val());
        console.log($('#txt-cpassword').val());
        //console.log($('#input[name=gender]:checked').val().length);
        console.log($('input[name=gender]:checked').val());
        if(onlyLetters($("#txt-name").val())==false || $("#txt-name").val().length<=0){
            errors.push('El nombre solo acepta Letras y Espacios');
        }
        if(onlyLetters($('#txt-lastname').val())==false||$('#txt-lastname').val().length<=0){
            errors.push('El Apellido solo acepta Letras y Espacios');
        }
        if(onlyMinus($('#txt-user').val())==false || $('#txt-user').val().length<=0){
            errors.push('El usuario acepta letras,numeros,guion bajo(_) y punto');
        }
        if(validateEmail($('#txt-email').val())==false || $('#txt-email').val().length<=0){
            errors.push('El correo debe contener @ y .');
        }
        const isPasswordCorrect=validateEntirePassword($('#txt-password').val());
        if(isPasswordCorrect.error==true){
            errors.push(isPasswordCorrect.text);
        }
        if($('#txt-password').val()!==$('#txt-cpassword').val()){
            errors.push('La Contraseña y la confirmacion de la Contraseña no coinciden');
        }
        if($('input[name=gender]:checked').val().length<=0){
            errors.push('Debe selecionar un sexo');
        }
        if(validatePhoneNumber($('#txt-tel').val())==false && $('#txt-tel').val().length<10){
            errors.push('El numero debe ser de longitud de 10 digitos');
        }
        if(errors.length>0){
            printErrors(errors);
        }
        else{
            const name= $('#txt-name').val();
            const lastname=$('#txt-lastname').val();
            const user=$('#txt-user').val();
            const email=$('#txt-email').val();
            const password= $('#txt-password').val();
            const phone=$('#txt-tel').val();
            const gender = $('input[name=gender]:checked').val();
            let repsonse = await $.ajax({
                method:'POST',
                url:'../backend/adduser.php',
                data:{
                    name,
                    lastname,
                    user,
                    email,
                    password,
                    phone,
                    gender
                },
                datatype:'JSON'
            })
            repsonse=JSON.parse(repsonse);
            console.log(repsonse);
            if(repsonse.success===true){
                window.location='index.html';
            }
            else if(repsonse.success===false){
                printErrors(repsonse.error);
            }
        }
    })
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