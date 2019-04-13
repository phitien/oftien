export const loadStocks = async () => {
  const { api, apis } = global;
  return api(apis.Stock.fetch);
};
export const loadStock = async ({ stock, apikey, cfunction }) => {
  const { api, apis } = global;
  return api(apis.Stock.detail, {
    function: cfunction || "TIME_SERIES_DAILY",
    symbol: stock,
    apikey: apikey || global.constants.alphavantageApiKey
  });
};
export const sampleStocks = [
  "MSFT",
  "AAPL",
  "INTC",
  "NFLX",
  "ORCL",
  "CMCSA",
  "GOOG",
  "LUV",
  "HOG",
  "GOOGL",
  "AMZN"
];
export const cfunctions = [
  ["", "Select function"],
  ["TIME_SERIES_DAILY", "Time Series (Daily)"],
  [
    "TIME_SERIES_DAILY_ADJUSTED",
    "Time Series (Daily)",
    "Time Series (Daily Adjusted)"
  ],
  ["TIME_SERIES_WEEKLY", "Weekly Time Series", "Time Series (Weekly)"],
  [
    "TIME_SERIES_WEEKLY_ADJUSTED",
    "Weekly Adjusted Time Series",
    "Time Series (Weekly Adjusted)"
  ],
  ["TIME_SERIES_MONTHLY", "Monthly Time Series", "Time Series (Monthly)"],
  [
    "TIME_SERIES_MONTHLY_ADJUSTED",
    "Monthly Adjusted Time Series",
    "Time Series (Monthly Adjusted)"
  ]
];

export function renderItem(params, api) {
  const xValue = api.value(0);
  const o = api.coord([xValue, api.value(1)]);
  const c = api.coord([xValue, api.value(2)]);
  const l = api.coord([xValue, api.value(3)]);
  const h = api.coord([xValue, api.value(4)]);
  const sW = api.size([1, 0])[0] * 0.15;
  // global.api = api;
  // global.params = params;
  const style = api.style({
    stroke: o[1] > c[1] ? api.visual("color") : "#118c1b"
  });
  return {
    type: "group",
    children: [
      {
        type: "line",
        shape: { x1: l[0], y1: l[1], x2: h[0], y2: h[1] },
        style: style
      },
      {
        type: "line",
        shape: { x1: o[0], y1: o[1], x2: o[0] - sW, y2: o[1] },
        style: style
      },
      {
        type: "line",
        shape: { x1: c[0], y1: c[1], x2: c[0] + sW, y2: c[1] },
        style: style
      }
    ]
  };
}
