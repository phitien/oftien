const { app } = global.constants;

export const defaultState = {
  filter: { size: 10, page: 0 },
  pageInfo: {},
  products: [],
  orderResult: {
    data: {
      totalMaterialPrice: 1480.28, // Total material price (hard-coded)
      totalAmount: 8020.3, // Total order amount (hard-coded)
      taxAmount: 1523.85 // Tax amount (hard-coded)
    },
    error: null,
    meta: null
  },
  order: {
    modeOfShipment: "Sea",
    poReference: "9494842",
    specialInstructions: "",
    notifyViaEmail: false,
    deliveryAddress: {
      // delivery address
      houseNumber: "43", // House number
      street: "Am Ockenheimer Graben", // Street name
      city: "Bingen am Rhein", // City
      postalCode: "55411", // Post code
      country: "Germany", // Country
      countryCode: "DE" // Country code
    },
    billingAddress: {
      // billing address
      houseNumber: "43",
      street: "Am Ockenheimer Graben",
      city: "Bingen am Rhein",
      postalCode: "55411",
      country: "Germany",
      countryCode: "DE"
    },
    desiredDeliveryDate: new Date(
      new Date().getTime() + 7 * 1000 * 60 * 60 * 24
    ).format(),
    poReference: "9494842", // PO reference number
    orderItems: []
  }
};
export const actions = [].merge(
  ["List", "Filter", "OrderItemRemove"],
  ["PlaceOrder", "OrderLoadCache", "OrderInfoUpdate", "OrderResult"]
);
export const apis = {
  list: {
    method: "get",
    url: `https://api.101digital.io:8243/imp-service/v0.0.1/products`,
    success: "ProductList",
    failure: "NotificationNotify"
  },
  order: {
    method: "post",
    url: `https://api.101digital.io:8243/imp-service/v0.0.1/orders`,
    success: "ProductOrderResult",
    failure: "NotificationNotify"
  }
};
export function reducer(state = defaultState, action) {
  const { type, payload } = action;
  if (type === "ProductOrderLoadCache") {
    return {
      ...state,
      order: { ...state.order, ...JSON.parse(localStorage.getItem("order")) }
    };
  }
  if (type === "ProductOrderInfoUpdate") {
    return { ...state, order: { ...state.order, ...payload } };
  }
  if (type === "ProductOrderItemRemove") {
    const found = state.order.orderItems.find(
      o => o.productID === payload.productID
    );
    if (found)
      state.order.orderItems.splice(state.order.orderItems.indexOf(found), 1);
    localStorage.setItem("order", JSON.stringify(state.order));
    return { ...state };
  }
  if (type === "ProductPlaceOrder") {
    const found = state.order.orderItems.find(
      o => o.productID === payload.productID
    );
    if (!found)
      state.order.orderItems.push({ ...payload, requestedQuantity: 1 });
    else Object.assign(found, payload);
    localStorage.setItem("order", JSON.stringify(state.order));
    return { ...state };
  }
  if (type === "ProductOrderResult")
    return { ...state, orderResult: payload.data };
  if (type === "ProductFilter")
    return { ...state, filter: { ...state.filter, ...payload } };
  if (type === "ProductList")
    return {
      ...state,
      products: [].merge(payload.data),
      pageInfo: { ...state.pageInfo, ...payload.meta }
    };

  return { ...state };
}
