import {getParameterByName} from '../helpers/auxiliar/auxiliarMethods.js';

let l=false;
$(async()=>{
    const query=getParameterByName('query');
    console.log(query);
    if(query==='back'){
        let response=await $.ajax({
            method:'GET',
            datatype:'JSON',
            url:'../backend/loadpreorder.php'
        });
        console.log(response);
        response=JSON.parse(response);
        console.log(response);
        if(response.success===true){
            const uuids=response.info.preorder;
            console.log(uuids);
            uuids.forEach(element=>{
                const data={
                    name_food:element.name,
                    uuid:element.uuid,
                    price_food:Number(element.price_food_normally)
                }
                const number=Number(element.number);
                addToCart(number,data);
            });
        }
    }
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getFood.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
        l=response.logged===true ? true:false;
        printFood(response.info[0]);
    }else{

    }

    $('#shopping-cart').on('click',()=>{completeOrder();});
});
const foods=[];
const printFood=(food)=>{
    food.forEach(element=>{
        const html=$(`<div class='col-6' style='padding:0;'>
        <div class='add_food_btn'>
        <i class="fa-solid fa-circle-plus"></i>
        </div>
        <div class='row platillos'>
            <div class='col-3' style='padding:0;'>
                <img src='../assets/Img/${element.image_food}' class='food-photos'>
            </div>
            <div class='col-9'>
                <h1 data='${element.uuid}'>${element.name_food}</h1>
                <p class='prices-food'>$ ${element.price_food}</p>
                <p class='text-muted'>${element.description_food}</p>
            </div>
        </div>
        </div>`);
        if(l===true){
            $(html).on('click',()=>orderFood(html,element));
        }
        else{
            $(html).on('click',()=>alertNotLogged());
        }
        
        switch (element.type_food) {
            case 'entrada':
                $('div [id="entrada"]').append(html);
                
                break;
            case 'burger':
                $("div[id='burger']").append(html);
                break;
            case 'baguettes':
                $("div[id='baguettes']").append(html);
                break;
            case 'wings':
                $("div[id='wings']").append(html);
                break;
            case 'hand':
                $("div[id='hand']").append(html);
                break;
            case 'kids':
                $("div[id='kids']").append(html);
                break;
            case 'ensaladas':
                $("div[id='ensaladas']").append(html);
                break;
            case 'postre':
                $("div[id='postres']").append(html);
                break;
            case 'pizzas':
                $("div[id='pizzas']").append(html);
                break;
        
            default:
                break;
        }
    });
}

const orderFood=async(html,data)=>{
        let num = 0; 
        await Swal.fire({
            title: 'Ingrese la cantidad que desee ordernar',
            html: `<div class='container'>
            <img class='img-modal' src='../assets/Img/${data.image_food}'>
            <div class='row d-flex justify-content-center '>
            <div class='col-4 swal-buttons-menu'>
            <button id='minus' class='btn btn-primary'>-</button>
            </div>
            <div class='col-4 swal-buttons-menu ' id='counter-order'>
                <span class='h3' id='counter-order'>0</span>
            </div>
            <div class='col-4 swal-buttons-menu'>
            <button id='plus' class='btn btn-primary'>+</button>
            </div>
            </div>
            </div>`,
            didOpen: () => {
                const content = Swal.getHtmlContainer();
                // const $=content.querySelector.bind(content);   
                const plus = $(content).find('#plus')[0];
                const minus = $(content).find('#minus')[0];
                const counter = $(content).find('#counter-order')[0];
                $(plus).on('click', () => {
                    num = Number($(counter).text());
                    if (num < 50) {
                        num++;
                        $(counter).text(num);
                    }
                })
                $(minus).on('click', () => {
                    num = Number($(counter).text());
                    if (num > 0) {
                        num--;
                        $(counter).text(num);
                    }
                })
            },
            willClose: () => {
            }
        }).then( (result)=>{
            if(result.isConfirmed){
                if(num>0){
                    addToCart(num,data);
                }
            }
        })

}

const addToCart=(numberFood,data)=>{
    const isCreate=$('#shopping-cart').attr('data');
    if(isCreate=='false'){
        const html=`<i class='bx bx-cart-alt' ></i>
                    <span id='number-food'>${numberFood}</span>`;
        $('#shopping-cart').css('display','block');
        $('#shopping-cart').attr('data',true);
        $('#shopping-cart').append(html);
        const food={};
        const checkOrder=checkInfoOrder(data.uuid,numberFood);
        if(checkOrder===false){
            food.name=data.name_food;
            food.uuid=data.uuid
            food.price_food=data.price_food;
            food.number=numberFood;
            foods.push(food);
        }
    }
    else{
        const shopping=Number($('#shopping-cart').children('#number-food').text());
        const food={};
        const checkOrder=checkInfoOrder(data.uuid,numberFood);
        if(checkOrder===false){
            food.name=data.name_food;
            food.uuid=data.uuid
            food.price_food=data.price_food;
            food.number=numberFood;
            foods.push(food);
        }
        $('#shopping-cart').children('#number-food').text(shopping+numberFood);
    }
    console.log(foods);
    
}

const completeOrder=async()=>{
    let code='';
    let contador=0;
    console.log(foods);
    foods.forEach(element=>{
        const amount_food=element.number*element.price_food;
        const dish=`<div  class="col-12 info-order my-1" id='order-row-container'>
        <div class='row' >
            <div class='col-3'>
               
                <span>X </span><span id='number-food'>${element.number}</span>
            </div>
            <div class='col-6'>
                <span id='data-food'  data='${element.uuid}'>${element.name}</span>
            </div>
            <div class='col-3' style='padding:0;'>
               <span>$ </span><span id='price-food'>${amount_food}</span>
               <button class='btn btn-sm btn-outline-danger btn-delete-order' onclick='deleteDish("${element.uuid}",${contador})'><i class='bx bxs-trash'></i></button>
            </div>
        </div>
    </div>`;
        code+=dish;
        contador++;
    });
    await Swal.fire({
        title: 'Shopping Cart',
        html: `<div class='container'><div class='row'>
            ${code}
        </div>
        </div>`,
        confirmButtonText:`<span id='btn-confirm-order'>Confirmar Pedido<span>`
    }).then( (result)=>{
        if(result.isConfirmed){
            const infoOrder=$('.info-order');
            const uuidsOrder=[];
            $(infoOrder).each((i,element)=>{
                const foodInfo={};
                foodInfo.number=Number($(element).find('#number-food').text());
                foodInfo.uuid=$(element).find('#data-food').attr('data');
                foodInfo.name=$(element).find('#data-food').text();
                foodInfo.price_food=$(element).find('#price-food').text();
                uuidsOrder.push(foodInfo);
            });  
            purchasingProcess(uuidsOrder);
        }
    });
}

const deleteDish=(uuid,contador)=>{
    console.log(uuid);
    console.log(contador);
    console.log($('.info-order'));
    const dish=$('.info-order')[contador];
    $(dish).remove();
    if(contador===0){
        window.location.reload();
    }
}


const purchasingProcess= async(uuidsOrder)=>{
    let response=await $.ajax({
        method:'POST',
        datatype:'JSON',
        data:{
            uuidsOrder
        },
        url:'../backend/purchasingProcess.php'
    });
    console.log(response);
    response=JSON.parse(response);
    if(response.success===true){
        if(response.logged===true){
            window.location='preorder.html';
        }
        else{
            
        }
    }else{

    }
}

const alertNotLogged=()=>{
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Informacion',
        html:`<p>No puede ordenar comida, tiene que crear una cuenta o logearse con una cuenta existente para hacerlo</p> <br>
            <a href='adduser.html'>Crear Cuenta</a><br> <a href='login.html'>Log In</a>`,
        showConfirmButton: true
      });

}

const checkInfoOrder=(uuid,number)=>{// Es para ver si esta ordenando algun platillo ya añadido
 let check=false;
    foods.forEach(element=>{
     console.log(element)
        if(element.uuid===uuid){
            element.number+=number;
            check= true; 
        }
    });
    return check;
}