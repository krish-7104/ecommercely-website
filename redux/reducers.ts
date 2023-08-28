import { Action, InitialState } from "./types";

let initialState: InitialState = {
  userData: { name: "", email: "", id: "" },
  cart: { products: [], id: "" },
  order: {
    total: 0,
    userId: "",
    products: [],
  },
};

export const reducers = (state = initialState, action: Action) => {
  switch (action.type) {
    case "USER_DATA":
      return { ...state, userData: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_ORDER":
      return { ...state, order: action.payload };

    default:
      return state;
  }
};
