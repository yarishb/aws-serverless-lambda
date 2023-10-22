import { createProductItem } from "@functions/utils/manageDB/manageDB";
import {
  compose,
  formatResponse,
  validateProduct,
} from "@functions/utils/utils";
import { StatusCodes } from "@interfaces/product";
import { middyfy } from "@libs/lambda";

export const createProduct = (event) => {
  try {
    return compose(
      formatResponse(StatusCodes.SUCCESS),
      createProductItem,
      validateProduct
    )(event.body);
  } catch (error) {
    return formatResponse(StatusCodes.BAD_REQUEST)(error.message);
  }
};

export const main = middyfy(createProduct);
