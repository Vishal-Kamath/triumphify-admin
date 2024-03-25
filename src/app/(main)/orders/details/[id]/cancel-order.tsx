import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllOrders, invalidateOrder } from "@/lib/orders";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { z } from "zod";

const confirmCancel = z.object({
  confirm: z.string().refine((val) => !!val.trim(), "Field is required"),
});
type ConfirmCancel = z.infer<typeof confirmCancel>;

const CancelOrderForm: FC<{ order_id: string; isCancelled: boolean }> = ({
  order_id,
  isCancelled,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<ConfirmCancel>({
    resolver: zodResolver(confirmCancel),
    defaultValues: { confirm: "" },
  });

  function onSubmit(values: ConfirmCancel) {
    if (values.confirm.trim() !== "Cancel Order")
      return toast({
        title: "Invalid input",
        description: "Please type 'Cancel Order' to confirm",
        variant: "error",
      });

    setLoading(true);
    axios
      .delete(
        `${process.env.ENDPOINT}/api/employee/orders/${order_id}/cancel`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setLoading(false);
        form.reset();
        invalidateAllOrders();
        invalidateOrder(order_id);
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

  return isCancelled ? null : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative isolate flex flex-col gap-6 overflow-hidden rounded-lg border-1 border-red-200 p-6"
      >
        <div
          style={{
            backgroundImage: "url('/cancel-bg.svg')",
            backgroundSize: "4.5rem",
            backgroundRepeat: "repeat",
          }}
          className="absolute left-0 top-0 -z-10 h-full w-full opacity-[3%]"
        ></div>
        <h3 className="font-medium text-red-700">Cancellation form</h3>
        <p className="text-xs text-slate-500">
          To confirm order cancellation type{" "}
          <strong>&apos;Cancel Order&apos;</strong> in the field. Note this
          action is irreversible.
        </p>
        <Separator className="bg-red-200" />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-black">Confirm Cancel</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="ml-auto w-full md:max-w-[15rem]">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button type="submit" className="ml-auto w-full md:max-w-[15rem]">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CancelOrderForm;
