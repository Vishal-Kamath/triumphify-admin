interface Message {
  id: string;
  room_id: string;
  created_at: Date;
  msg: string;
  sender: "customer" | "operator";
  sender_id: string;
}

interface Conversation {
  room: string;
  user_id: string | null;
  status: "new" | "ongoing" | "closed";
  created_at: Date;
  updated_at: Date | null;
}
