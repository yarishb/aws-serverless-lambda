interface Product {
  title: string;
  description: string;
  price: number;
  id: number;
}

export type ProductList = Product[];

const productsList: ProductList = [
  {
    title: "Xerjoff Naxos 1861",
    description: "A decent fragrance",
    price: 300,
    id: 1,
  },
  {
    title: "Tom Ford - oud wood",
    description: "Nice and oudy",
    price: 200,
    id: 2,
  },
  {
    title: "Tom Ford - noir de noir",
    description: "Not that versetile, but good",
    price: 300,
    id: 3,
  },
  {
    title: "Acqua di Gio",
    description: "Good everyday one",
    price: 70,
    id: 4,
  },
];

export default productsList;
