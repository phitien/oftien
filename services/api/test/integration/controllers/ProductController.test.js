const expect = require("expect");
const supertest = require("supertest");

const catData = require("../../fixtures/category");

const b1Data = require("../../fixtures/bot1");
const b2Data = require("../../fixtures/bot2");
const pData = require("../../fixtures/product");
const newName = `${pData.name} new`;
const node1ParamValue = `Node 1 param value`;

let bot1, bot2, product, product1;
let bot1Params, bot2Params, productParams;
let node1, node1Params, node1Outputs, node2, node2Params;

const userData = {
  username: "dev+super_administrator@amaris.ai",
  password: "dev+super_administrator@amaris.ai"
};
let tokenName, token;

before(async () => {
  tokenName = BaseService.tokenName();
});
describe("#Login", async () => {
  await it("POST /api/v1/login", done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/login`)
      .send(userData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          user = res.body;
          token = user[tokenName];
          return done();
        }
      });
  });
});
describe("#CategoryController.create", async () => {
  await it("should return json, created category", done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/categories`)
      .set(tokenName, token)
      .send(catData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          cat = res.body;
          return done();
        }
      });
  });
});
describe("#CategoryController.list", async () => {
  await it("GET /api/v1/categories", done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/categories`)
      .set(tokenName, token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(1);
          cats = res.body;
          return done();
        }
      });
  });
});
describe("#ProductController.create a bot1", async () => {
  await it("POST /api/v1/products", done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/products`)
      .set(tokenName, token)
      .send({ ...b1Data, category: cat.id })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          bot1 = res.body;
          expect(bot1.name).toBe(b1Data.name);
          expect(bot1.atomic).toBe(true);
          bot1Params = bot1.parameters;
          return done();
        }
      });
  });
});
describe("#ProductController.create a bot2", async () => {
  await it("POST /api/v1/products", done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/products`)
      .set(tokenName, token)
      .send({ ...b2Data, category: cat.id })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          bot2 = res.body;
          expect(bot2.name).toBe(b2Data.name);
          expect(bot2.atomic).toBe(true);
          bot2Params = bot2.parameters;
          return done();
        }
      });
  });
});
describe("#ProductController.create a product", async () => {
  await it("POST /api/v1/products", done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/products`)
      .set(tokenName, token)
      .send({
        ...pData,
        nodeDataArray: [
          { product: bot1.id, key: -1, loc: "0 0" },
          { product: bot2.id, key: -2, loc: "100 100" }
        ],
        linkDataArray: [{ from: -1, to: -2 }]
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          product = res.body;
          expect(product.name).toBe(pData.name);
          expect(product.atomic).toBe(false);
          expect(product.nodeDataArray).toBeInstanceOf(Array);
          expect(product.nodeDataArray.length).toBe(2);
          return done();
        }
      });
  });
});
describe("#ProductController.change a product", async () => {
  await it("should return json, product json", done => {
    supertest(sails.hooks.http.app)
      .put(`/api/v1/products/${product.id}`)
      .set(tokenName, token)
      .send({
        name: newName,
        nodeDataArray: [
          { product: bot1.id, key: -1, loc: "0 0" },
          { product: bot2.id, key: -2, loc: "100 100" },
          { product: bot1.id, key: -3, loc: "200 200" }
        ],
        linkDataArray: [{ from: -1, to: -2 }, { from: -2, to: -3 }],
        parameters: [
          {
            name: "Product's Param1",
            value: "Product's Param1's default value"
          },
          {
            name: "Product's Param2",
            value: "Product's Param2's default value"
          },
          {
            name: "Product's Param3",
            value: "Product's Param3's default value"
          }
        ]
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          product1 = res.body;
          expect(product1.name).toBe(newName);
          expect(product1.parameters).toBeInstanceOf(Array);
          expect(product1.parameters.length).toBe(3);
          expect(product1.nodeDataArray).toBeInstanceOf(Array);
          expect(product1.nodeDataArray.length).toBe(3);
          productParams = product1.parameters;
          node1 = product1.nodeDataArray.find(o => o.key == "-1");
          node2 = product1.nodeDataArray.find(o => o.key == "-2");
          node3 = product1.nodeDataArray.find(o => o.key == "-3");
          return done();
        }
      });
  });
});
describe("#ProductController.product parameters", async () => {
  await it("should return json, array of params", done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/parameters/${product1.id}`)
      .set(tokenName, token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          productParams = res.body;
          expect(productParams).toBeInstanceOf(Array);
          expect(productParams.length).toBe(3);
          return done();
        }
      });
  });
});
describe("#ProductController.node1 parameters", async () => {
  await it("should return json, array of params", done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/parameters/${product1.id}?nodeid=${node1.id}`)
      .set(tokenName, token)
      .send({ nodeid: node1.id })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          node1Params = res.body;
          expect(node1Params).toBeInstanceOf(Array);
          expect(node1Params.length).toBe(1);
          expect(node1Params[0].value).toBe(b1Data.parameters[0].value);
          return done();
        }
      });
  });
});
describe("#ProductController.change node parameters values", async () => {
  await it("should return json, array of params", done => {
    supertest(sails.hooks.http.app)
      .put(`/api/v1/parameters/${node1.id}`)
      .set(tokenName, token)
      .send({
        parameters: [{ parameter: bot1Params[0].id, value: node1ParamValue }]
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          node1Params = res.body;
          expect(node1Params).toBeInstanceOf(Array);
          expect(node1Params.length).toBe(1);
          expect(node1Params[0].value).toBe(node1ParamValue);
          return done();
        }
      });
  });
});
describe("#ProductController.change node parameters values by reference", async () => {
  await it("should return json, array of params", done => {
    const param = productParams[1];
    supertest(sails.hooks.http.app)
      .put(`/api/v1/parameters/${node2.id}`)
      .set(tokenName, token)
      .send({
        parameters: [{ parameter: bot2Params[0].id, valueRef: param.id }]
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          node2Params = res.body;
          expect(node2Params).toBeInstanceOf(Array);
          expect(node2Params.length).toBe(1);
          expect(node2Params[0].value).toBe(param.value);
          return done();
        }
      });
  });
});
describe("#ProductController.set node outputs", async () => {
  await it("should return json, array of outputs", done => {
    supertest(sails.hooks.http.app)
      .put(`/api/v1/outputs/${node1.id}`)
      .set(tokenName, token)
      .send({
        outputs: [{ param: productParams[0].id, value: node1ParamValue }]
      })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          node1Outputs = res.body;
          expect(node1Outputs).toBeInstanceOf(Array);
          expect(node1Outputs.length).toBe(1);
          expect(node1Outputs[0].value).toBe(node1ParamValue);
          return done();
        }
      });
  });
});
describe("#ProductController.get node outputs", async () => {
  await it("should return json, array of outputs", done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/outputs/${node1.id}`)
      .set(tokenName, token)
      .send()
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          node1Outputs = res.body;
          expect(node1Outputs).toBeInstanceOf(Array);
          expect(node1Outputs.length).toBe(1);
          expect(node1Outputs[0].value).toBe(node1ParamValue);
          return done();
        }
      });
  });
});
describe(`#ProductController.remove product`, async () => {
  await it("should return json, deleted product", done => {
    supertest(sails.hooks.http.app)
      .delete(`/api/v1/products/${product1.id}`)
      .set(tokenName, token)
      .expect(200, done);
  });
});
describe(`#ProductController.remove bot1`, async () => {
  await it("should return json, deleted bot1", done => {
    supertest(sails.hooks.http.app)
      .delete(`/api/v1/products/${bot1.id}`)
      .set(tokenName, token)
      .expect(200, done);
  });
});
describe(`#ProductController.remove bot2`, async () => {
  await it("should return json, deleted bot2", done => {
    supertest(sails.hooks.http.app)
      .delete(`/api/v1/products/${bot2.id}`)
      .set(tokenName, token)
      .expect(200, done);
  });
});
