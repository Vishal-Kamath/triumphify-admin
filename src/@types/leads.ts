interface Lead {
  id: string;
  name: string;
  email: string;
  tel: string;
  assigned: string | null;
  source: string;
  status: "new" | "pending" | "converted" | "rejected";
  last_contacted: Date | null;
  created_at: Date;
  updated_at: Date | null;
}

interface Action {
  id: string;
  title: string;
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date | null;
}

interface ActionLog {
  id: string;
  title: string;
  subject: string;
  body: string;
  created_at: Date;
  updated_at: Date | null;
  action_id: string;
  receivers: {
    userName: string;
    email: string;
  }[];
}