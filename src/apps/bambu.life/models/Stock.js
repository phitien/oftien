export const defaultState = {
  filter: { size: 10, page: 0 },
  list: [],
  detail: {}
};
export const actions = [].merge(["List", "Detail"]);
export const apis = {
  fetch: {
    method: "get",
    // dataField: "data",
    url: `/api/v2/stocks`,
    success: "StockList"
  },
  detail: {
    method: "get",
    // dataField: "data",
    url: `https://www.alphavantage.co/query`,
    success: "StockDetail",
    valid: json => !json.hasOwnProperty("Error Message")
  },
  save: {
    method: "post",
    // dataField: "data",
    url: `/api/v2/stock`,
    success: "StockSave"
  }
};
export function reducer(state = defaultState, action) {
  const { type, payload } = action;
  if (type === "StockList") return { ...state, list: [].merge(payload) };
  if (type === "StockDetail") return { ...state, detail: { ...payload } };
  return state;
}
