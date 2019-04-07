module.exports.routes = {
  "POST /api/v1/register": { action: "auth/register" }, // requests username and password
  "GET /api/v1/activate": { action: "auth/activate" }, // requests username and token
  "POST /api/v1/login": { action: "auth/login" }, // requests username and password
  "/api/v1/logout": { action: "auth/logout" }, // remove token from response
  "POST /api/v1/forgot": { action: "auth/forgot" }, // requests username
  "POST /api/v1/password": { action: "auth/password" }, // change password api, requests token, username, password, confirmed
  "GET /api/v1/password": { action: "auth/passwordform" }, // return html with a form to change password, requests username and token
  "/api/v1/auth": { action: "user/auth" }, // authenticate and create new token
  "GET /api/v1/profile": { action: "user/profile" }, // authenticate and keep old token

  "POST /api/v1/profile": { action: "user/profileupdate" }, // update profile
  "POST /api/v1/preferences": { action: "user/preferencesupdate" }, // update preferences
  "PUT /api/v1/passwordupdate": { action: "user/passwordupdate" }, // change password

  "GET /api/v1/users": { action: "user/list" }, // get list of users
  "GET /api/v1/users/:id": { action: "user/detail" }, // get user detail
  "DELETE /api/v1/users/:id": { action: "user/userremove" }, // remove a user
  "PUT /api/v1/userpassword/:id": { action: "user/userpassword" }, // change user's password
  "PUT /api/v1/usergroups/:id": { action: "user/groups" }, // set user's groups
  "PUT /api/v1/userprofile/:id": { action: "user/userprofile" }, // update user's profile
  "PUT /api/v1/userpreferences/:id": { action: "user/userpreferences" }, // create a user
  "POST /api/v1/usercreate": { action: "user/usercreate" },

  "GET /api/v1/groups": { action: "group/list" }, // get list of user groups
  "GET /api/v1/groups/:id": { action: "group/detail" }, // get detail of a user group

  "GET /api/v1/actions": { action: "action/list" }, // get list of user actions
  "GET /api/v1/actions/:id": { action: "action/detail" } // get detail of a user action
};
