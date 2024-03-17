import { FC } from "react";
import { Button } from "../ui/button";
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from "react-icons/lu";

const Pagination: FC<{
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}> = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-6 flex w-full justify-between gap-3">
      <div className="text-sm text-slate-500">total pages {totalPages}</div>
      <div className="flex items-center gap-3">
        <Button
          aria-label="Go to first page"
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          <LuChevronsLeft className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to previous page"
          variant="outline"
          className="size-8 p-0"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <LuChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex size-8 items-center justify-center">{page}</div>
        <Button
          aria-label="Go to next page"
          variant="outline"
          className="size-8 p-0"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <LuChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <Button
          aria-label="Go to last page"
          variant="outline"
          className="hidden size-8 p-0 lg:flex"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          <LuChevronsRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
