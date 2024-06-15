import PrivilageProvider from "@/components/providers/privilage.provider";
import { FC } from "react";
import BlogWritingSection from "./writingSection";

const WriteBlogPage: FC = () => {
  return (
    <PrivilageProvider path="/blog/write">
      <main className="w-full p-6 pb-36">
        <BlogWritingSection />
      </main>
    </PrivilageProvider>
  );
};

export default WriteBlogPage;
