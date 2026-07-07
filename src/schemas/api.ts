import { z } from 'zod';

export const ContactPayloadSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  tags: z.array(z.string()).optional()
});

export const ContactRecordSchema = ContactPayloadSchema.extend({
  id: z.string()
});

export const ContactResponseSchema = z.object({
  response: z.object({
    result: ContactRecordSchema
  })
});

export const ContactsListResponseSchema = z.object({
  response: z.object({
    result: z.array(ContactRecordSchema)
  })
});

export const CompanyPayloadSchema = z.object({
  name: z.string(),
  industry: z.string().optional(),
  phone: z.string().optional()
});

export const CompanyRecordSchema = CompanyPayloadSchema.extend({
  id: z.string()
});

export const CompanyResponseSchema = z.object({
  response: z.object({
    result: CompanyRecordSchema
  })
});

export const CompaniesListResponseSchema = z.object({
  response: z.object({
    result: z.array(CompanyRecordSchema)
  })
});

export const AuthPayloadSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const AuthResponseSchema = z.object({
  token: z.string().nullable()
});

export const ErrorResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional()
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
export type ContactRecord = z.infer<typeof ContactRecordSchema>;
export type CompanyPayload = z.infer<typeof CompanyPayloadSchema>;
export type CompanyRecord = z.infer<typeof CompanyRecordSchema>;
export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
