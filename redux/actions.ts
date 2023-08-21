import { User } from "./types";

export const setUserData = (data: User) => ({
  type: "USER_DATA",
  payload: data,
});

export const setCartData = (data: User) => ({
  type: "SET_CART",
  payload: data,
});
