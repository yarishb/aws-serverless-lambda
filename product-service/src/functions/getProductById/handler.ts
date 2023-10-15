import { middyfy } from "@libs/lambda";

import productsList from "@functions/data/productsList";
import {
  compose,
  findProductById,
  formatResponse,
  getIdFromRequest,
  handleProductNotFound,
} from "@functions/utils/utils";
import { APIGatewayEvent } from "aws-lambda";

export const getProductById = async (event: APIGatewayEvent) => {
  try {
    return compose(
      formatResponse,
      handleProductNotFound,
      findProductById(productsList)
    )(getIdFromRequest(event));
  } catch (e) {
    return {
      statusCode: 404,
      message: e.message,
    };
  }
};

export const main = middyfy(getProductById);
