import Display from "@/components/Display";
import { authUserQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const user = await queryClient.fetchQuery(authUserQueryOptions);

      return { user };
    } catch (e) {
      return { user: null };
    }
  },
  component: () => {
    const { user } = Route.useRouteContext();

    if (!user) {
      return <Display />;
    }

    return <Outlet />;
  },
});
