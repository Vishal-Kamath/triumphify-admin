import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import BlogEditingSection from "./editingSection";

const EditBlogPage: FC = () => {
  return (
    <PrivilageProvider path="/blog/:id">
      <main className="w-full p-6 pb-36">
        <BlogEditingSection />
      </main>
    </PrivilageProvider>
  );
};

export default EditBlogPage;
