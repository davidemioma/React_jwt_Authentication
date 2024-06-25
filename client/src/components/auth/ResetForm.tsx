import { api } from "@/lib/api";
import { toast } from "sonner";
import { ZodError } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema, ResetValidator } from "../../../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ResetForm = () => {
  const form = useForm<ResetValidator>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (values: ResetValidator) => {
      const res = await api.auth["reset-password"].$post({ json: values });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      return res;
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Password reset email sent!");
      }
    },
    onError: (err) => {
      if (err instanceof ZodError) {
        toast.error(err.issues.map((issues) => issues.message).join(" ,"));
      } else {
        toast.error(err.message);
      }
    },
  });

  const onSubmit = (values: ResetValidator) => {
    mutate(values);
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john.doe@example.com"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
