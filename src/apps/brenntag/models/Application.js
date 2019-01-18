const { app } = global.constants;

export const defaultState = { loading: false, popups: [], notifications: [] };
defaultState.token = null;
defaultState.user = {};
defaultState.menu = [];
export const actions = [].merge(
  ["LoadConfig", "LoadToken", "Authenticate", "Unauthorized", "Logout"],
  ["Spinning", "ClearError", "AddError", "DismissNotification"]
);
export const apis = {
  config: {
    url: `/${app}/data/application.json`,
    success: "ApplicationLoadConfig",
    failure: "NotificationNotify"
  }
};
export function reducer(state = defaultState, action) {
  const { type, payload } = action;
  const { tokenName } = global.constants;
  if (type === "ApplicationDismissNotification") {
    const idx = state.notifications.indexOf(payload);
    if (idx >= 0) state.notifications.splice(idx, 1);
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
  if (type === "ApplicationAddError") {
    state.notifications.push({ type: "error", ...payload });
    return { ...state };
  }
  if (type === "ApplicationClearError") {
    state.notifications = state.notifications.filter(o => o.type !== "error");
    return { ...state };
  }
  return { ...state };
}
