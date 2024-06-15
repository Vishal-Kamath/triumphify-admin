interface BlogImage {
  blogId: string;
  id: string;
  type: "image";
  order: number;
  content: {
    src: string;
    nonCloseable?: boolean;
    type?: string;
    size?: number;
    lastModified?: number;
  };
}

interface BlogTitle {
  blogId: string;
  id: string;
  type: "title";
  order: number;
  content: {
    value: string;
  };
}

interface BlogHeading1 {
  blogId: string;
  id: string;
  type: "h1";
  order: number;
  content: {
    value: string;
  };
}

interface BlogHeading2 {
  blogId: string;
  id: string;
  type: "h2";
  order: number;
  content: {
    value: string;
  };
}

interface BlogText {
  blogId: string;
  id: string;
  type: "text";
  order: number;
  content: {
    value: string;
  };
}

type BlogSection =
  | BlogImage
  | BlogTitle
  | BlogHeading1
  | BlogHeading2
  | BlogText;

interface Blog {
  id: string;
  slug: string;
  image: string;
  title: string;
  status: "draft";
  created_by: string;
  created_at: Date;
  updated_at: Date | null;
}
