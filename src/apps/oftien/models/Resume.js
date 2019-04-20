export const defaultState = {
  filter: { size: 10, page: 0 },
  resumes: [],
  detail: { settings: {} }
};
export const actions = [].merge(["Load", "Save"]);
export const apis = {
  fetch: {
    method: "get",
    // dataField: "data",
    url: `/api/v2/resume`,
    success: "ResumeLoad"
  },
  save: {
    method: "post",
    // dataField: "data",
    url: `/api/v2/resume`,
    success: "ResumeSave"
  }
};
export function reducer(state = defaultState, action) {
  const { type, payload } = action;
  if (type === "ResumeLoad") return { ...state, detail: { ...payload } };
  if (type === "ResumeSave") {
    state.detail = { ...state.detail, ...payload };
    return { ...state };
  }
  return state;
}
