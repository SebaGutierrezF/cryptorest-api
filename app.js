const express = require('express');
const app = express()
const port = process.env.PORT || 3000;
const axios = require("axios");
const pool = require('./polling');
//const main = require('./index');

app.get('/api', async (req,res)=> {
  try {
    //1. Necesitamos calcular el spread (explicado más abajo)
    //   de cualquiera de los mercados de Buda.com.
    array = [];
    // http request con axios hacia la api para obtener datos
    // let response =  axios.get('https://www.buda.com/api/v2/markets/eth-btc/ticker');
    
    //separamos los datos obtenidos en la consulta http, en este caso el indice se llama "ticker"
    // let {
    //     data: {ticker},
    // } = response;
    //obtenemos los datos que nos importan de ticker
    //calculo del spread usando los datos obtenidos
    // let spread = (ticker.max_bid[0] - ticker.min_ask[0]);
    //console.log("\n market : " + ticker.market_id +"\n max bid: " + ticker.max_bid[0] + "\n min ask: " + ticker.min_ask[0] + "\n spread : " + spread);
    //2. Necesitamos obtener el spread de todos 
    //   los mercados en una sola llamada.
    //
    // http request con axios hacia la api para obtener datos
    let GetMarkets = await axios.get("https://www.buda.com/api/v2/markets");
    //separamos los datos obtenidos en la consulta http, en este caso el indice se llama "markets"
    let {data: {markets},} = GetMarkets;
    //con .map filtramos cada dato en "markets", en este caso la "id" y se le asigna a la variable "market_id"
    var market_id = markets.map((markets) => markets.id);
    //ciclo for para hacer http get por cada dato hacia la segunda url 
    for(index = 0; index < market_id.length; index++){
            // http request con axios hacia la api para obtener datos
            let GetSpread =  await axios.get(`https://www.buda.com/api/v2/markets/${market_id[index]}/ticker`).catch((error) => {
                  console.warn('Not good man :('+error);
              });
            //separamos los datos obtenidos, en este caso el indice se llama "ticker"
            let {data: { ticker },
            } = GetSpread;
            //obtenemos el spread con los datos separados
            let spread = (ticker.min_ask[0]-ticker.max_bid[0]);
    //3. Necesitamos guardar un spread de “alerta” el cual en el futuro
    //   consultaremos por medio de polling si el spread es mayor o menor de ese spread. 
            // guardamos la alerta en una variable
            function alert(index,spread) {
              if (typeof localStorage === "undefined" || localStorage === null||localStorage.getItem(`alerta-${[index]}`) ==="ENOENT") {
                var LocalStorage = require('node-localstorage').LocalStorage;
                localStorage = new LocalStorage('./scratch');
                localStorage.setItem(`alerta-${[index]}`, spread);
              }else{
                //consultaremos si el spread es mayor o menor de ese spread.
                if(spread>localStorage.getItem(`alerta-${[index]}`)){
                    localStorage.removeItem(`alerta-${[index]}`);
                    localStorage.setItem(`alerta-${[index]}`, spread);
                }
              }
              // guardamos la alerta en una variable
            let alerta = localStorage.getItem(`alerta-${[index]}`) || 0 ;
              return alerta;
            }
            alert(index, spread);
            //si el spread actual es igual al spread maximo guardado, generamos una alerta en consola.
            if (parseInt(spread)===parseInt(alert(index, spread))) {
                console.log("Alert on: "+String(ticker.market_id)+"|max spread: "+alert(index, spread));
              }
            //creamos el objeto values con todos los datos que vamos a mostrar en la web  
            let values = [{market: String(ticker.market_id), max_bid: ticker.max_bid[0], min_ask: ticker.min_ask[0], spread: spread, alerta: alert(index, spread)}];
            //guardamos los valores dentro de un arreglo
            array.push(values);
        }
        
        //se envia como respuesta un json con todos los valores dentro del arreglo
        res.json(array)
        
        
    
  } catch (error) {
    console.warn(error);
    //setResults([]);
    
  }

        
});
app.get('/',(req, res) =>{   
  const error = req.error;
  if (error) throw error;// not connected!
  console.log('Connected as IP: ' + req.ip +'\n');
  res.send('Connected as IP: ' + req.ip +'\n'+'Please use /api');
});
app.listen(port, (error) =>{
    if(!error){
      console.log("Server is Successfully Running, \n"+ "and App is listening on: \n"+`http://localhost:${port}\n`)
    } else {
      console.log("Error occurred, server can't start", error);    
    }        
  });

  module.exports = app;