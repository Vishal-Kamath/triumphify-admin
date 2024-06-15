import { queryClient } from "@/components/providers/reactquery.provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getBlogs = (
  status?: Blog["status"],
): Promise<Blog[] & { type: string }> =>
  axios
    .get<{ data: Blog[] & { type: string } }>(
      `${process.env.ENDPOINT}/api/blogs${status ? `?status=${status}` : ""}`,
      { withCredentials: true },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useBlogs = (status?: Blog["status"]) =>
  useQuery({
    queryKey: ["blogs", status],
    queryFn: () => getBlogs(status),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

interface GetBlog {
  blog: Blog;
  sections: BlogSection[];
}
const getBlog = (id: string): Promise<GetBlog & { type: string }> =>
  axios
    .get<{ data: GetBlog & { type: string } }>(
      `${process.env.ENDPOINT}/api/blogs/${id}`,
      { withCredentials: true },
    )
    .then((res) => res.data.data)
    .catch((err) => err.response.data);

export const useBlog = (id: string) =>
  useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getBlog(id),
    retry: 0,
    staleTime: 1000 * 60 * 15,
  });

export const invalidateAllBlogs = () =>
  queryClient.invalidateQueries({ queryKey: ["blogs"] });
