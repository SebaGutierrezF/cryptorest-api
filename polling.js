//Loads modules
const app = require('./app');
const axios = require("axios");

// Set database connection credentials

// Create pool
const pool = axios.get('https://www.buda.com/api/v2/markets/eth-btc/ticker')

//keep alive every 15s
setInterval(function () {
    pool.catch((error) => {
        console.warn('Not good man :(Get markets)'+error.message);
    });
}, 150000);

// Export the pool
module.exports = pool;

