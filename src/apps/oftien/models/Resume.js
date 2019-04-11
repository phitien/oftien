export const defaultState = {
  filter: { size: 10, page: 0 },
  resumes: [],
  detail: {}
};
export const actions = [].merge(["List", "Filter", "Save"]);
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
  if (type === "ResumeSave") return { ...state, detail: { ...payload } };
  return state;
}
