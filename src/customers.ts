import { OnSuccessResponder } from "@openauthjs/openauth/issuer";
import { CodeProvider } from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { Prettify } from "@openauthjs/openauth/util";
import { emailTemplate } from "./emailTemplate";
import { gmail_v1, google } from "googleapis";

const VENDUS_URL = "https://www.vendus.co.ao/ws/v1.1/clients/";
const KEY_FILE_PATH = process.env.GOOGLE_CREDENTIALS_FILE;
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const IMPERSONATED_EMAIL = process.env.IMPERSONATED_EMAIL;
const NO_REPLY_EMAIL = process.env.NO_REPLY_EMAIL;

const DEBUG_MODE = process.env.DEBUG_MODE === "true";

type OnCustomerSuccess = OnSuccessResponder<
  Prettify<{
    type: "customer";
    properties: {
      email: string;
      name?: string | undefined;
      fiscalID: string;
    };
  }>
>;

type CustomerClaims = Record<string, string> | { email: string };

type CustomerInput = {
  provider: "code";
  claims: CustomerClaims;
};

async function authorize(): Promise<gmail_v1.Gmail> {
  const serviceAccountKey = await import(KEY_FILE_PATH!, {
    with: { type: "json" },
  });

  const jwtClient = new google.auth.JWT({
    email: serviceAccountKey.client_email,
    key: serviceAccountKey.private_key,
    scopes: SCOPES,
    subject: IMPERSONATED_EMAIL,
  });

  await jwtClient.authorize();

  const gmail = google.gmail({ version: "v1", auth: jwtClient });
  console.log("Gmail API service initialized successfully.");
  return gmail;
}

async function sendEmail(to: string, code: string): Promise<void> {
  if (DEBUG_MODE) console.log(`Sending email to ${to} with code ${code}`);

  const gmail = await authorize();

  const from = NO_REPLY_EMAIL;
  const message = emailTemplate(to, code);
  const subject = "O seu codigo de verificacao no Portal Vetify";

  // The email needs to be base64url encoded
  const emailLines = [
    `Content-Type: text/html; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    `Content-Transfer-Encoding: 7bit`,
    `to: ${to}`,
    `from: "Vetify" <${from}>`,
    `replyTo: "Vetify" <${from}>`,
    `subject: ${subject}`,
    "",
    message,
  ];

  const email = emailLines.join("\r\n");

  if (DEBUG_MODE) {
    console.log("Email content:");
    console.log(email);
  }

  const encodedMessage = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  try {
    const res = await gmail.users.messages.send({
      userId: "me", // 'me' refers to the impersonated user (USER_EMAIL)
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log("Email sent successfully! Message ID:", res.data.id);
  } catch (error) {
    console.error("The API returned an error: " + error);
    throw error;
  }
}

async function sendCode(claims: CustomerClaims, code: string): Promise<void> {
  const client = await fetchClient(claims.email);

  if (!client) {
    return {
      type: "invalid_claim",
      key: "email",
      value: claims.email,
    } as unknown as undefined; // I know, this is not ideal but it's a workaround for now
  }

  return sendEmail(client.email, code);
}

async function fetchClient(email: string): Promise<{
  email: string;
  name?: string | undefined;
  fiscal_id: string;
} | void> {
  if (typeof email !== "string" || !email.trim()) return undefined;
  const requestedEmail = email.trim();
  const apiKey = process.env.VENDUS_API_KEY;
  const url = new URL(VENDUS_URL);
  url.search = new URLSearchParams({
    email: requestedEmail,
    status: "active",
    per_page: "2",
  }).toString();

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` },
  });
  if (!response.ok) {
    console.error("Error fetching client:", response.status);
    return undefined;
  }

  const clients = await response.json();
  if (!Array.isArray(clients)) return undefined;
  if (clients.length > 1 || Number(response.headers.get("x-paginator-items")) > 1) {
    console.error("Multiple active clients found");
    return undefined;
  }

  const client = clients[0];
  if (
    client?.status !== "active" ||
    typeof client.email !== "string" ||
    client.email.toLowerCase() !== requestedEmail.toLowerCase()
  ) return undefined;

  return client;
}

async function success(response: OnCustomerSuccess, { claims }: CustomerInput) {
  try {
    const client = await fetchClient(claims.email);
    if (!client) throw new Error("No unique active client found");
    return response.subject("customer", {
      email: client.email,
      name: client.name,
      fiscalID: client.fiscal_id,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to extract Code subject");
  }
}

const provider = CodeProvider(
  CodeUI({
    sendCode,
    copy: {
      code_info:
        "Caso o email seja válido, você receberá um código de verificação.",
      code_invalid: "Código inválido",
      code_resend: "Reenviar código",
      code_sent: "Código enviado para: ",
      code_resent: "Código reenviado para: ",
      email_invalid: "Email inválido",
    },
  }),
);

export default {
  provider,
  success,
};
