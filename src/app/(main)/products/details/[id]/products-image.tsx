"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

const ProductImages: FC<{ name: string; images: string[] }> = ({
  name,
  images,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  // const slideIndex = api?.

  function selectSlide(index: number) {
    api?.scrollTo(index);
  }

  if (!images) return null;
  return (
    <div className="flex w-full flex-col gap-3">
      <Carousel
        setApi={setApi}
        className="w-full overflow-hidden rounded-[2rem] border bg-white shadow-md shadow-gray-950/5"
      >
        <CarouselContent>
          {images?.map((image, index) => (
            <CarouselItem
              className="cursor-grab active:cursor-grabbing"
              key={name + "image" + index}
            >
              <Image
                src={image}
                alt={name + "image"}
                width={1080}
                height={1080}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="right-3" />
        <CarouselPrevious className="left-3" />

        <div className="absolute bottom-0 w-full bg-slate-50 bg-opacity-25 py-5">
          <Carousel className={"mx-auto w-full max-w-[31.5rem] gap-6"}>
            <CarouselContent className="justify-center">
              {images.map((image, index) => (
                <CarouselItem
                  key={name + "image" + index}
                  className="basis-1/6"
                >
                  <Image
                    src={image}
                    alt={name + "image"}
                    width={200}
                    height={200}
                    onClick={() => selectSlide(index)}
                    className={cn(
                      "aspect-square w-[4rem] cursor-pointer rounded-full bg-white"
                    )}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 6 ? (
              <>
                <CarouselNext className="right-3" />
                <CarouselPrevious className="left-3" />
              </>
            ) : null}
          </Carousel>
        </div>
      </Carousel>
    </div>
  );
};

export default ProductImages;
