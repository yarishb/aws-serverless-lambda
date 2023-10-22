import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        responseData: {
          200: {
            description: "Success",
            bodyType: "Products",
          },
          404: "Product not found",
          500: "Internal Server error",
        },
      },
    },
  ],
};
