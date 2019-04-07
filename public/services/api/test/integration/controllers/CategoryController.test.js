const expect = require("expect");
const supertest = require("supertest");

const catData = require("../../fixtures/category");
const newName = `${catData.name} - new`;

let cats, cat, cat1;

const userData = {
  username: "dev+super_administrator@amaris.ai",
  password: "dev+super_administrator@amaris.ai"
};
let tokenName, token;

before(async () => {
  tokenName = BaseService.tokenName();
});
describe("#Login", async () => {
  await it("", done => {
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
          expect(res.body).toBeTruthy();
          expect(res.body.id).toBeTruthy();
          expect(res.body.name).toBe(catData.name);
          cat = res.body;
          return done();
        }
      });
  });
});
describe("#CategoryController.update", async () => {
  await it("should return json, updated category", done => {
    supertest(sails.hooks.http.app)
      .put(`/api/v1/categories/${cat.id}`)
      .set(tokenName, token)
      .send({ ...cat, name: newName })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body).toBeTruthy();
          expect(res.body.id).toBe(cat.id);
          expect(res.body.name).toBe(newName);
          cat1 = res.body;
          return done();
        }
      });
  });
});
describe("#CategoryController.list", async () => {
  await it("should return json, an array of categories", done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/categories`)
      .set(tokenName, token)
      .send()
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBeGreaterThan(1);
          cats = res.body;
          const found = cats.find(o => o.id == cat1.id);
          expect(found).toBeTruthy();
          return done();
        }
      });
  });
});
describe("#CategoryController.remove", async () => {
  await it("should return json, deleted category", done => {
    supertest(sails.hooks.http.app)
      .delete(`/api/v1/categories/${cat.id}`)
      .set(tokenName, token)
      .send({ ...cat, name: newName })
      .expect(200, done);
  });
});
