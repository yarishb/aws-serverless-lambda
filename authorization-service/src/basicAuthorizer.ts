import { generatePolicy } from "./utils/generatePolicy";
import { decodeUserFromTokenBase64 } from "./utils/decodeBase64";

enum AuthorizationStatus {
  ALLOW = "Allow",
  DENY = "Deny",
}

export const basicAuthorizer = (event, _, callback) => {
  if (event["type"] !== "REQUEST") {
    // callback("Unathorized");
  }

  try {
    const token = event.headers["Authorization"];
    const user = decodeUserFromTokenBase64(token);

    const storedUserPassword = process.env[user.username];
    // const authorizationStatus =
    //   !user.password || user.password !== storedUserPassword
    //     ? AuthorizationStatus.DENY
    //     : AuthorizationStatus.ALLOW;

    const policy = generatePolicy(
      token,
      event.methodArn,
      AuthorizationStatus.ALLOW
    );
    console.log(`Policy: ${JSON.stringify(policy)}`);

    return callback(null, policy);
  } catch (error) {
    console.log(error);

    // return callback(`Unauthorized: ${error.message}`);
  }
};
