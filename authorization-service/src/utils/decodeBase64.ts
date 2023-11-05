interface DecodedUser {
  username: string;
  password: string;
}

export const decodeUserFromTokenBase64 = (
  encodedString: string
): DecodedUser => {
  const buff = Buffer.from(encodedString, "base64");
  const plainCreds = buff.toString("utf-8").split(":");

  return {
    username: plainCreds[0],
    password: plainCreds[1],
  };
};
