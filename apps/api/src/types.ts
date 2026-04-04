export type AppVariables = {
  user: {
    id: string;
    phoneNumber?: string | null;
    [key: string]: unknown;
  };
  session: {
    token: string;
    [key: string]: unknown;
  };
};
