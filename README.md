# cryptorest-api ![travis-ci](https://travis-ci.org/daplay/jsurbtc.svg?branch=master)![PyPI - Status](https://img.shields.io/pypi/status/trading-api-wrappers.svg)

Nodejs client for buda.com [REST API](https://api.buda.com)
  ### Install
```javascript  
Express
npm i express

Axios
npm i axios

Cors
npm i cors

Jest
npm install --save-dev jest
```

  
  ### Usage

Please check the app.spec.js for additional information.

```javascript
const app = require("../app");
const request = require('supertest');

describe('GET /api', function() {
  jest.setTimeout(30000* 1000);
    it('returns a GET request', function(done) {
      request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
        
    });
  });

```
