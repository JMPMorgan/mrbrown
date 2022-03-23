$(async()=>{
    let response = await $.ajax({
        method:'GET',
        datatype:'JSON',
        url:'../backend/getFood.php'
    });
    response=JSON.parse(response);
    if(response.success===true){
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
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu sodales leo. Aenean sed odio posuere.</p>
            </div>
        </div>
        </div>`);
        $(html).on('click',()=>orderFood(html,element));
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
                addToCart(num,data);
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
        food.name=data.name_food;
        food.uuid=data.uuid
        food.number=numberFood;
        foods.push(food);
        console.log(foods);
    }
    else{
        const shopping=Number($('#shopping-cart').children('#number-food').text());
        console.log(shopping+numberFood);
        const food={};
        food.name=data.name_food;
        food.uuid=data.uuid
        food.number=numberFood;
        foods.push(food);
        console.log(foods);
        $('#shopping-cart').children('#number-food').text(shopping+numberFood);
    }
    
}

const completeOrder=async()=>{
    let code='';
    foods.forEach(element=>{
        code+=`<div class="col-12">
            <div class='row'>
                <div class='col-3'>
                    <span>X ${element.number}</span>
                </div>
                <div class='col-6'>
                    <span>${element.name}</span>
                </div>
            </div>
        </div>`;
    });
    console.log(code);
    await Swal.fire({
        title: 'Shopping Cart',
        html: `<div class='container'><div class='row'>
            ${code}
        </div>
        </div>`,
    }).then( (result)=>{
        if(result.isConfirmed){
            console.log('Aqui iria el proceso de compra');
        }
    })
}
