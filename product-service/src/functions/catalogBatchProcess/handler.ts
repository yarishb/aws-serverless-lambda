export const catalogBatchProcess = (event) => {
  try {
    console.log(event);
  } catch (error) {
    console.log(error, "thats the error loool");
  }
};

export const main = catalogBatchProcess;
