import { ProductList } from "@interfaces/product";
import { formatResponse } from "../../utils/utils";

import { getProductsList } from "../handler";

jest.mock("../../utils/utils", () => ({
  formatResponse: jest.fn(),
}));

jest.mock("@libs/lambda");

describe("[handler/getProductsList]", () => {
  const mockProductList: ProductList = [
    {
      title: "test",
      description: "test",
      price: 123,
      id: 1,
    },
  ];

  const mockResponse = {
    statusCode: 200,
    body: JSON.stringify(mockProductList),
  };

  beforeEach(() => {
    jest.mock("@functions/data/productsList", () => mockProductList);

    jest.mocked(formatResponse).mockReturnValue(() => mockResponse);
  });

  it("should return list of products", async () => {
    expect(await getProductsList()).toStrictEqual(mockResponse);
  });
});
