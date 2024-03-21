import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { invalidateTicketChats } from "@/lib/ticket";
import axios from "axios";
import { Forward } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, FC, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const TicketsChatTextArea: FC = () => {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const id = useParams()["id"] as string | undefined;

  useEffect(() => {
    function autoResize() {
      if (!textAreaRef.current) return;
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        Number(textAreaRef.current.scrollHeight) < 60
          ? "40px"
          : textAreaRef.current.scrollHeight + "px";
    }
    if (textAreaRef.current) {
      textAreaRef.current.addEventListener("input", autoResize);
    }

    return () => {
      textAreaRef.current?.removeEventListener("input", autoResize);
    };
  }, [textAreaRef.current]);

  function SubmitChat() {
    if (!content.trim()) {
      return toast({
        title: "Fill all details",
        variant: "warning",
      });
    }
    if (!id) return;

    axios
      .post(
        `${process.env.ENDPOINT}/api/tickets/${id}/chat`,
        {
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        invalidateTicketChats(id);
        setContent("");
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: err?.response?.data?.title || "Error",
          description: err?.response?.data?.description,
          variant: err?.response?.data?.type || "error",
        });
      });
  }

  return (
    <div className="bottom-0 w-full sticky bg-white py-3 flex gap-3">
      <Textarea
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Chat here..."
        className="min-h-10 resize-none h-10 max-h-52 w-full"
      />
      {loading ? (
        <button
          disabled
          className="rounded-md flex-shrink-0 flex justify-center items-center text-slate-500 hover:bg-purple-100 hover:text-purple-700 size-10 bg-slate-100"
        >
          <AiOutlineLoading className="size-5 animate-spin" />
        </button>
      ) : (
        <button
          onClick={SubmitChat}
          className="rounded-md flex-shrink-0 flex justify-center items-center text-slate-500 hover:bg-purple-100 hover:text-purple-700 size-10 bg-slate-100"
        >
          <Forward className="size-5" />
        </button>
      )}
    </div>
  );
};

export default TicketsChatTextArea;
