import { createFileRoute } from "@tanstack/react-router";
import RegisterForm from "@/components/auth/RegisterForm";

export const Route = createFileRoute("/auth/sign-up")({
  component: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <RegisterForm />
    </div>
  ),
});
