import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { invalidateUserData } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Check, PencilLine, X } from "lucide-react";
import { ElementRef, FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .email()
    .trim()
    .max(100)
    .refine((val) => !!val, "Field required"),
});
type EmailType = z.infer<typeof emailSchema>;
const UpdateEmail: FC<{ employee_email: string }> = ({ employee_email }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);

  const form = useForm<EmailType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!!employee_email) {
      form.setValue("email", employee_email);
    }
  }, [employee_email]);

  function onSubmit(values: EmailType) {
    setLoading(true);
    axios
      .patch(`${process.env.ENDPOINT}/api/employees/update/email`, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        form.reset();
        invalidateUserData();
        setEditing(false);
        toast({
          title: res.data.title,
          description: res.data.description,
          variant: res.data.type,
        });
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2"
      >
        <div className="flex justify-between">
          <h6 className="font-medium text-slate-600">Email</h6>
          <div>
            {editing ? (
              <div className="flex gap-2">
                <button
                  disabled={loading}
                  type="button"
                  onClick={() => {
                    inputRef.current?.blur();
                    setEditing(false);
                  }}
                  className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-red-50 border-none outline-none hover:text-red-800 text-slate-500"
                >
                  <X className="w-3 h-3" />
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-green-50 border-none outline-none hover:text-green-800 text-slate-500"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                disabled={loading}
                type="button"
                onClick={() => {
                  setTimeout(() => inputRef.current?.focus(), 50);
                  setEditing(true);
                }}
                className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-blue-50 border-none outline-none hover:text-blue-800 text-slate-500"
              >
                <PencilLine className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex gap-3 text-sm text-slate-500">
            <AiOutlineLoading className="w-4 h-4" />
            <span>Please wait...</span>
          </div>
        ) : editing ? (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    ref={inputRef}
                    className="border-b-1 outline-none text-slate-600 border-slate-300 focus-within:text-slate-800 text-sm w-full focus-within:border-slate-600"
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        ) : (
          <span className="text-sm text-slate-500">{employee_email}</span>
        )}
      </form>
    </Form>
  );
};

export default UpdateEmail;
