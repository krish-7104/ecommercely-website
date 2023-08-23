import { Action, InitialState } from "./types";

let initialState: InitialState = {
  userData: {},
  cart: { products: [], id: "" },
};

export const reducers = (state = initialState, action: Action) => {
  switch (action.type) {
    case "USER_DATA":
      return { ...state, userData: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload };

    default:
      return state;
  }
};
