import { middyfy } from "@libs/lambda";

import {
  compose,
  formatResponse,
  getIdFromRequest,
  handleProductNotFound,
} from "@functions/utils/utils";
import { getProductWithStockById } from "@functions/utils/manageDB/manageDB";
import { APIGatewayEvent } from "aws-lambda";
import { StatusCodes } from "@interfaces/product";

export const getProductById = async (event: APIGatewayEvent) => {
  try {
    const product = await getProductWithStockById(getIdFromRequest(event));
    return compose(
      formatResponse(StatusCodes.SUCCESS),
      handleProductNotFound
    )(product);
  } catch (e) {
    return formatResponse(StatusCodes.NOT_FOUND)({ errorMessage: e.message });
  }
};

export const main = middyfy(getProductById);
