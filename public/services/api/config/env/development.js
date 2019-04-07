function envBuilder() {
  const PORT = process.env.bePort;
  const rootUrl = process.env.beOrigin;
  const baseUrl = `${rootUrl}:${PORT}`;
  const dbAdapter = process.env.dbAdapter;
  const dbLink = process.env.dbLink;
  const uiBaseUrl = process.env.uiBaseUrl;
  const allowOrigins = Array.from(new Set(process.env.allowOrigins || [uiBaseUrl]));
  const internalEmailAddress = process.env.internalEmailAddress;
  const modelsMigrate = process.env.modelsMigrate;
  const logLevel = process.env.logLevel;
  const activationRequired =
    process.env.activationRequired && process.env.activationRequired === "true"
      ? true
      : false;
  const httpCache = process.env.httpCache;
  const tokenName = process.env.tokenName;
  const jwtSecret = process.env.jwtSecret;
  const maxAge = parseInt(process.env.maxAge);
  const sessionBuffer = parseInt(process.env.sessionBuffer);
  const modelAttributeId =
    dbAdapter === "sails-mongo"
      ? { type: "string", columnName: "_id" }
      : { type: "number", autoIncrement: true, columnName: "id" };
  const dataEncryptionKeys = process.env.dataEncryptionKeys;
  const emailAccount = process.env.emailAccount || "apa.amaris@gmail.com";
  const emailPassword = process.env.emailPassword || "Password@1234";
  const SSL = process.env.SSL || undefined;

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
      cdapUrl,
      uiBaseUrl,
      tokenName,
      internalEmailAddress,
      activationRequired,
      sessionBuffer,
      jwtSecret,
      taguipath
    }
  };
}

module.exports = envBuilder();
module.exports.envBuilder = envBuilder;
