import { Cart, User } from "./types";

export const setUserData = (data: User) => ({
  type: "USER_DATA",
  payload: data,
});

export const setCartData = (data: Cart) => ({
  type: "SET_CART",
  payload: data,
});
