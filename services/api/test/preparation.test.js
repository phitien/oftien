const expect = require("expect");
const supertest = require("supertest");

const groupData = require("./fixtures/usergroup");
const actionData = require("./fixtures/useraction");
const registerData = require("./fixtures/user");
const profileData = require("./fixtures/userprofile");
const preferencesData = require("./fixtures/userpreferences");

let tokenName, group, action, user, token;
let activationUrl, forgotUrl;

before(async () => {
  tokenName = BaseService.tokenName();
});
describe("Create UserGroup", async () => {
  await it(`upsert: add group '${groupData.name}'`, async () => {
    group = await UserGroupService.upsert(groupData);
    expect(group).toBeTruthy();
    expect(group.name).toBe(groupData.name);
  });
});
describe("Create UserAction", async () => {
  await it(`upsert: add action '${actionData.name}'`, async () => {
    action = await UserActionService.upsert(actionData);
    expect(action).toBeTruthy();
    expect(action.name).toBe(actionData.name);
  });
});
describe("Add & remove group action", async () => {
  await it(``, async () => {
    await UserGroupService.addAction(group.id, action.id);
    group = await UserGroupService.detail(group.id);
    expect(group).toBeTruthy();
    expect(group.actions.find(o => o.id === action.id)).toBeTruthy();
    await UserGroupService.removeAction(group.id, action.id);
    group = await UserGroupService.detail(group.id);
    expect(group).toBeTruthy();
    expect(group.actions.length).toBe(0);

    await UserActionService.addToGroup(action.id, group.id);
    action = await UserActionService.detail(action.id);
    expect(action).toBeTruthy();
    expect(action.groups.find(o => o.id === group.id)).toBeTruthy();
    await UserActionService.removeFromGroup(action.id, group.id);
    action = await UserActionService.detail(action.id);
    expect(action).toBeTruthy();
    expect(action.groups.length).toBe(0);
  });
});
describe("Prepare group & action", async () => {
  await it(``, async () => {
    await UserGroupService.addAction(group.id, action.id);
    group = await UserGroupService.detail(group.id);
    action = await UserActionService.detail(action.id);
  });
});
describe("#UserService.register", async () => {
  await it(`register`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/register`)
      .send(registerData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          if (sails.config.custom.activationRequired) {
            expect(res.body.activationUrl).toBeTruthy();
            activationUrl = res.body.activationUrl.replace(
              sails.config.custom.rootUrl,
              ""
            );
          } else {
            expect(res.body[tokenName]).toBeTruthy();
            token = res.body[tokenName];
          }
          return done();
        }
      });
  });
});
describe("#UserService.login", async () => {
  await it(`failed`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/login`)
      .send(registerData)
      .expect(sails.config.custom.activationRequired ? 500 : 200, done);
  });
});
describe("#UserService.activate", async () => {
  await it(`activate`, done => {
    if (sails.config.custom.activationRequired)
      supertest(sails.hooks.http.app)
        .get(activationUrl)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          } else {
            expect(res.headers).toBeTruthy();
            expect(res.headers[tokenName]).toBeTruthy();
            expect(res.body).toBeTruthy();
            expect(res.body[tokenName]).toBeTruthy();
            expect(res.body[tokenName]).toBe(res.headers[tokenName]);
            expect(res.body.preferences).toBeTruthy();
            expect(res.body.profile).toBeTruthy();
            expect(res.body.username).toBe(registerData.username);
            user = res.body;
            return done();
          }
        });
    else return done();
  });
});
describe("#UserService.login", async () => {
  await it(`ok`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/login`)
      .send(registerData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.headers).toBeTruthy();
          expect(res.headers[tokenName]).toBeTruthy();
          expect(res.body).toBeTruthy();
          expect(res.body[tokenName]).toBeTruthy();
          expect(res.body[tokenName]).toBe(res.headers[tokenName]);
          user = await UserService.detail(registerData.username);
          expect(user).toBeTruthy();
          expect(res.body[tokenName]).toBe(user.token);
          token = res.body[tokenName];
          return done();
        }
      });
  });
});
describe("#UserService.auth", async () => {
  await it(`auth`, done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/auth`)
      .set(tokenName, token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.headers).toBeTruthy();
          expect(res.headers[tokenName]).toBeTruthy();
          expect(res.body).toBeTruthy();
          expect(res.body[tokenName]).toBeTruthy();
          expect(res.body[tokenName]).toBe(res.headers[tokenName]);
          expect(res.headers[tokenName] !== token).toBe(true);
          token = res.body[tokenName];
          return done();
        }
      });
  });
});
describe("#UserService.profile", async () => {
  await it(`profile`, done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/profile`)
      .set(tokenName, token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body).toBeTruthy();
          expect(res.body.id).toBe(user.id);
          expect(res.body.username).toBe(user.username);
          expect(res.body.profile).toBeTruthy();
          expect(res.body.preferences).toBeTruthy();
          user = res.body;
          return done();
        }
      });
  });
});
describe("#UserService.profile", async () => {
  await it(`profile update`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/profile`)
      .set(tokenName, token)
      .send(profileData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body.profile).toBeTruthy();
          expect(res.body.profile.company).toBe(profileData.company);
          user = res.body;
          return done();
        }
      });
  });
});
describe("#UserService.preferences", async () => {
  await it(`preferences update`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/preferences`)
      .set(tokenName, token)
      .send(preferencesData)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body.preferences).toBeTruthy();
          expect(res.body.preferences.nameFormat).toBe(
            preferencesData.nameFormat
          );
          expect(res.body.preferences.homepage).toBe(preferencesData.homepage);
          user = res.body;
          return done();
        }
      });
  });
});
describe("#UserService.logout", async () => {
  await it(`logout`, done => {
    supertest(sails.hooks.http.app)
      .get(`/api/v1/logout`)
      .set(tokenName, token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.headers).toBeTruthy();
          expect(res.headers[tokenName] === "").toBe(true);
          token = res.headers[tokenName];
          return done();
        }
      });
  });
});
describe("#UserService.forgot", async () => {
  await it(`forgot`, done => {
    supertest(sails.hooks.http.app)
      .post(`/api/v1/forgot`)
      .send({ username: registerData.username })
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        } else {
          expect(res.body.forgotUrl).toBeTruthy();
          forgotUrl = res.body.forgotUrl.replace(
            sails.config.custom.rootUrl,
            ""
          );
          return done();
        }
      });
  });
});
describe("#UserService.password", async () => {
  await it(`password`, done => {
    supertest(sails.hooks.http.app)
      .post(forgotUrl)
      .send({
        password: registerData.password,
        confirmed: registerData.password
      })
      .expect(200, done);
  });
});
