import Display from "@/components/Display";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <Display />,
});
