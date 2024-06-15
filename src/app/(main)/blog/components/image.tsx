import { ChangeEvent, FC } from "react";
import { ImageUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface BlogImageProps {
  imgSrc: string;
  nonCloseable?: boolean;

  uploadImage(e: ChangeEvent<HTMLInputElement>): Promise<void>;
  deleteImage(): void;
}
const BlogImage: FC<BlogImageProps> = ({
  nonCloseable,
  imgSrc,
  uploadImage,
  deleteImage,
}) => {
  return !imgSrc ? (
    <div className="group relative flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-md border-1 border-slate-300 bg-slate-100 transition-all duration-150 ease-in-out hover:border-2 hover:border-dashed hover:border-slate-400">
      <ImageUp className="aspect-square h-20 w-20 text-slate-300 transition-all duration-150 ease-in-out group-hover:text-slate-400 lg:h-32 lg:w-32" />
      <span className="pt-3 text-[16px] text-slate-400 lg:text-lg">
        Upload Image
      </span>
      <span className="text-xs text-slate-400">
        Supported file types: JPEG, JPG, PNG, WEBP
      </span>

      <Input
        onChange={uploadImage}
        required
        name="blog_image"
        className="absolute z-10 h-full w-full cursor-pointer opacity-0"
        type="file"
      />

      {!nonCloseable ? (
        <Button
          variant="secondary"
          className="absolute right-3 top-3 z-20 h-9 w-9 items-center justify-center p-0 text-slate-500 hover:bg-destructive hover:text-white"
          onClick={deleteImage}
        >
          <X className="h-5 w-5" />
        </Button>
      ) : null}
    </div>
  ) : (
    <div className="relative w-full">
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt="image"
          className="h-fit w-full rounded-md border-1 object-contain"
          width={500}
          height={500}
        />
      ) : null}

      <div className="absolute right-3 top-3 isolate z-20 flex gap-3">
        <div className="group relative h-9 w-9">
          <div className="flex h-full w-full items-center justify-center rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-500 group-hover:text-white">
            <ImageUp className="h-5 w-5" />
          </div>
          <Input
            onChange={uploadImage}
            required
            name="blog_image"
            className="absolute right-0 top-0 z-10 h-9 w-9 cursor-pointer opacity-0"
            type="file"
          />
        </div>
        {!nonCloseable ? (
          <Button
            variant="secondary"
            className="h-9 w-9 items-center justify-center p-0 text-slate-500 hover:bg-destructive hover:text-white"
            onClick={deleteImage}
          >
            <X className="h-5 w-5" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default BlogImage;
