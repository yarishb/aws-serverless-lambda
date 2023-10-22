import { middyfy } from "@libs/lambda";

import { formatResponse } from "@functions/utils/utils";
import { getAllProductsWithStocks } from "@functions/utils/manageDB/manageDB";
import { StatusCodes } from "@interfaces/product";

export const getProductsList = async () => {
  const products = await getAllProductsWithStocks();

  return formatResponse(StatusCodes.SUCCESS)(products);
};

export const main = middyfy(getProductsList);
