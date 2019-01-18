import React from "react";
import { Checkbox, Paper } from "@material-ui/core";

import { Button, Icon } from "../../../core";
import Products from "./Products";

export default class Purchase extends Products {
  static path = ["/purchase", "/purchase/:id"];
  static layout = "Top_MainRight";

  state = {
    productID: "",
    editDeliveryAddress: false,
    editBillingAddress: false
  };

  componentWillMount() {
    const id = this.props.match.params.id;
    this.props.ProductOrderLoadCache(id);
  }

  renderRight() {
    const { order, orderResult } = this.props.Product;
    const { modeOfShipment, poReference, specialInstructions } = order;
    const { notifyViaEmail } = order;
    const { totalMaterialPrice, totalAmount, taxAmount } = orderResult.data;
    return [
      <Paper key="container" className="right-container">
        <div className="inputfield">
          <label>Mode of Shipment</label>
          <input
            className="input"
            type="text"
            placeholder="Mode of Shipment"
            value={modeOfShipment}
            onChange={e =>
              this.props.ProductOrderInfoUpdate({
                modeOfShipment: e.target.value
              })
            }
          />
        </div>
        <div className="inputfield">
          <label>PO Reference</label>
          <input
            className="input"
            type="text"
            placeholder="PO Reference"
            value={poReference}
            onChange={e =>
              this.props.ProductOrderInfoUpdate({
                poReference: e.target.value
              })
            }
          />
        </div>
        <div className="inputfield">
          <label>Special Instructions (Optional)</label>
          <textarea
            className="input"
            type="text"
            placeholder="Special Instructions (Optional)"
            value={specialInstructions}
            onChange={e =>
              this.props.ProductOrderInfoUpdate({
                specialInstructions: e.target.value
              })
            }
          />
        </div>
        <div className="inputfield checkboxfield">
          <Checkbox
            className="checkbox"
            checked={notifyViaEmail}
            onChange={(e, checked) =>
              this.props.ProductOrderInfoUpdate({ notifyViaEmail: checked })
            }
          />
          <label
            onClick={e =>
              this.props.ProductOrderInfoUpdate({
                notifyViaEmail: !notifyViaEmail
              })
            }
          >
            Notify via Email when the order status change
          </label>
        </div>
        <div className="payment-info">
          <div className="payment-terms">
            Payment terms: <span>30 days 0%</span>
          </div>
          <div className="payment-subtotal">
            Sub Total
            <span>
              {(parseFloat(totalMaterialPrice) || 0).currency("AUD ", "")}
            </span>
          </div>
          <div className="payment-vat">
            VAT 10%
            <span>{(parseFloat(taxAmount) || 0).currency("AUD ", "")}</span>
          </div>
          <div className="payment-total">
            Total
            <span>{(parseFloat(totalAmount) || 0).currency("AUD ", "")}</span>
          </div>
        </div>
        <Button label="Confirm" fullWidth big color="secondary" />
      </Paper>,
      <div key="save-for-later" className="save-for-later-icon">
        Save for later
      </div>
    ];
  }
  renderOrderItem(product, i) {
    return (
      <Paper key={i} className="quantity">
        <h5>
          {product.description}
          <div>{product.casNumber || "Cas: 9004-32-4 /  HS: 3048304"}</div>
          <div className="documents">
            <div
              className="doc msds"
              onClick={e =>
                product.msdsLink ? global.open(product.msdsLink) : false
              }
            />
            <div
              className="doc tds"
              onClick={e =>
                product.tdsLink ? global.open(product.tdsLink) : false
              }
            />
            <div
              className="doc remove"
              onClick={e => this.props.ProductOrderItemRemove(product)}
            />
          </div>
        </h5>
        <div className="inputfield">
          <label>Order Quantity</label>
          <input
            className="input"
            type="number"
            placeholder="Order Quantity"
            value={product.requestedQuantity}
            onChange={e =>
              this.props.ProductPlaceOrder({
                ...product,
                requestedQuantity: parseFloat(e.target.value)
              })
            }
          />
        </div>
        <div className="price">{(product.price || 0).currency("AUD ", "")}</div>
      </Paper>
    );
  }
  renderMain() {
    const { order } = this.props.Product;
    const { desiredDeliveryDate, orderItems } = order;
    const renderAddress = (field, name) => {
      const value = order[field];
      const { houseNumber, street, city } = value;
      const { postalCode, country, countryCode } = value;
      const open = this.state[`edit${field.ucfirst()}`];
      return (
        <div className="addressfield">
          <label>{name}</label>
          <span>
            {houseNumber} {street}, {city} {postalCode}
          </span>
          <span>{country}</span>
          <Icon icon={`/${global.constants.app}/assets/edit.png`} />
        </div>
      );
    };
    return (
      <div className="main-container">
        <Paper className="info">
          <h1>Purchase Request</h1>
          <div className="inputfield">
            <label>Desired Delivery Date</label>
            <input
              className="input"
              type="date"
              placeholder="Desired delivery date"
              min={new Date().toStandard()}
              value={desiredDeliveryDate.toDate().toStandard()}
              onChange={e =>
                this.props.ProductOrderInfoUpdate({
                  desiredDeliveryDate: new Date(e.target.value).format()
                })
              }
            />
          </div>
          {renderAddress("deliveryAddress", "Delivery Address")}
          {renderAddress("billingAddress", "Billing Address")}
        </Paper>
        {orderItems.map((o, i) => this.renderOrderItem(o, i))}
        <Paper className="add-more">
          <div
            className="add-more-icon"
            onClick={e => this.props.history.push("/products")}
          >
            Add more products
          </div>
        </Paper>
      </div>
    );
  }
}
