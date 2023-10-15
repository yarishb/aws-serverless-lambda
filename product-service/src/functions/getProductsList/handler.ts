import { middyfy } from "@libs/lambda";

import { formatResponse } from "@functions/utils/utils";
import productsList from "src/data/productsList";

export const getProductsList = async () => formatResponse(productsList);

export const main = middyfy(getProductsList);
