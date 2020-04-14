process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');
const {connect, close, app}= require('../../../app.js');
const Currency = require('../../../models/Currency');

describe('Test /currencies', function() {
  before(function (done) {
    connect()
      .then(() => done())
      .catch(err => done(err));
  })

  after(function(done) {
    close()
      .then(() => done())
      .catch((err) => done(err));
  })

  beforeEach(async () => {
    await Currency.remove();
  })

  afterEach(async () => {
    await Currency.remove();
  })

  it('Empty, calling an initial get request', (done) => {
    request(app).get('/currencies')
      .then((res) => {
        const body = res.body;
        expect(body.length).to.equal(0);
        done();
      })
      .catch((err) => done(err));
  });

  it('OK, posting a currency', (done) => {
    request(app).post('/currencies')
    .type('json')
    .send({ name: "Eldorado gold" , shortCode: "ELD", rate:9.2 })
    .then((res) => {
      expect(res.status).to.equal(200);
      done();
    })
    .catch((err) => done(err));
  });

  it('Bad request error, currency requires name, shortcode, and rate info', (done) => {
    request(app).post('/currencies')
    .send({ })
    .then((res) => {
      expect(res.status).to.equal(400);
      done();
    })
   .catch((err) => done(err));
  });

  it('OK, getting the currency', (done) => {
    request(app).post('/currencies')
    .type('json')
    .send({ name: "test", shortCode: "TST", rate: 0.4 })
    .then((res) => {
      expect(res.status).to.equal(200);
      request(app).get('/currencies')
      .then((res) => {
        const body = res.body;
        expect(body.length).to.equal(1);
        done();
      })  
    })
  .catch((err) => done(err));
});

it('OK, deleting a currency', (done) => {
  request(app)
  .post('/currencies')
  .type('json')
  .send({ name: "Saudi rial", shortCode: "SR", rate:0.9 })
  .then((res) => {
      expect(res.status).to.equal(200);
      request(app).get('/currencies')
      .then((res) => {
        expect(res.body.length).to.equal(1);
        request(app)
        .delete(`/currencies/${res.body[0]._id}`)
        .then((res) => {
          expect(res.status).to.equal(200);
          done();
        }); 
      });
  })
.catch((err) => done(err));
});

it('Error, posting a currency with non-unique short code', (done) => {
  request(app)
  .post('/currencies')
  .type('json')
  .send({ name: "Bolivian peso", shortCode: "BPS", rate:1.2})
  .then((res) => {
      expect(res.status).to.equal(200);
      request(app).get('/currencies')
      .then((res) => {
        expect(res.body.length).to.equal(1);
        request(app).post('/currencies')
        .type('json')
        .send({ name: "Ecuadorian peso", shortCode: "BPS", rate:1.4})
        .then((res) => {
          expect(res.status).to.equal(400);
          done();
        }); 
      });
  })
  .catch((err) => done(err));
  });

it('OK, updating a currency', (done) => {
  request(app)
  .post('/currencies')
  .type('json')
  .send({ name: "UAE rial", shortCode: "UAR", rate:1.9})
  .then((res) => {
      expect(res.status).to.equal(200);
      request(app).get('/currencies')
      .then((res) => {
        expect(res.body.length).to.equal(1);
        request(app).patch(`/currencies/${res.body[0]._id}`)
        .send({name: "United Arabian Emirates rial", shortCode: "UAR", rate:1.9})
        .then((res) => {
          expect(res.status).to.equal(200);
          request(app).get('/currencies')
            .then((res) => {
              expect(res.body[0].name).to.equal("United Arabian Emirates rial");
              done();
            });
        }); 
      });
  })
  .catch((err) => done(err));
  });
});