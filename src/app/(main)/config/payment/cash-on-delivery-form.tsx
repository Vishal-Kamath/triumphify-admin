import { Form } from "@/components/ui/form";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const codSchema = z.object({
  active: z.boolean(),
});

const CashOnDeliveryForm: FC = () => {
  const form = useForm({});

  return (
    <Form {...form}>
      <form></form>
    </Form>
  );
};

export default CashOnDeliveryForm;
