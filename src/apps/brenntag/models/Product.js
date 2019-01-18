const { app } = global.constants;

export const defaultState = {
  filter: { size: 10, page: 0 },
  pageInfo: {},
  product: {},
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
  orderInfo: {
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
  ["List", "Filter"],
  ["Order", "OrderLoadCache", "OrderInfoUpdate", "OrderResult"]
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
    return { ...state, product: JSON.parse(localStorage.getItem(payload)) };
  }
  if (type === "ProductOrderInfoUpdate") {
    return { ...state, orderInfo: { ...state.orderInfo, ...payload } };
  }
  if (type === "ProductOrder") {
    localStorage.setItem(payload.productID, JSON.stringify(payload));
    return { ...state, product: payload };
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
