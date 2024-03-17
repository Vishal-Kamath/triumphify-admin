export type User = {
  id: string;
  email: string;
  emailVerified: boolean | null;
  tel: string | null;
  username: string | null;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | null;
  googleId: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date | null;
};
