var TelegramBotClient = require('node-telegram-bot-api');
var axios = require('axios');
var cheerio = require('cheerio');
var _ = require("lodash");

const token = "535476274:AAGMkuhD7GvBmFka7av5YcOoo8A6RXBd2O0";
const bot = new TelegramBotClient(token, { polling: true });
var url = "https://resultados.as.com/quiniela/2017_2018/jornada_"


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ve los resultados de la quiniela de" 
    +"la liga Santander\n con el comando: /jornada01, /jornada10, etc");
});

bot.onText(/\/jornada (.+)/, (msg,match) => {
    var index = match[1];
    getPage(index).then(jornada => {
        bot.sendMessage(msg.chat.id, crearRespuestaJornada(jornada,index));
    });
});

function crearRespuestaJornada (jornada,numJornada) {
    var result = `Resultados de la jornada ${numJornada}\n`;
    for (let i = 0; i < 14; i++) {
        result += `1: ${jornada[i]["1"]} --  2: ${jornada[i]["2"]}   Resultado: ${jornada[i].resultado} \n`;
    }
    return result;
}


function getPage(index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return axios.get(url + index).then(response => {
                resolve(getJornada(response.data));
            })
        }, 250);
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
            jornada.resultado = $(element).find($(".pronostico.finalizado")).text();
        } else {
            //console.log($(element).find($(".partido")).text().replace(/\n/g, ""));
        }
        jornadas.push(jornada);
    });
    return jornadas;
}