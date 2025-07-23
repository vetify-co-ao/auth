import { OnSuccessResponder } from "@openauthjs/openauth/issuer";
import {
  CodeProvider,
  CodeProviderError,
} from "@openauthjs/openauth/provider/code";
import { CodeUI } from "@openauthjs/openauth/ui/code";
import { Prettify } from "@openauthjs/openauth/util";
import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate";

const VENDUS_URL = "https://www.vendus.co.ao/ws/clients/";

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

/**
 * Sends an email to the specified recipient with the given message.
 * Utilizes environment variables for SMTP configuration.
 *
 * @param to - The recipient's email address
 * @param message - The content of the email
 * @returns Promise that resolves when the email is sent
 */
async function sendEmail(to: string, code: string): Promise<void> {
  console.log(`Sending email to ${to} with code ${code}`);

  // Check for required environment variables
  const smtpUsername = process.env.SMTP_USERNAME;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const fromEmail = process.env.FROM_EMAIL || "no-reply@vetify.co.ao";

  if (!smtpUsername || !smtpPassword) {
    console.error(
      "SMTP_USERNAME and SMTP_PASSWORD environment variables must be set",
    );
    throw new Error("Email configuration missing");
  }

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: smtpHost,
    port: smtpPort,
    secure: true,

    auth: {
      user: smtpUsername,
      pass: smtpPassword,
    },
  });

  const message = emailTemplate(to, code);

  // Email options
  const mailOptions = {
    from: `"Vetify" <${fromEmail}>`,
    replyTo: `"Vetify" <${fromEmail}>`,
    to: to,
    subject: "O seu código de verificação do Portal Vetify",
    html: `<p>${message}</p>`,
  };

  console.log("Your code:", message);

  // // Send email
  // try {
  //   await transporter.sendMail(mailOptions);
  //   console.log(`Email sent successfully to ${to}`);
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   throw new Error(`Failed to send email: ${error.message}`);
  // }
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
  const apiKey = process.env.VENDUS_API_KEY;
  const url = `${VENDUS_URL}?api_key=${apiKey}&q=${email}`;

  const res = await fetch(url).then((r) => r.json());
  if (res.errors) {
    console.error("Error fetching client:", res.errors);
    return undefined;
  }

  if (res.length > 1) {
    console.error("Multiple clients found");
    return undefined;
  }

  return res[0];
}

async function success(response: OnCustomerSuccess, { claims }: CustomerInput) {
  try {
    const client = await fetchClient(claims.email);
    return response.subject("customer", {
      email: client!.email,
      name: client!.name,
      fiscalID: client!.fiscal_id,
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
