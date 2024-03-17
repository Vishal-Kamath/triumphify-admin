import { queryClient } from "@/components/providers/reactquery.provider";

export function clearQuery() {
  queryClient.clear();
}
