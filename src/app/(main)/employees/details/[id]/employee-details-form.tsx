import { Employee } from "@/@types/employee";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading } from "react-icons/ai";
import { useForm } from "react-hook-form";
import {
  EmployeeDetailsFormType,
  employeeDetailsFormSchema,
} from "./employee-details-form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { invalidateAllEmployee, invalidateAllEmployees } from "@/lib/employee";

const EmployeeDetailsForm: FC<{ employee: Employee }> = ({ employee }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmployeeDetailsFormType>({
    resolver: zodResolver(employeeDetailsFormSchema),
    defaultValues: {
      email: "",
      username: "",
      role: "employee",
    },
  });

  useEffect(() => {
    if (!!employee && employee.role !== undefined) {
      form.setValue("email", employee?.email || "");
      form.setValue("username", employee?.username || "");
      form.setValue("role", employee.role as "admin" | "employee");
    }
  }, [employee]);

  function onSubmit(values: EmployeeDetailsFormType) {
    setLoading(true);

    axios
      .post(
        `${process.env.ENDPOINT}/api/employees/details/${employee.id}`,
        {
          role: values.role,
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
        invalidateAllEmployee(employee.id);
        invalidateAllEmployees();
        toast({
          title: "Success",
          description: res.data.description,
          variant: res.data.type,
        });
      })
      .catch((err) => {
        setLoading(false);
        if (!err.response?.data) return;
        toast({
          title: "Error",
          description: err.response.data.description,
          variant: err.response.data.type,
        });
      });
  }

  const formStates = form.watch();
  const buttonIsEnabled =
    formStates?.username?.trim() !== employee?.username?.trim() ||
    formStates?.email?.trim() !== employee?.email?.trim() ||
    formStates?.role?.trim() !== employee?.role?.trim();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full max-w-lg flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                This is employee display name. It can be real name or a
                pseudonym.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="johndoe@email.com"
                  disabled={true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                employee email address.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Roles" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <FormDescription className="text-xs">
                employees designated role
              </FormDescription>
            </FormItem>
          )}
        />
        {loading ? (
          <Button disabled className="max-w-xs">
            <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            Please wait..
          </Button>
        ) : (
          <Button
            type="submit"
            className="max-w-xs"
            disabled={!buttonIsEnabled}
          >
            Save Changes
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EmployeeDetailsForm;
