import { issuer } from "@openauthjs/openauth";
import { MemoryStorage } from "@openauthjs/openauth/storage/memory";

import { subjects } from "./subjects";
import employees from "./employees";
import customers from "./customers";
import { Select } from "@openauthjs/openauth/ui/select";
import theme from "./theme";

const app = issuer({
  theme,
  storage: MemoryStorage({ persist: "/tmp/persist.json" }),
  providers: {
    code: customers.provider,
    google: employees.provider,
  },

  select: Select({
    providers: {
      code: {
        display: "Revendedores",
      },
      google: {
        display: "Funcionários",
      },
    },
  }),

  allow: async (input) => input.clientID.startsWith("vetify-"),

  success: async (response, input, req) => {
    if (input.provider === "google") {
      return employees.success(response, input);
    }

    if (input.provider === "code") {
      return customers.success(response, input);
    }

    throw new Error("Unsupported provider");
  },

  subjects,
  ttl: {
    access: 60 * 60 * 24 * 30,
    refresh: 60 * 60 * 24 * 365,
  },
});

export default app;
