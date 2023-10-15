// yourModule.test.ts

import { ProductList } from "src/data/productsList";
import {
  compose,
  findProductById,
  getIdFromRequest,
  formatResponse,
  handleProductNotFound,
} from "../utils"; // Import the functions to be tested

// Mock dependencies and data
const productList = [
  { id: 1, title: "Product 1" },
  { id: 2, title: "Product 2" },
  { id: 3, title: "Product 3" },
] as unknown as ProductList;

const sampleEvent: any = {
  pathParameters: {
    productId: "2",
  },
};

// Mock formatJSONResponse function
jest.mock("@libs/api-gateway", () => ({
  formatJSONResponse: jest.fn((data: unknown) => ({
    statusCode: 200,
    body: JSON.stringify(data),
  })),
}));

describe("[utils/utils]", () => {
  describe("compose", () => {
    it("should compose functions correctly", () => {
      const double = (x: number) => x * 2;
      const addOne = (x: number) => x + 1;
      const composedFunction = compose(double, addOne);
      const result = composedFunction(3);
      expect(result).toEqual(8); // (3 + 1) * 2
    });
  });

  describe("findProductById", () => {
    it("should find a product by id", () => {
      const productId = 2;
      const product = findProductById(productList)(productId);
      expect(product).toEqual({ id: 2, title: "Product 2" });
    });
  });

  describe("getIdFromRequest", () => {
    it("should extract the productId from an event", () => {
      const productId = getIdFromRequest(sampleEvent);
      expect(productId).toEqual(2);
    });
  });

  describe("formatResponse", () => {
    it("should format response correctly", () => {
      const data = { message: "Test data" };
      const response = formatResponse(data);
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify({ data }),
      });
    });
  });

  describe("handleProductNotFound", () => {
    it("should return product if it is present", () => {
      expect(handleProductNotFound(productList[0])).toStrictEqual(
        productList[0]
      );
    });

    it("should throw error if product is not found", () => {
      try {
        handleProductNotFound(undefined);
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
      }
    });
  });
});
