import { getProductById } from "../handler";
import { APIGatewayEvent } from "aws-lambda";
import {
  findProductById,
  formatResponse,
  getIdFromRequest,
} from "@functions/utils/utils";
import { ProductList } from "src/interfaces/product";

jest.mock("@functions/utils/utils", () => ({
  ...jest.requireActual("@functions/utils/utils"),
  findProductById: jest.fn(),
  formatResponse: jest.fn(),
  getIdFromRequest: jest.fn(),
}));

jest.mock("@libs/lambda");

jest.mock("@functions/data/productsList", () => [
  {
    title: "test",
    description: "test",
    price: 123,
    id: 1,
  },
]);

describe("getProductById", () => {
  const idFromRequestResult = 1;

  const event = {
    pathParameters: {
      productId: "1",
    },
  } as unknown as APIGatewayEvent;

  const mockProductList: ProductList = [
    {
      title: "test",
      description: "test",
      price: 123,
      id: 1,
    },
  ];

  const mockFindProductById = jest.fn().mockReturnValue(mockProductList[0]);

  beforeEach(() => {
    jest.mocked(getIdFromRequest).mockReturnValue(idFromRequestResult);

    jest.mocked(findProductById).mockReturnValue(mockFindProductById);
  });

  it("should call getIdFromRequest with the event", async () => {
    await getProductById(event);

    expect(getIdFromRequest).toHaveBeenCalledWith(event);
  });

  it("should call findProductById with the result of getIdFromRequest", async () => {
    await getProductById(event);

    expect(mockFindProductById).toHaveBeenCalledWith(idFromRequestResult);
  });

  it("should call formatResponse with the result of findProductById", async () => {
    await getProductById(event);

    expect(formatResponse).toHaveBeenCalledWith(mockProductList[0]);
  });
});
