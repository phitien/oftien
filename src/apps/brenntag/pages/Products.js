import React from "react";
import { Paper } from "@material-ui/core";

import { Button, Icon, Logo, Page, Space } from "../../../core";

export default class Products extends Page {
  static path = "/products";
  static layout = "Top_Main";

  async componentDidMount() {
    const { filter } = this.props.Product;
    await global.api(global.apis.Product.list, filter);
  }

  onPlaceOrder = async o => {
    await this.props.ProductPlaceOrder(o);
    await this.props.history.push(`/purchase/${o.productID}`);
  };

  renderSearchBar() {
    return (
      <Paper key="searchbar" className="searchbar">
        <input type="text" placeholder="Search" className="input" />
      </Paper>
    );
  }
  renderMenuItem(o) {
    const { pathname } = this.props.location;
    const isActive = pathname.indexOf(o.path) === 0;
    const props = {
      className: ["menu-item", isActive ? "active" : ""].join(" "),
      key: o.name,
      to: o.path,
      style: {
        backgroundImage: `url(/${global.constants.app}/assets/${o.icon})`
      },
      onClick: e => (o.path ? this.props.history.push(o.path) : false)
    };
    return <div {...props} />;
  }
  renderTop() {
    const item = name => ({
      name,
      path: `/${name}`,
      icon: `/menu/${name}.png`
    });
    return [
      <Logo key="logo" onClick={e => this.props.history.push("/")} />,
      this.renderMenuItem(item("apps")),
      this.renderMenuItem(item("products")),
      this.renderMenuItem(item("purchase")),
      this.renderMenuItem(item("delivery")),
      this.renderMenuItem(item("bill")),
      this.renderMenuItem(item("notification")),
      this.renderMenuItem(item("settings")),
      <Space key="space" />,
      this.renderSearchBar(),
      this.renderMenuItem({ name: "expand", icon: `/expand.png` })
    ];
  }
  renderMain() {
    const { products } = this.props.Product;
    const renderButton = item => (
      <Button
        icon={`/${global.constants.app}/assets/${item.icon}`}
        text={item.text}
      />
    );
    return (
      <div className="main-container">
        <h1>Products</h1>
        <div className="searchbar-products">
          <Paper className="searchbar group">
            <input
              type="text"
              placeholder="Search products, venders..."
              className="input"
            />
          </Paper>
          <Paper className="group">
            {renderButton({ icon: "all-products.png", text: "All Products" })}
            {renderButton({ icon: "my-products.png", text: "My Products" })}
          </Paper>
          <Paper className="group">
            {renderButton({
              icon: "industrial-chemicals.png",
              text: "Industrial Chemicals"
            })}
            {renderButton({
              icon: "specialty-chemicals.png",
              text: "Specialty Chemicals"
            })}
          </Paper>
          <Paper className="group">
            {renderButton({ icon: "reg-hub.png", text: "Reg Hub" })}
            {renderButton({ icon: "slow-movers.png", text: "Slow Movers" })}
          </Paper>
        </div>
        <Paper className="row row-header">
          <div className="cell col-material">Material</div>
          <div className="cell col-packaging">Packaging</div>
          <div className="cell col-weight">Weight</div>
          <div className="cell col-documents">Documents</div>
          <div className="cell col-location">Location</div>
          <div className="cell col-availability">Stock Availability</div>
          <div className="cell col-price">Price</div>
          <div className="cell col-information">Information</div>
          <div className="cell col-raise">Raise</div>
        </Paper>
        {products.map((o, i) => (
          <Paper key={i} className="row">
            <div className="cell col-material">
              <span>{o.description}</span>
              <div>{o.casNumber || "Cas: 9004-32-4 /  HS: 3048304"}</div>
            </div>
            <div className="cell col-packaging">{o.packaging || "Drum"}</div>
            <div className="cell col-weight">{o.weight || "25 kg"}</div>
            <div className="cell col-documents">
              {!o.msdsLink ? null : (
                <div
                  className="doc msds"
                  onClick={e => (o.msdsLink ? global.open(o.msdsLink) : false)}
                />
              )}
              {!o.tdsLink ? null : (
                <div
                  className="doc tds"
                  onClick={e => (o.tdsLink ? global.open(o.tdsLink) : false)}
                />
              )}
            </div>
            <div className="cell col-location">Hub</div>
            <div className="cell col-availability">
              Batch {o.supplier || "30000567"} : <span>98989 KG</span>
            </div>
            <div className="cell col-price">
              <span>{o.price.currency("AUD ", "/kg")}</span>
            </div>
            <div className="cell col-information">
              <div className="container">
                <Icon icon={`/${global.constants.app}/assets/info.png`} />
                <span>Reg Hub</span>
              </div>
            </div>
            <div className="cell col-raise">
              <div className="container" onClick={e => this.onPlaceOrder(o)}>
                <Icon icon={`/${global.constants.app}/assets/plus.png`} />
                <span>Purch Req</span>
              </div>
            </div>
          </Paper>
        ))}
      </div>
    );
  }
}
