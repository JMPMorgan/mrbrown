$( ()=>{
    $('#btn-out').on('click',async ()=>{
        let response= await $.ajax({
            method:'GET',
            datatype:'JSON',
            url:'../backend/signOut.php'
        });
        response=JSON.parse(response);
        if(response.success===true){
            window.location='index.html';
        }
        else{
            await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Error',
                text:`No se pudo cerrar la sesion correctamente intente de nuevo`,
                showConfirmButton: true
              });
        }
    });

    $('#pedidos').on('click',()=>{
        $('#container-iframe').children().remove();
        const html=`<iframe src='pedidos.html' ></iframe>`;
        $('#container-iframe').append(html);
    });

    $('#perfil').on('click',()=>{
        $('#container-iframe').children().remove();
        const html=`<iframe src='editprofile.html'></ifrmae>`;
        $('#container-iframe').append(html);
    });
    $('#pago').on('click',()=>{
        $('#container-iframe').children().remove();
        const html=`<iframe src='paymentinformation.html'></iframe>`;
        $('#container-iframe').append(html);
    });
});