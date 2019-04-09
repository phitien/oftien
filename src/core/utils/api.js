import queryHelper from "query-string";
import stringify from "json-stringify-safe";

const method = (global.method = (opts, data, path) =>
  (opts.method || "get").lower());
const normaliseUrl = (global.normaliseUrl = url => url);
const url = (global.url = (opts, data, path) => {
  let uri = opts.url;
  let { query, body } = opts;
  path = path || opts.path;
  const reqMethod = method(opts);
  const idx = uri.indexOf("?");
  let pathname = (idx >= 0 ? uri.substr(0, idx) : uri).replace(/\/$/g, "");
  pathname = [].merge(pathname, path).join("/");
  let querystr = idx >= 0 ? uri.substr(idx) : "";
  if (reqMethod === "get") {
    query = { ...query, ...body, ...data };
    if (!Object.isEmpty(query))
      querystr = `${querystr}&${queryHelper.stringify(query)}`
        .split("&")
        .filter(o => o)
        .join("&");
  }
  return normaliseUrl(querystr ? `${pathname}?${querystr}` : pathname);
});
const options = (global.options = (opts, data, path) => {
  const options = {
    ...opts,
    mode: "cors",
    method: method(opts),
    headers: headers(opts),
    body: { ...opts.query, ...opts.body, ...data }
  };
  if (options.method === "get") delete options.body;
  else if (options.body) options.body = stringify(options.body);
  return options;
});
const headers = (global.headers = (opts, data, path) => {
  return {
    Accept: "application/jon, text/plain, text/html, */*",
    "Content-Type": "application/json; charset=utf-8",
    ...opts.headers
  };
});
const api = (global.api = async (opts, data, path) => {
  const { constants, dispatch, dispatchAll } = global;
  const { spinner, dataField, before, after, success, failure } = opts;
  if (spinner !== false)
    await dispatch({ type: "ApplicationSpinning", payload: true });
  await dispatchAll([opts, data, path], before);
  return fetch(url(opts, data, path), options(opts, data, path))
    .then(async res => {
      if (res.status === 404) {
        const err = { message: "API not found" };
        throw err;
      }
      if (res.status === 401)
        await dispatch({ type: "ApplicationUnauthorized" });
      else await dispatch({ type: "ApplicationClearError" });
      let json;
      try {
        json = await res.json();
      } catch (e) {
        const err = { ...res, message: res.statusText };
        throw err;
      }
      if (res.ok) {
        const { tokenName } = constants;
        if (json.hasOwnProperty(tokenName))
          await dispatch({
            type: "ApplicationAuthenticate",
            payload: json
          });
        if (json.error)
          await dispatch({
            type: "ApplicationAddError",
            payload: json.error
          });
        return (json = dataField ? json[dataField] : json);
      }
      const err = { message: "Unknown error", ...json };
      throw err;
    })
    .then(async json => {
      await dispatchAll(json, success);
      return json;
    })
    .catch(async err => {
      console.log("API: error", err);
      err = { error: true, type: "error", message: "Unknown error", ...err };
      await dispatch({ type: "ApplicationAddError", payload: err });
      await dispatchAll(err, failure);
      return err;
    })
    .then(async json => {
      await setTimeout(async () => {
        if (spinner !== false)
          await dispatch({ type: "ApplicationSpinning", payload: false });
        await await dispatchAll(json, after);
      }, 1000);
      return json;
    });
});
export { api, url, method, headers, options, normaliseUrl };
