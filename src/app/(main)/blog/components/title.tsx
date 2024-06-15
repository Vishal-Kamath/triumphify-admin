import { ChangeEvent, FC } from "react";

const BlogTitle: FC<{
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Title"
        className="w-full border-none pb-2 pt-6 font-serif text-4xl font-medium outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BlogTitle;
