import { OnSuccessResponder } from "@openauthjs/openauth/issuer";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { Oauth2Token } from "@openauthjs/openauth/provider/oauth2";
import { Prettify } from "@openauthjs/openauth/util";
import { decodeJwt } from "jose/jwt/decode";

type OnEmployeeSuccess = OnSuccessResponder<
  Prettify<{
    type: "employee";
    properties: {
      email: string;
      name?: string | undefined;
    };
  }>
>;

type EmployeeInput = {
  provider: "google";
  tokenset: Oauth2Token;
  clientID: string;
};

function success(response: OnEmployeeSuccess, { tokenset }: EmployeeInput) {
  try {
    const { id_token } = tokenset.raw;

    const payload = decodeJwt(id_token);

    return response.subject("employee", {
      email: payload.email as string,
      name: payload.name as string,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to extract Google subject");
  }
}

const provider = GoogleProvider({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_SECRET!,
  scopes: ["email", "profile"],
});

export default {
  provider,
  success,
};
