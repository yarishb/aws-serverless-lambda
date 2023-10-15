export interface Product {
  title: string;
  description: string;
  price: number;
  id: number;
}

export type ProductList = Product[];

export enum StatusCodes {
  SUCCESS = 200,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
}
