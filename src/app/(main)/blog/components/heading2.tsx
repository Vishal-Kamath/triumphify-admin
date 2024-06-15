import { ChangeEvent, FC } from "react";
import BlogTextSettings from "./text-settings";

const BlogHeading2: FC<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  changeTextType: (type: "h1" | "h2" | "text") => void;
  deleteSection: () => void;
}> = ({ value, onChange, changeTextType, deleteSection }) => {
  return (
    <div className="group relative w-full">
      <input
        type="text"
        placeholder="Tell us more..."
        className="w-full border-none pt-3 font-serif text-2xl font-medium outline-none"
        value={value}
        onChange={onChange}
      />
      <BlogTextSettings
        type="h2"
        changeTextType={changeTextType}
        deleteSection={deleteSection}
      />
    </div>
  );
};

export default BlogHeading2;
