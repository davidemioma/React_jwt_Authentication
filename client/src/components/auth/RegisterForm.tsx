import { toast } from "sonner";
import { ZodError } from "zod";
import { api } from "@/lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterValidator } from "../../../../types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const RegisterForm = () => {
  const form = useForm<RegisterValidator>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: RegisterValidator) => {
      const res = await api.auth.register.$post({ json: values });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      return res;
    },
    onSuccess: (res) => {
      if (res.ok) {
        toast.success("Confirmation email sent!");
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

  const onSubmit = (values: RegisterValidator) => {
    mutate(values);
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      showSocial
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
