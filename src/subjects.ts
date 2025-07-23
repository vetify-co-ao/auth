import { object, string, optional } from "valibot";
import { createSubjects } from "@openauthjs/openauth/subject";

const subjects = createSubjects({
  employee: object({
    email: string(),
    name: optional(string()),
  }),
  customer: object({
    email: string(),
    name: optional(string()),
    fiscalID: string(),
  }),
});

export { subjects };
