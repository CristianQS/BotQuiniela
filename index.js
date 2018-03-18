var url = "https://resultados.as.com/quiniela/2017_2018/jornada_"
var axios = require('axios');
var cheerio = require('cheerio');
var _ = require("lodash");

var array = [];
var promesas = [];
for (let i = 1; i <= 44; i++) {
    promesas.push(getPage(i));
}

Promise.all(promesas)
    .then(resultados => {
        
       var resultados =_.flatten(resultados);
       console.log(resultados)
    })

function getPage(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return axios.get(url + index).then(response => {
                resolve(getJornada(response.data));
            })
        }, 250 * index);
    })

}
function getJornada(reponse) {
    const $ = cheerio.load(reponse);
    var jornadas = [];
    var a = $(".cont-partido").each((index, element) => {
        var jornada = {};
        if (index < 14) {
            jornada["1"] = $(element).find($(".partido .local")).text().replace(/\n/g, "").trim();
            jornada["2"] = $(element).find($(".partido .visitante")).text().replace(/\n/g, "");
            jornada.finalizado = $(element).find($(".pronostico.finalizado")).text();
            array.push(jornada);
        } else {
            //console.log($(element).find($(".partido")).text().replace(/\n/g, ""));
        }
        jornadas.push(jornada);
    });
    return jornadas;
}