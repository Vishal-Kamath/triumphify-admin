interface Lead {
  id: string;
  name: string;
  email: string;
  tel: string;
  assigned: string | null;
  source: string;
  status: "pending" | "converted" | "rejected";
  last_contacted: Date | null;
  created_at: Date;
  updated_at: Date | null;
}
