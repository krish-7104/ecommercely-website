import { Cart, Order, User } from "@/redux/types";

export const setUserData = (data: User) => ({
  type: "USER_DATA",
  payload: data,
});

export const setCartData = (data: Cart) => ({
  type: "SET_CART",
  payload: data,
});

export const setOrderData = (data: Order) => ({
  type: "SET_ORDER",
  payload: data,
});
