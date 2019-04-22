function envBuilder() {
  const PORT = global.constants.bePort;
  const rootUrl = global.constants.beOrigin;
  const baseUrl = `${rootUrl}:${PORT}`;
  const dbAdapter = global.constants.dbAdapter;
  const dbLink = global.constants.dbLink;
  const uiBaseUrl = global.constants.uiBaseUrl;
  const allowOrigins = Array.from(
    new Set(global.constants.allowOrigins || [uiBaseUrl])
  );
  const internalEmailAddress = global.constants.internalEmailAddress;
  const modelsMigrate = global.constants.modelsMigrate;
  const logLevel = global.constants.logLevel;
  const activationRequired =
    global.constants.activationRequired &&
    global.constants.activationRequired === "true"
      ? true
      : false;
  const httpCache = global.constants.httpCache;
  const tokenName = global.constants.tokenName;
  const jwtSecret = global.constants.jwtSecret;
  const maxAge = parseInt(global.constants.maxAge);
  const sessionBuffer = parseInt(global.constants.sessionBuffer);
  const modelAttributeId =
    dbAdapter === "sails-mongo"
      ? { type: "string", columnName: "_id" }
      : { type: "number", autoIncrement: true, columnName: "id" };
  const dataEncryptionKeys = global.constants.dataEncryptionKeys;
  const emailAccount = global.constants.emailAccount || "oftien@gmail.com";
  const emailPassword = global.constants.emailPassword || "Password@1234";
  const SSL = global.constants.SSL || undefined;

  return {
    uploads: {
      adapter: require("skipper-disk")
    },
    datastores: {
      default: {
        adapter: dbAdapter,
        url: dbLink
        // ssl: true
      }
    },
    models: {
      schema: true,
      migrate: modelsMigrate,
      attributes: {
        createdAt: { type: "number", autoCreatedAt: true },
        updatedAt: { type: "number", autoUpdatedAt: true },
        id: modelAttributeId
      },
      dataEncryptionKeys: { default: dataEncryptionKeys },
      cascadeOnDestroy: true
    },
    blueprints: {
      // actions: false,
      rest: false,
      shortcuts: false
    },
    security: {
      cors: {
        allowOrigins: allowOrigins,
        allRoutes: true,
        allowCredentials: true,
        allowRequestHeaders: `content-type,x-csrf-token,token,${tokenName}`
      }
    },
    session: {
      cookie: {
        maxAge
      }
    },
    sockets: {
      onlyAllowOrigins: allowOrigins
    },
    log: {
      level: logLevel
    },
    http: {
      cache: httpCache
      // trustProxy: true,
    },
    port: PORT,
    ssl: SSL,
    email: {
      service: "Gmail",
      auth: { user: emailAccount, pass: emailPassword },
      testMode: true
    },
    custom: {
      baseUrl,
      rootUrl,
      uiBaseUrl,
      tokenName,
      internalEmailAddress,
      activationRequired,
      sessionBuffer,
      jwtSecret
    }
  };
}

module.exports = envBuilder();
module.exports.envBuilder = envBuilder;
