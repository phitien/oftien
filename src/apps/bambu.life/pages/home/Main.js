import "./main.scss";

import React from "react";
import { Helmet } from "react-helmet";
import ReactEcharts from "echarts-for-react";

import { Button, Icon, Logo, Space, Page } from "../../../../core";

import AddStock from "./AddStock";

import { loadStock, cfunctions } from "./utils";
import { splitData, renderItem } from "./utils";

export default class Main extends Page {
  static isDefault = true;
  static path = "/";
  static layout = "Top_LeftMain_Bottom";
  static className = "route-home-main";

  state = {
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

  async componentDidMount() {
    await super.componentDidMount();
    await this.loadStock();
  }
  chartData() {
    const { cfunction } = this.state;
    const [key, value] = cfunctions.find(([k, v]) => k === cfunction);
    const data = this.props.Stock.detail[value];
    if (!data) return {};
    return {
      categoryData: Object.keys(data),
      values: Object.values(data).map((o, i) => [i, ...Object.values(o)])
    };
    return splitData(data);
  }
  chartOptions(data, title, subtext) {
    return {
      backgroundColor: "#eee",
      animation: false,
      legend: {
        bottom: 10,
        left: "center",
        data: [title]
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        },
        backgroundColor: "rgba(245, 245, 245, 0.8)",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: {
          color: "#000"
        },
        position: function(pos, params, el, elRect, size) {
          var obj = { top: 10 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        extraCssText: "width: 170px"
      },
      axisPointer: {
        link: { xAxisIndex: "all" },
        label: {
          backgroundColor: "#777"
        }
      },
      grid: [
        {
          left: "10%",
          right: "8%",
          bottom: 150
        }
      ],
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
          axisPointer: {
            z: 100
          }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true
          }
        }
      ],
      dataZoom: [
        {
          type: "inside",
          start: 98,
          end: 100,
          minValueSpan: 10
        },
        {
          show: true,
          type: "slider",
          bottom: 60,
          start: 98,
          end: 100,
          minValueSpan: 10
        }
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
  }
  async loadStock() {
    if (!this.isValid) return;
    const { stock, cfunction, apikey } = this.state;
    await loadStock({ stock, apikey, cfunction });
  }
  onStockClick(stock) {
    this.setState({ stock }, e => {
      global.localStorage.setItem("stock", stock);
      this.loadStock();
    });
  }
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
                        ...this.addStockPopup.state.value
                          .split(",")
                          .map(o => o.trim())
                          .filter(o => o)
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
          placeholder="Alphavantage API key"
          value={apikey}
          onChange={e =>
            this.setState({ apikey: e.target.value }, () =>
              global.localStorage.setItem("apikey", this.state.apikey)
            )
          }
        />
        <select
          value={cfunction}
          onChange={e =>
            this.setState({ cfunction: e.target.value }, () => {
              global.localStorage.setItem("cfunction", this.state.cfunction);
              this.loadStock();
            })
          }
        >
          {cfunctions.map(([k, v], i) => (
            <option key={i} value={k}>
              {v}
            </option>
          ))}
        </select>
        <div className="echarts container" ref={e => (this.echarts = e)}>
          {!this.isValid ? null : (
            <ReactEcharts
              option={this.chartOptions(this.chartData(), "Overview")}
              notMerge={true}
              lazyUpdate={true}
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
