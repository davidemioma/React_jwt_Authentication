import { Toaster } from "@/components/ui/sonner";
import ErrorCard from "@/components/auth/ErrorCard";
import { type QueryClient } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <ErrorCard />
    </div>
  ),
  component: () => (
    <>
      <Toaster />

      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
