/**
 * custom hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCustomHook(sails) {
  return {
    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function(done) {
      sails.log.info("Initializing hook... (`api/hooks/custom`)");

      // Check Stripe/Mailgun configuration (for billing and emails).
      var IMPORTANT_STRIPE_CONFIG = ["stripeSecret", "stripePublishableKey"];
      var IMPORTANT_MAILGUN_CONFIG = [
        "mailgunSecret",
        "mailgunDomain",
        "internalEmailAddress"
      ];
      var isMissingStripeConfig =
        _.difference(IMPORTANT_STRIPE_CONFIG, Object.keys(sails.config.custom))
          .length > 0;
      var isMissingMailgunConfig =
        _.difference(IMPORTANT_MAILGUN_CONFIG, Object.keys(sails.config.custom))
          .length > 0;

      if (isMissingStripeConfig || isMissingMailgunConfig) {
        let missingFeatureText =
          isMissingStripeConfig && isMissingMailgunConfig
            ? "billing and email"
            : isMissingStripeConfig
            ? "billing"
            : "email";
        let suffix = "";
        if (_.contains(["silly"], sails.config.log.level)) {
          suffix = `
> Tip: To exclude sensitive credentials from source control, use:
> • config/local.js (for local development)
> • environment variables (for production)
>
> If you want to check them in to source control, use:
> • config/custom.js  (for development)
> • config/env/staging.js  (for staging)
> • config/env/production.js  (for production)
>
> (See https://sailsjs.com/docs/concepts/configuration for help configuring Sails.)
`;
        }

        let problems = [];
        if (sails.config.custom.stripeSecret === undefined) {
          problems.push(
            "No `sails.config.custom.stripeSecret` was configured."
          );
        }
        if (sails.config.custom.stripePublishableKey === undefined) {
          problems.push(
            "No `sails.config.custom.stripePublishableKey` was configured."
          );
        }
        if (sails.config.custom.mailgunSecret === undefined) {
          problems.push(
            "No `sails.config.custom.mailgunSecret` was configured."
          );
        }
        if (sails.config.custom.mailgunDomain === undefined) {
          problems.push(
            "No `sails.config.custom.mailgunDomain` was configured."
          );
        }
        if (sails.config.custom.internalEmailAddress === undefined) {
          problems.push(
            "No `sails.config.custom.internalEmailAddress` was configured."
          );
        }

        sails.log.verbose(
          `Some optional settings have not been configured yet:
---------------------------------------------------------------------
${problems.join("\n")}

Until this is addressed, this app's ${missingFeatureText} features
will be disabled and/or hidden in the UI.

 [?] If you're unsure or need advice, come by https://sailsjs.com/support
---------------------------------------------------------------------${suffix}`
        );
      } //ﬁ

      // Set an additional config keys based on whether Stripe config is available.
      // This will determine whether or not to enable various billing features.
      sails.config.custom.enableBillingFeatures = !isMissingStripeConfig;

      // After "sails-hook-organics" finishes initializing, configure Stripe
      // and Mailgun packs with any available credentials.
      sails.after("hook:organics:loaded", () => {
        sails.helpers.stripe.configure({
          secret: sails.config.custom.stripeSecret
        });

        sails.helpers.mailgun.configure({
          secret: sails.config.custom.mailgunSecret,
          domain: sails.config.custom.mailgunDomain,
          from: sails.config.custom.fromEmailAddress,
          fromName: sails.config.custom.fromName
        });
      }); //_∏_

      // ... Any other app-specific setup code that needs to run on lift,
      // even in production, goes here ...

      return done();
    },

    routes: {
      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        "/*": {
          skipAssets: true,
          fn: async function(req, res, next) {
            var url = require("url");
            // First, if this is a GET request (and thus potentially a view),
            // attach a couple of guaranteed locals.
            if (req.method === "GET") {
              // The  `_environment` local lets us do a little workaround to make Vue.js
              // run in "production mode" without unnecessarily involving complexities
              // with webpack et al.)
              if (res.locals._environment !== undefined) {
                throw new Error(
                  "Cannot attach Sails environment as the view local `_environment`, because this view local already exists!  (Is it being attached somewhere else?)"
                );
              }
              res.locals._environment = sails.config.environment;

              // The `me` local is set explicitly to `undefined` here just to avoid having to
              // do `typeof me !== 'undefined'` checks in our views/layouts/partials.
              // > Note that, depending on the request, this may or may not be set to the
              // > logged-in user record further below.
              if (res.locals.me !== undefined) {
                throw new Error(
                  "Cannot attach view local `me`, because this view local already exists!  (Is it being attached somewhere else?)"
                );
              }
              res.locals.me = undefined;
            } //ﬁ

            // Next, if we're running in our actual "production" or "staging" Sails
            // environment, check if this is a GET request via some other subdomain,
            // for example something like `webhooks.` or `click.`.  If so, we'll
            // automatically go ahead and redirect to the corresponding path under
            // our base URL, which is environment-specific.
            // > Note that we DO NOT redirect virtual socket requests and we DO NOT
            // > redirect non-GET requests (because it can confuse some 3rd party
            // > platforms that send webhook requests.)
            var configuredBaseSubdomain;
            try {
              configuredBaseSubdomain = url
                .parse(sails.config.custom.uiBaseUrl)
                .host.match(/^([^\.]+)\./)[1];
            } catch (unusedErr) {
              /*…*/
            }
            if (
              (sails.config.environment === "staging" ||
                sails.config.environment === "production") &&
              !req.isSocket &&
              req.method === "GET" &&
              req.subdomains[0] !== configuredBaseSubdomain
            ) {
              sails.log.info(
                "Redirecting GET request from `" +
                  req.subdomains[0] +
                  ".` subdomain..."
              );
              return res.redirect(sails.config.custom.uiBaseUrl + req.url);
            } //•
            res.set("Access-Control-Allow-Headers", true);
            res.set("Access-Control-Expose-Headers", true);

            const tokenName = BaseService.tokenName();
            const token = req.get(tokenName);
            const { session } = req;

            // No session? Proceed as usual.
            // (e.g. request for a static asset)
            if (!session && !token) return next();
            const userId = session.userId;
            // Not logged in? Proceed as usual.
            if (!userId && !token) return next();
            let user;
            if (token) user = await UserService.profile({ token }, true);
            else user = await UserService.detailById(userId);
            // If the logged-in user has gone missing, log a warning,
            // wipe the user id from the requesting user agent's session,
            // and then send the "unauthorized" response.
            if (!user) {
              sails.log.warn(
                `Somehow, the user record for the logged-in user has gone missing...: ${
                  token ? token : userId
                }`
              );
              delete req.session.userId;
              res.set(tokenName, "");
              throw new errors.UnauthorizedError("Unauthorized");
            }
            res.set(tokenName, user.token);
            // Add additional information for convenience when building top-level navigation.
            // (i.e. whether to display "Dashboard", "My Account", etc.)
            if (user.status === "unconfirmed")
              user.dontDisplayAccountLinkInNav = true;
            // Expose the user record as an extra property on the request object (`req.me`).
            // > Note that we make sure `req.me` doesn't already exist first.
            if (req.me !== undefined) {
              throw new errors.AppError(
                "Cannot attach logged-in user as `req.me` because this property already exists!  (Is it being attached somewhere else?)"
              );
            }
            req.me = UserService.currentUser = user;
            const { sessionBuffer } = sails.config.custom;
            var now = Date.now();
            if (!user.lastSeenAt || user.lastSeenAt < now - sessionBuffer)
              await UserService.setLastSeen(user, now);
            // If this is a GET request, then also expose an extra view local (`<%= me %>`).
            // > Note that we make sure a local named `me` doesn't already exist first.
            // > Also note that we strip off any properties that correspond with protected attributes.
            if (req.method === "GET") {
              if (res.locals.me !== undefined) {
                throw new errors.AppError(
                  "Cannot attach logged-in user as the view local `me`, because this view local already exists!  (Is it being attached somewhere else?)"
                );
              }

              // Exclude any fields corresponding with attributes that have `protect: true`.
              var sanitizedUser = _.extend({}, user);
              for (let attrName in User.attributes) {
                if (User.attributes[attrName].protect) {
                  delete sanitizedUser[attrName];
                }
              } //∞

              // If there is still a "password" in sanitized user data, then delete it just to be safe.
              // (But also log a warning so this isn't hopelessly confusing.)
              if (sanitizedUser.password) {
                sails.log.warn(
                  "The logged in user record has a `password` property, but it was still there after pruning off all properties that match `protect: true` attributes in the User model.  So, just to be safe, removing the `password` property anyway..."
                );
                delete sanitizedUser.password;
              } //ﬁ

              res.locals.me = sanitizedUser;

              // Include information on the locals as to whether billing features
              // are enabled for this app, and whether email verification is required.
              const {
                enableBillingFeatures,
                verifyEmailAddresses
              } = sails.config.custom;
              res.locals.isBillingEnabled = enableBillingFeatures;
              res.locals.isEmailVerificationRequired = verifyEmailAddresses;
            } //ﬁ
            // Prevent the browser from caching logged-in users' pages.
            // (including w/ the Chrome back button)
            // > • https://mixmax.com/blog/chrome-back-button-cache-no-store
            // > • https://madhatted.com/2013/6/16/you-do-not-understand-browser-history
            res.setHeader("Cache-Control", "no-cache, no-store");

            return next();
          }
        }
      }
    }
  };
};
