export type InitialState = {
  userData: User;
  cart: Cart;
  order: Order;
};

export type User = {
  name: string;
  email: string;
  id: string;
};

export type Product = {
  name: string;
  price: number;
  quantity: number;
};

export type Action = {
  type: string;
  payload: any;
};

export type CartProduct = {
  productId: string;
  quantity: number;
  name: string;
  price: number;
  category: string;
};

export type Cart = {
  products: CartProduct[];
  id: string;
};

export type Order = {
  total: number;
  products: OrderProduct[];
  userId: string;
};

export type OrderProduct = {
  name: string;
  price: number;
  productId: string;
  quantity: number;
  category: string;
};
