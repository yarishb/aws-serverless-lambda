// Import the functions you want to test
import {
  publishCreatedProductMessage,
  catalogBatchProcessHandler,
} from "./handler"; // Replace with the actual module path

// Mock AWS SNS and createProductItem function
jest.mock("aws-sdk");
jest.mock("@functions/utils/manageDB/manageDB");

const mockCreateProductItem =
  require("@functions/utils/manageDB/manageDB").createProductItem;
const mockSNS = require("aws-sdk").SNS;

describe("publishCreatedProductMessage", () => {
  it("should publish a message to SNS", async () => {
    const mockProduct = {
      test: "test",
    };
    const mockPublishPromise = jest.fn(() => Promise.resolve({}));

    mockSNS.prototype.publish = jest.fn(() => ({
      promise: mockPublishPromise,
    }));

    await publishCreatedProductMessage(mockProduct);

    expect(mockSNS.prototype.publish).toHaveBeenCalledWith({
      Subject: "Product has been created",
      Message: JSON.stringify(mockProduct),
      TopicArn: process.env.SNS_TOPIC,
    });
    expect(mockPublishPromise).toHaveBeenCalled();
  });

  it("should handle errors when publishing to SNS", async () => {
    const mockProduct = {
      test: "test",
    };
    const error = new Error("SNS publishing error");

    mockSNS.prototype.publish = jest.fn(() => ({
      promise: jest.fn(() => Promise.reject(error)),
    }));

    console.error = jest.fn(); // Mock console.error to suppress output

    await publishCreatedProductMessage(mockProduct);

    expect(console.error).toHaveBeenCalledWith(
      "SOMETHING WENT WRONG WHEN TRYING TO PUBLIC A MESSAGE",
      error
    );
  });
});

describe("catalogBatchProcessHandler", () => {
  it("should process an event and return a success response", async () => {
    const mockEvent = {
      Records: [
        {
          body: JSON.stringify({
            test: "test",
          }),
        },
      ],
    };

    mockCreateProductItem.mockResolvedValue();
    mockSNS.prototype.publish = jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    }));

    const result = await catalogBatchProcessHandler()(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("product was successfully created!!!");
  });

  it("should handle errors during processing", async () => {
    const mockEvent = {
      Records: [
        {
          body: JSON.stringify({
            test: "test",
          }),
        },
      ],
    };

    const error = new Error("Processing error");

    mockCreateProductItem.mockRejectedValue(error);
    mockSNS.prototype.publish = jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    }));

    console.log = jest.fn(); // Mock console.log to suppress output

    try {
      await catalogBatchProcessHandler()(mockEvent);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
