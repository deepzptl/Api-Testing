export type ContactPayload = {
  first_name: string;
  last_name: string;
  tags?: string[];
};

export type ContactRecord = ContactPayload & {
  id: string;
};

export type CompanyPayload = {
  name: string;
  industry?: string;
  phone?: string;
};

export type CompanyRecord = CompanyPayload & {
  id: string;
};

export type AuthPayload = {
  username: string;
  password: string;
};
