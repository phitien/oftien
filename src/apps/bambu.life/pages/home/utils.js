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
  ["", "Type"],
  ["TIME_SERIES_DAILY", "Time Series (Daily)"],
  ["TIME_SERIES_DAILY_ADJUSTED", "Time Series (Daily)"],
  ["TIME_SERIES_WEEKLY", "Weekly Time Series"],
  ["TIME_SERIES_WEEKLY_ADJUSTED", "Weekly Adjusted Time Series"],
  ["TIME_SERIES_MONTHLY", "Monthly Time Series"],
  ["TIME_SERIES_MONTHLY_ADJUSTED", "Monthly Adjusted Time Series"]
];

export function renderItem(params, api) {
  var xValue = api.value(0);
  var openPoint = api.coord([xValue, api.value(1)]);
  var closePoint = api.coord([xValue, api.value(2)]);
  var lowPoint = api.coord([xValue, api.value(3)]);
  var highPoint = api.coord([xValue, api.value(4)]);
  var halfWidth = api.size([1, 0])[0] * 0.35;
  var style = api.style({
    stroke: api.visual("color")
  });

  return {
    type: "group",
    children: [
      {
        type: "line",
        shape: {
          x1: lowPoint[0],
          y1: lowPoint[1],
          x2: highPoint[0],
          y2: highPoint[1]
        },
        style: style
      },
      {
        type: "line",
        shape: {
          x1: openPoint[0],
          y1: openPoint[1],
          x2: openPoint[0] - halfWidth,
          y2: openPoint[1]
        },
        style: style
      },
      {
        type: "line",
        shape: {
          x1: closePoint[0],
          y1: closePoint[1],
          x2: closePoint[0] + halfWidth,
          y2: closePoint[1]
        },
        style: style
      }
    ]
  };
}
