export type InitialState = {
  userData: User | {};
  cart: Cart;
};

export type User = {
  name: String;
  email: String;
  id: String;
};

export type Product = {
  name: String;
  price: Number;
  quantity: Number;
};

export type Action = {
  type: String;
  payload: any;
};

export type CartProduct = {
  productId: String;
  quantity: Number;
  name: String;
  price: Number;
};

export type Cart = {
  products: CartProduct[];
  id: String;
};
