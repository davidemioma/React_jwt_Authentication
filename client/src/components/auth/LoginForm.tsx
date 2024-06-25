import { ZodError } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { api, authUserQueryOptions } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { LoginSchema, LoginValidator } from "../../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const LoginForm = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const form = useForm<LoginValidator>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (values: LoginValidator) => {
      const res = await api.auth.login.$post({ json: values });

      if (!res.ok) {
        if (res.status === 403) {
          toast.info("Confirmation email sent!");
        }

        const data = await res.json();

        throw new Error(data.error || "Something went wrong!");
      }

      return res;
    },
    onSuccess: (res) => {
      if (res.ok) {
        if (res.status === 202) {
          setShowTwoFactor(true);
        } else {
          navigate({ to: "/settings" });

          queryClient.invalidateQueries({
            queryKey: [authUserQueryOptions.queryKey],
          });
        }
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

  const onSubmit = (values: LoginValidator) => {
    mutate(values);
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      showSocial
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor ? (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                        autoComplete="new-password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
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

                      <Button
                        className="px-0 font-normal"
                        asChild
                        size="sm"
                        variant="link"
                        disabled={isPending}
                      >
                        <Link to="/auth/reset">Forgot password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
