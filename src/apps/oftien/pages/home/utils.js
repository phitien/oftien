export const loadProfile = async username => {
  username = !username || username === ":username" ? "oftien" : username;
  const { api, apis } = global;
  return api(apis.Resume.fetch, null, [username]);
};
export const colors = [
  "brown",
  "cadetblue",
  "green",
  "orange",
  "deeppink",
  "saddlebrown",
  "sienna",
  "slategrey",
  "steelblue",
  "tan",
  "teal",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "yellowgreen"
];
