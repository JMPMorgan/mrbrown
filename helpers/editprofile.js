import {onlyMinus,onlyLetters,validateEmail,validateEntirePassword} from  '../helpers/auxiliar/auxiliarMethods.js';

$(async()=>{
 let response= await $.ajax({
    method:'GET',
    datatype:'JSON',
    url:"../backend/getDataUser.php"
 });
 console.log(response);
 response=JSON.parse(response);
 console.log(response);
 if(response.success===true){
    $('#pm-name').text(`${response.info.name_user} ${response.info.lastname_user}`);
    $('#pm-user').text(`${response.info.nick_user}`);
    $('#pm-email').text(response.info.email_user);
    $('#ed-name').val(response.info.name_user);
    $('#ed-lastname').val(response.info.lastname_user);
    $('#ed-oldpassword').val(response.info.password_user);
    $('#ed-email').val(response.info.email_user);
    $('#pm-img').attr('src',`../assets/Img/pp-2.png`);
 }else{
    if(response.logged===false){

    }else{

    }
 }


 $('#btn-update').on('click',async()=>{
    const name=$('#ed-name').val();
    const lastname=$('#ed-lastname').val();
    const email=$('#ed-email').val();
    const oldpassword=$('#ed-oldpassword').val();
    const newpassword=$('#ed-password').val();
    const confirmpassword=$('#ed-cpassword').val();
    let isNew=false;
    if(newpassword.length>0){
        isNew=true;
    }
    const errors=[];
    if(onlyLetters(name)===false){
        errors.push('El nombre debe solo contener letras y espacios');
    }
    if(onlyLetters(lastname)===false){
        errors.push('El apellido debe solo contener letras y espacios');
    }
    if(validateEmail(email)===false){
        errors.push('Email debe contener @ y  "."');
    }
    if(isNew===true){
        if(newpassword===confirmpassword){
            const error1=validateEntirePassword(newpassword);
            const error2=validateEntirePassword(confirmpassword);
            error1.error===true?errors.push(error1.text):null;
            error2.error===true?errors.push(error2.text):null;
        }else{
            errors.push('Las contraseñas deben coincidir');
        }
    }
    console.log(oldpassword,newpassword,confirmpassword);
    if(errors.length===0){
        let response=await $.ajax({
            method:'POST',
            datatype:'JSON',
            data:{
                name,
                lastname,
                email,
                oldpassword,
                newpassword,
                confirmpassword,
                isNew
            },
            url:'../backend/editprofile.php'
        });
        response=JSON.parse(response);
        if(response.success===true){
            window.location.reload();
        }
    }else{
        console.log(errors);
    }

 });
});