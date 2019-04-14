/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  "*": "is-logged-in",
  "auth/*": true,
  "user/list": "can-crud-user",
  "user/detail": "can-crud-user",
  "user/userpassword": "can-crud-user",
  "user/userprofile": "can-crud-user",
  "user/userpreferences": "can-crud-user",
  "user/groups": "can-crud-user",
  "user/usercreate": "can-crud-user",
  "user/userremove": "can-crud-user"
};
