$(()=>{
    $('#order-now').on('click',()=>{
        document.location='order-menu.html';
    })
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

