"use client";

import { FC, useState } from "react";
import { NavSectionType } from "./nav";
import NavElement from "./nav-element";
import { cn } from "@/lib/utils";

const NavSection: FC<{
  navSection: NavSectionType;
  setOpen: (open: boolean) => void;
}> = ({ navSection, setOpen }) => {
  const [isHiddenList, setIsHiddenList] = useState<string[]>([]);

  const isHidden = isHiddenList.length === navSection.elements.length;
  return (
    <div
      className={cn(
        "flex flex-col border-b-1 border-slate-200 p-2",
        isHidden ? "hidden" : ""
      )}
    >
      {navSection.label && (
        <h2 className="pb-2 pl-2 font-semibold">{navSection.label}</h2>
      )}
      {navSection.elements.map((navElement, index) => (
        <NavElement
          key={navElement.label + index}
          navElement={navElement}
          setOpen={setOpen}
          setIsHiddenList={setIsHiddenList}
        />
      ))}
    </div>
  );
};

export default NavSection;
