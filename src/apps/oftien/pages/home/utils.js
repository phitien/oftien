export const loadProfile = async username => {
  username = !username || username === ":username" ? "oftien" : username;
  const { api, apis } = global;
  return api(apis.Resume.fetch, null, [username]);
};
