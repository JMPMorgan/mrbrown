$(()=>{
    $('.platillos').each((i,element)=>{
        let add_menu=$(element).prev()[0];
        $(add_menu).on('click',async()=>{
            let num=0;
            await Swal.fire({
                title:'Ingrese la cantidad que desee ordernar',
                html:`<div class='container'>
                <img class='img-modal' src='../assets/Img/Aros+de+Cebolla (1).jpeg'>
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
                didOpen:()=>{
                    const content=Swal.getHtmlContainer();
                   // const $=content.querySelector.bind(content);   
                    const plus=$(content).find('#plus')[0];
                    const minus=$(content).find('#minus')[0];
                    const counter=$(content).find('#counter-order')[0];
                    console.log(content);
                    console.log(plus);
                    $(plus).on('click',()=>{
                        num=Number($(counter).text());
                        if(num<50){
                            num++;
                            $(counter).text(num);
                        }
                    })
                    $(minus).on('click',()=>{
                        num=Number($(counter).text());
                        if(num>0){
                            num--;
                            $(counter).text(num);
                        }
                    })
                },
                willClose:()=>{
                    console.log(num);
                },
                with:800
            })
        })
    })
})
    
