$(async ()=>{
    let response= await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getDataUser.php'
    });
    console.log(response);
    response=JSON.parse(response);
    console.table(response);
   if(response.success===true){
        printUser(response.info);
   } else{

   }
    $('#order-now').on('click',()=>{
        document.location='order-menu.html';
    });

    $('#btn-add-user').on('click',()=>{
        document.location='adduser.html';
    });

    $('#btn-sign-up').on('click',()=>window.location='login.html');

    $('#btn-drinks').on('click',()=>window.location='drinks.html');

    $('#btn-mrbrown').on('click',()=>window.location='mr_brown.html');

    $('#btn-franquicias').on('click',()=>window.location='https://www.mrbrown.mx/franquicias');

    $('#btn-here').on('click',()=>window.location='franquicias.html');

    $('#logo').on('click',()=>window.location='index.html');

})

window.onload=()=>{
    /*$('#navbar').css('position','absolute');*/
    let wnd=window.location.pathname;
    let path=wnd.split('/');
    console.log(wnd);
    console.log(path);
    path=path[3];
    console.log(path);
    if(path==='index.html' || path===''){
        $('#navbar').animate({
            bottom: 0,
        },1500);
    }
    else{
        $('#navbar').css({"position":"static !important"});

    }

}

const printUser=(r)=>{
    $('#btn-add-user').css('display','none');
    $('#btn-sign-up').css('display','none');
    const html=$(`<li><ul class='navbar-nav justify-content-end' style='max-width: 100%;'>
                    <li class='nav-item justify-content-end' style="max-width:fit-content">
                        <div class='row'>
                            <div class='col-sm-12 m-0'>
                                <p class=' my-0 mr-3 ml-0 text-right' id='name-user'>${r.name_user} ${r.lastname_user}
                                </p>
                            </div>
                            <div class='col-sm-12 m-0'>
                                <p class='my-0 mr-3 ml-0 text-right' id='user'>${r.nick_user}</p>
                            </div>
                        </div>
                    </li>
                    <li class='nav-item justify-content-end' id='profile'>
                                <img src='../assets/Img/pp-2.png' class='rounded img-thumbnail' id='profile-pic'>
                    </li>
                </ul><li>`);
    const profile=$(html).find('#profile')[0];
    $(profile).on('click',()=>{
        window.location='profile.html';
    });
    $('#navbar-menu').append(html);



}


/*
                                <details id='profile-menu'>
                            <summary>
                            </summary>
                            <details id='dropdown-menu'>
                                <summary></summary>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-orders'>Your Food Orders</a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-profile'>Your Profile</a>
                                <a class='dropdown-list rounded border btn btn-outline-primary' id='btn-signout'>Sign Out</a>
                            </details>
                        </details>
*/
