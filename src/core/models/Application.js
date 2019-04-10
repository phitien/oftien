const { app } = global.constants;

export const defaultState = { loading: false, popups: [], notifications: [] };
defaultState.token = null;
defaultState.user = {};
defaultState.menu = [];
export const actions = [].merge(
  ["LoadConfig", "LoadToken", "Authenticate", "Unauthorized", "Logout"],
  ["Spinning"],
  ["ClearError", "AddError", "Notify", "Warn", "RemoveNotification"],
  ["AddPopup", "RemovePopup", "RemoveLastPopup", "RemoveAllPopup"]
);
export const apis = {
  config: {
    url: global.constants.config || `/static/apps/${app}/data/info.json`,
    success: "ApplicationLoadConfig",
    failure: "ApplicationAddError"
  }
};
export function reducer(state = defaultState, action) {
  const { type, payload } = action;
  const { tokenName } = global.constants;
  if (type === "ApplicationAddPopup") {
    state.popups.push(payload);
    return { ...state };
  }
  if (type === "ApplicationRemoveLastPopup") {
    state.popups.pop();
    return { ...state };
  }
  if (type === "ApplicationRemovePopup") {
    const idx = state.popups.indexOf(payload);
    if (idx >= 0) state.popups.splice(idx, 1);
    return { ...state };
  }
  if (type === "ApplicationRemoveAllPopup") {
    return { ...state, popups: [] };
  }
  if (type === "ApplicationRemoveNotification") {
    const idx = state.notifications.indexOf(payload);
    if (idx >= 0) state.notifications.splice(idx, 1);
    return { ...state };
  }
  if (
    type === "ApplicationAddError" ||
    type === "ApplicationNotify" ||
    type === "ApplicationWarn"
  ) {
    state.notifications.push({
      type:
        type === "ApplicationAddError"
          ? "error"
          : type === "ApplicationWarn"
          ? "warning"
          : "message",
      ...(typeof payload === "string" ? { message: payload } : payload)
    });
    return { ...state };
  }
  if (type === "ApplicationClearError") {
    state.notifications = state.notifications.filter(o => o.type !== "error");
    return { ...state };
  }
  if (type === "ApplicationSpinning") return { ...state, loading: payload };
  if (type === "ApplicationLoadConfig") return { ...state, ...payload };
  if (type === "ApplicationLoadToken")
    return { ...state, token: localStorage.getItem(tokenName) };
  if (type === "ApplicationAuthenticate")
    return { ...state, token: payload[tokenName], user: payload };
  if (type === "ApplicationUnauthorized") {
    localStorage.setItem(tokenName, "");
    state.notifications.push({
      type: "error",
      message: "You have been signed out"
    });
    return { ...state, token: null, user: {} };
  }
  if (type === "ApplicationLogout") {
    localStorage.setItem(tokenName, "");
    return { ...state, token: null, user: {} };
  }
  return state || {};
}
