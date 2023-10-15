import { middyfy } from "@libs/lambda";

import { formatResponse } from "@functions/utils/utils";
import { getAllProductsWithStocks } from "@functions/utils/manageDB/manageDB";

export const getProductsList = async () =>
  formatResponse(await getAllProductsWithStocks());

export const main = middyfy(getProductsList);
