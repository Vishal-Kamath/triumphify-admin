interface Ticket {
  id: string;
  assigned: string | null;
  link: string | null;

  user_id: string;
  user_username: string;
  user_image: string;

  title: string;
  description: string;
  status: "pending" | "completed" | "failed";
  type: "order" | "support" | "request" | "misc";
  created_at: Date;
  updated_at: Date | null;
}

interface TicketChat {
  id: string;
  content: string;
  type: "user" | "employee";
  created_at: Date;
  user_or_employee_id: string;
  user: string | null;
  employee: string | null;
  seen: boolean | null;
}