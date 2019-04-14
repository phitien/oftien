import "./main.scss";

import React from "react";
import { Helmet } from "react-helmet";
import ReactEcharts from "echarts-for-react";

import { Icon, Logo, Space, Page } from "../../../../core";

import AddStock from "./AddStock";

import { loadStock, sampleStocks, cfunctions } from "./utils";
import { renderItem } from "./utils";

export default class Main extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Top_LeftMain_Bottom";
  static className = "route-home-main";
  state = {
    zoom: JSON.parse(global.localStorage.getItem("zoom")) || {},
    apikey:
      global.localStorage.getItem("apikey") ||
      global.constants.alphavantageApiKey,
    cfunction: global.localStorage.getItem("cfunction") || "TIME_SERIES_DAILY",
    stock: global.localStorage.getItem("stock"),
    stocks: Array.from(
      new Set([].merge(JSON.parse(global.localStorage.getItem("stocks"))))
    )
  };
  get isValid() {
    const { stock, cfunction, apikey } = this.state;
    return stock && cfunction && apikey;
  }
  get stockZoom() {
    const { zoom, stock } = this.state;
    return zoom[stock] || { start: 70, end: 100, minValueSpan: 20 };
  }
  constructor(props) {
    super(props);
    if (!this.state.stocks.length) this.state.stocks = sampleStocks;
    if (this.state.stock && !this.state.stocks.includes(this.state.stock))
      this.state.stocks.push(this.state.stock);
  }
  async componentDidMount() {
    await super.componentDidMount();
    await this.loadStock();
  }
  cache = async (name, value, cb) => {
    this.setState({ name: value }, async () => {
      await global.localStorage.setItem(
        name,
        typeof value === "object" ? JSON.stringify(value) : value
      );
      if (cb) await cb(name, value);
    });
  };
  chartData = () => {
    const { cfunction } = this.state;
    const [key, value, text] = cfunctions.find(([k, v]) => k === cfunction);
    const data = this.props.Stock.detail[value];
    if (!data) return {};
    const categoryData = [];
    const values = [];
    let i = 0;
    for (let d in data) {
      const r = data[d];
      categoryData.unshift(d);
      const value = [
        i,
        parseFloat(r["1. open"]),
        parseFloat(r["4. close"]),
        parseFloat(r["3. low"]),
        parseFloat(r["2. high"]),
        parseFloat(r["5. volume"])
      ];
      values.unshift(value);
      i++;
    }
    return { categoryData, values };
  };

  chartOptions = (data, title, subtext) => {
    const { start, end, minValueSpan } = this.stockZoom;
    return {
      backgroundColor: "#fff",
      color: "#c23632",
      animation: false,
      legend: { top: 10, left: "center", data: [title] },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        backgroundColor: "rgba(245, 245, 245, 0.8)",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: { color: "#000" },
        position: function(pos, params, el, elRect, size) {
          var obj = { top: 10 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        extraCssText: "width: 170px"
      },
      axisPointer: {
        link: { xAxisIndex: "all" },
        label: { backgroundColor: "#777" }
      },
      grid: [{ left: "5%", right: "5%", bottom: 40 }],
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 10,
          min: "dataMin",
          max: "dataMax",
          axisPointer: { z: 100 }
        }
      ],
      yAxis: [{ scale: true, splitArea: { show: true } }],
      dataZoom: [
        { type: "inside", start, end, minValueSpan },
        { show: true, type: "slider", bottom: 35, start, end, minValueSpan }
      ],
      series: [
        {
          name: title,
          type: "custom",
          renderItem,
          dimensions: [null, "open", "close", "lowest", "highest"],
          encode: {
            x: 0,
            y: [1, 2, 3, 4],
            tooltip: [1, 2, 3, 4]
          },
          data: data.values
        }
      ]
    };
  };
  loadStock = async () => {
    if (!this.isValid) return;
    const { stock, cfunction, apikey } = this.state;
    await loadStock({ stock, apikey, cfunction });
  };
  onStockClick = (stock, e) => {
    global.jQuery(e.target.closest(".left,.right")).addClass("hide-symbols");
    this.setState({ stock }, e => {
      global.localStorage.setItem("stock", stock);
      this.loadStock();
    });
  };
  renderTop() {
    return (
      <div className="wrapper">
        <Logo />
      </div>
    );
  }
  renderLeft() {
    const { stocks, stock } = this.state;
    return (
      <div className="wrapper">
        <h4>
          Watch list
          <Space />
          <Icon
            icon={`fas fa-list`}
            title="Toggle symbols"
            onClick={e => {
              const el = e.target.closest(".left,.right");
              el.closed = !el.closed;
              if (el.closed)
                global
                  .jQuery(el)
                  .addClass("hide-symbols")
                  .find(".wrapper .stocks")
                  .slideUp();
              else
                global
                  .jQuery(el)
                  .removeClass("hide-symbols")
                  .find(".wrapper .stocks")
                  .slideDown();
            }}
          />
          <Icon
            icon="fas fa-plus"
            title="Add symbol"
            onClick={e =>
              this.props.ApplicationAddPopup(
                <AddStock
                  ref={e => (this.addStockPopup = e)}
                  confirm={e => {
                    const newStocks = Array.from(
                      new Set([
                        ...stocks,
                        ...(!this.addStockPopup
                          ? []
                          : this.addStockPopup.state.value
                              .split(",")
                              .map(o => o.trim())
                              .filter(o => o))
                      ])
                    );
                    return this.setState({ stocks: newStocks }, e =>
                      global.localStorage.setItem(
                        "stocks",
                        JSON.stringify(newStocks)
                      )
                    );
                  }}
                />
              )
            }
          />
        </h4>
        <div className="stocks">
          {stocks.map((o, i) => (
            <div
              key={i}
              className={`stock ${o === stock ? "active" : ""}`}
              onClick={this.onStockClick.bind(this, o)}
            >
              {o}
              <Space />
              <Icon
                icon="fas fa-trash-alt"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  global
                    .jQuery(e.target.closest(".left,.right"))
                    .removeClass("hide-symbols");
                  stocks.splice(stocks.indexOf(o), 1);
                  this.setState(
                    { stocks },
                    global.localStorage.setItem(
                      "stocks",
                      JSON.stringify(stocks)
                    )
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  renderMain() {
    const { stock, apikey, cfunction } = this.state;
    return (
      <div className="wrapper">
        <Helmet>
          <title>Bambu D3 - demo</title>
          <meta name="keywords" content="Bambu D3 - demo" />
          <meta name="description" content="Bambu D3 - demo" />
        </Helmet>
        <h3>OHLC chart for {stock}</h3>
        <input
          type="text"
          title="Alphavantage API key"
          placeholder="Alphavantage API key"
          value={apikey}
          onChange={e =>
            this.setState({ apikey: e.target.value }, () =>
              global.localStorage.setItem("apikey", this.state.apikey)
            )
          }
        />
        <select
          title="Alphavantage query function"
          value={cfunction}
          onChange={e =>
            this.setState({ cfunction: e.target.value }, () => {
              global.localStorage.setItem("cfunction", this.state.cfunction);
              this.loadStock();
            })
          }
        >
          {cfunctions.map(([k, v, t], i) => (
            <option key={i} value={k}>
              {t || v}
            </option>
          ))}
        </select>
        <div className="echarts container" ref={e => (this.echarts = e)}>
          {!this.isValid ? null : (
            <ReactEcharts
              option={this.chartOptions(this.chartData(), stock)}
              notMerge={true}
              lazyUpdate={true}
              onEvents={{
                datazoom: e => {
                  const { stockZoom } = this;
                  stockZoom.start = e.start;
                  stockZoom.end = e.end;
                  const { zoom, stock } = this.state;
                  zoom[stock] = stockZoom;
                  global.localStorage.setItem("zoom", JSON.stringify(zoom));
                }
              }}
            />
          )}
        </div>
      </div>
    );
  }
  renderBottom() {
    return (
      <div className="wrapper">
        BAMBU, 70 SHENTON WAY, #18-15, 079118, SINGAPOREINFO@BAMBU.LIFE
      </div>
    );
  }
}
