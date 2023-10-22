import { ProductList } from "@interfaces/product";
import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const compose =
  (...functions: Array<(value: unknown) => unknown>) =>
  (value: unknown) =>
    functions.reduceRight((val, func) => func(val), value);

export const findProductById =
  (productList: ProductList) => (productId: number) =>
    productList.find((product) => product.id === productId);

export const getIdFromRequest = ({
  pathParameters: { productId },
}: APIGatewayEvent) => productId;

export const handleProductNotFound = (product) => {
  if (!product) throw Error("Product not found");

  return product;
};

export const formatResponse =
  (statusCode: number) =>
  (data: unknown): APIGatewayProxyResult =>
    formatJSONResponse(statusCode, { data });

export const validateProduct = (product) => {
  const requiredField = ["title", "price", "description"];

  requiredField.forEach((field) => {
    if (!product[field]) {
      throw Error("Invalid product fields");
    }
  });

  return product;
};
