import { ChangeEvent, FC } from "react";
import BlogTextSettings from "./text-settings";

const BlogText: FC<{
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
        className="w-full border-none pt-2 font-serif text-xl font-medium outline-none"
        value={value}
        onChange={onChange}
      />
      <BlogTextSettings
        type="text"
        changeTextType={changeTextType}
        deleteSection={deleteSection}
      />
    </div>
  );
};

export default BlogText;
