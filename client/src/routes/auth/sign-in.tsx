import LoginForm from "@/components/auth/LoginForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in")({
  component: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <LoginForm />
    </div>
  ),
});
