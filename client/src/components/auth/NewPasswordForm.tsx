import { toast } from "sonner";
import { api } from "@/lib/api";
import { ZodError } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema, NewPasswordValidator } from "../../../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  token: string | undefined;
};

const NewPasswordForm = ({ token }: Props) => {
  const navigate = useNavigate();

  const form = useForm<NewPasswordValidator>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      token,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-password", token],
    mutationFn: async (values: NewPasswordValidator) => {
      if (!token) {
        toast.error("Invalid token!");

        return;
      }

      const res = await api.auth["new-password"].$patch({
        json: values,
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      return res;
    },
    onSuccess: (res) => {
      if (res?.ok) {
        toast.success(
          "Password has been reset. Redirecting to sign in page...",
        );

        navigate({ to: "/auth/sign-in" });
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

  const onSubmit = (values: NewPasswordValidator) => {
    mutate(values);
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
