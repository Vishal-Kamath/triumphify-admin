"use client";

import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import BlogImage from "../components/image";
import { v4 as uuid } from "uuid";
import BlogTitle from "../components/title";
import BlogHeading1 from "../components/heading1";
import BlogHeading2 from "../components/heading2";
import BlogText from "../components/text";
import { Separator } from "@/components/ui/separator";
import { Heading1, Heading2, Image, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading } from "react-icons/ai";
import slugify from "slugify";
import { invalidateAllBlogs, useBlog } from "@/lib/blogs";

const BlogEditingSection: FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const blogId = useRef<string>("");
  const [blog, setBlog] = useState<BlogSection[]>([]);

  const id = useParams()["id"] as string;
  const { data: blogFetch, isLoading } = useBlog(id);

  useEffect(() => {
    if (!isLoading && !!blogFetch) {
      setBlog(blogFetch.sections.sort((a, b) => a.order - b.order));
      blogId.current = blogFetch.blog.id;
    }
  }, [blogFetch, isLoading]);

  useEffect(() => {
    const unloadCallback = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", unloadCallback, { capture: true });
    return () => {
      window.removeEventListener("beforeunload", unloadCallback, {
        capture: true,
      });
    };
  }, []);

  // image
  const uploadImage =
    (id: string) => async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;

        setBlog((prev) =>
          prev.map((element) =>
            element.id === id && element.type === "image"
              ? {
                  ...element,
                  content: {
                    src: src,
                    lastModified: file.lastModified,
                    size: file.size,
                    type: file.type,
                    nonCloseable: element.content.nonCloseable,
                  },
                }
              : element,
          ),
        );
      };
      reader.readAsDataURL(file);
    };

  const deleteImage = (id: string) => () => {
    setBlog((prev) =>
      prev.filter(
        (element) =>
          element.id !== id ||
          (element.type === "image" && element.content.nonCloseable),
      ),
    );
  };

  // title
  const titleOnChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setBlog((prev) =>
      prev.map((element) =>
        element.id === id && element.type === "title"
          ? { ...element, content: { value: e.target.value } }
          : element,
      ),
    );
  };

  // text
  const textOnChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setBlog((prev) =>
      prev.map((element) =>
        element.id === id &&
        (element.type === "text" ||
          element.type === "h1" ||
          element.type === "h2")
          ? { ...element, content: { value: e.target.value } }
          : element,
      ),
    );
  };

  const addBlogSection = (type: "image" | "h1" | "h2" | "text") => {
    const newSection: BlogSection =
      type === "image"
        ? {
            blogId: blogId.current,
            id: uuid(),
            type: "image",
            order: blog.length,
            content: {
              src: "",
            },
          }
        : {
            blogId: blogId.current,
            id: uuid(),
            type,
            order: blog.length,
            content: {
              value: "",
            },
          };
    setBlog((prev) => [...prev, newSection]);
  };

  const changeTextType = (id: string) => (type: "h1" | "h2" | "text") => {
    setBlog((prev) =>
      prev.map((element) =>
        element.id === id && element.type !== "image"
          ? { ...element, type }
          : element,
      ),
    );
  };

  const deleteSection = (id: string) => () => {
    setBlog((prev) => prev.filter((element) => element.id !== id));
  };

  function submitBlogDraft() {
    const CDN_ENDPOINT = process.env.CDN_ENDPOINT;
    if (!CDN_ENDPOINT) return;

    setLoading(true);

    const allimages = blog.filter(
      (entity) => entity.type === "image",
    ) as BlogImage[];

    const allimagesFormated = allimages.map((entity) =>
      entity.content.src.startsWith(CDN_ENDPOINT)
        ? entity.content.src
        : {
            name: slugify((blog[1] as BlogTitle).content.value),
            size: entity.content.size,
            type: entity.content.type,
            lastModified: entity.content.lastModified,
            base64: entity.content.src,
          },
    );

    const removedImages = (
      blogFetch?.sections.filter(
        (entity) => entity.type === "image",
      ) as BlogImage[]
    )
      .filter((entity) => {
        const existInNewImages = allimages.find(
          (image) => image.content.src === entity.content.src,
        );
        return !existInNewImages;
      })
      .map((entity) =>
        entity.content.src.replace(`${CDN_ENDPOINT}/images`, ""),
      );

    axios
      .post<{ imageLinks: string[] }>(
        `${process.env.CDN_ENDPOINT}/api/images/multiple/conditional`,
        {
          files: allimagesFormated,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(async (response) => {
        const imageLinks = response.data.imageLinks;

        const body = {
          title: (blog[1] as BlogTitle).content.value,
          image: imageLinks[0],
          blog: blog.map((entity) => {
            if (entity.type === "image") {
              return {
                ...entity,
                content: {
                  src: imageLinks.shift(),
                  nonCloseable: entity.content.nonCloseable,
                },
              };
            }
            return entity;
          }),
        };

        axios
          .put(`${process.env.ENDPOINT}/api/blogs`, body, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
          .then((res) => {
            invalidateAllBlogs();
            setLoading(false);
            toast({
              title: "Success",
              description: res.data.description,
              variant: res.data.type,
            });

            axios.post(
              `${CDN_ENDPOINT}/api/images/delete/multiple`,
              {
                names: removedImages,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              },
            );
          })
          .catch((err) => {
            setLoading(false);
            if (!err.response?.data) return;
            toast({
              title: "Error",
              description: err.response.data.description,
              variant: err.response.data.type,
            });
          });
      })
      .catch((err) => {
        setLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }

  return (
    <main className="mx-auto flex h-full min-h-full w-full max-w-2xl flex-col items-center gap-2 bg-white">
      {blog.map((blogElement) => {
        switch (blogElement.type) {
          case "image":
            return (
              <BlogImage
                key={blogElement.id}
                imgSrc={blogElement.content.src}
                nonCloseable={blogElement.content.nonCloseable}
                uploadImage={uploadImage(blogElement.id)}
                deleteImage={deleteImage(blogElement.id)}
              />
            );
          case "title":
            return (
              <BlogTitle
                key={blogElement.id}
                value={blogElement.content.value}
                onChange={titleOnChange(blogElement.id)}
              />
            );
          case "h1":
            return (
              <BlogHeading1
                key={blogElement.id}
                value={blogElement.content.value}
                onChange={textOnChange(blogElement.id)}
                changeTextType={changeTextType(blogElement.id)}
                deleteSection={deleteSection(blogElement.id)}
              />
            );
          case "h2":
            return (
              <BlogHeading2
                key={blogElement.id}
                value={blogElement.content.value}
                onChange={textOnChange(blogElement.id)}
                changeTextType={changeTextType(blogElement.id)}
                deleteSection={deleteSection(blogElement.id)}
              />
            );
          case "text":
            return (
              <BlogText
                key={blogElement.id}
                value={blogElement.content.value}
                onChange={textOnChange(blogElement.id)}
                changeTextType={changeTextType(blogElement.id)}
                deleteSection={deleteSection(blogElement.id)}
              />
            );
        }
      })}

      <div className="mt-6 flex w-full items-center justify-center gap-4">
        <Separator className="max-w-14 bg-gray-300" />
        <button
          onClick={() => addBlogSection("h1")}
          className="flex h-9 w-9 items-center justify-center rounded-full border-1 border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-700"
        >
          <Heading1 className="h-5 w-5" />
        </button>
        <button
          onClick={() => addBlogSection("h2")}
          className="flex h-9 w-9 items-center justify-center rounded-full border-1 border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-700"
        >
          <Heading2 className="h-5 w-5" />
        </button>
        <button
          onClick={() => addBlogSection("text")}
          className="flex h-9 w-9 items-center justify-center rounded-full border-1 border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-700"
        >
          <Type className="h-5 w-5" />
        </button>
        <button
          onClick={() => addBlogSection("image")}
          className="flex h-9 w-9 items-center justify-center rounded-full border-1 border-gray-400 text-gray-400 hover:border-gray-600 hover:text-gray-700"
        >
          <Image className="h-5 w-5" />
        </button>
        <Separator className="max-w-14 bg-gray-300" />
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        {loading ? (
          <Button
            disabled
            variant="secondary"
            className="mt-6 w-full max-w-[15rem]"
          >
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button
            onClick={submitBlogDraft}
            variant="secondary"
            className="w-full max-w-[15rem] text-slate-400 hover:bg-purple-100 hover:text-slate-800"
          >
            Save Changes
          </Button>
        )}
      </div>
    </main>
  );
};

export default BlogEditingSection;
