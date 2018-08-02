'use strict';

$(document).ready(function() {

    // $('.parallax').parallax();
    // document.addEventListener('DOMContentLoaded', function() {
    //     var elems = document.querySelectorAll('.parallax');
    //     var instances = M.Parallax.init(elems, options);
    // });

        let gifContainer = $("#gifs-container");

        const printGifs = (data) => {
            let gifTemplate = $("#content-template").html();
            console.log(gifTemplate);
            // gifContainer.html('');//esto no estoy segura, yo entiendo que está obteniendo también el contenido que hay dentro del div, el cuál está vacío

            data.forEach( element => {
                const data = {
                    gif: element.images.downsized_large.url,
                    url: element.bitly_url,// bitly se refiere a la reducción de URL, servicio de la empresa "Bitly"
                };
                console.log(data);
                let filledTemplate = fillGifTemplate(gifTemplate, data);
                console.log(filledTemplate);
                gifContainer.append(filledTemplate);
            });

        };

        // ----LLAMANDO EL API DE GIPHY CON AJAX
        const ajaxGiphy = (theUserWantsThisGif) => {

            $.ajax({
                url:'https://api.giphy.com/v1/gifs/search',
                //https://api.giphy.com/v1/gifs/search?api_key=fQTS2twrt1h88BtQjwTXBjxoMQ8IKZCS&q=hip hip hurray&limit=25&offset=3&rating=G&lang=en
                type: 'GET',
                datatype: 'json',
                data :{
                    q: theUserWantsThisGif,
                    api_key: 'fQTS2twrt1h88BtQjwTXBjxoMQ8IKZCS'
                }
            })
            .done((response)=>{
                console.log(response);
                printGifs(response.data);
            })
            .fail(()=>{
                console.log("error");
            })
        }



    // ---- DESENCADENANDO LA MAGIA
        $(".btn").click( ()=> {
            console.log("It's inside");
            $("#gifs-container").empty();//vaciando/limpiando el contendor de gifs
            let theUserWantsThisGif = $("#input").val();
            ajaxGiphy(theUserWantsThisGif);
            //limpiando el input:
            $("#input").val("");
        })

        // $(".parallax").parallax();
});





//---- LLENANDO EL TEMPLATE 


const fillGifTemplate = (template, data) => {
    
    for(let property in data){
        let value = data[property];//Obteniendo el valor de la propiedad (en este el gif y la url)
        //reemplazando los valores
        template = template.replace(new RegExp('{{'+property+'}}', 'g'), escapeHtml(value) );//la expresión regular no puede ser así: /{{${property}}/g porque en la plantilla
        //no tiene los acentos graves que permiten la ejecución de un template string.
                                                
    };
    return template;
    
}

function escapeHtml(str) {
    var div = document.createElement('div');//creando un div que no existe en el dom
    div.appendChild(document.createTextNode(str));//agregando el value extrictamente como string
    return div.innerHTML;//obteniendo el value "limpio"
}