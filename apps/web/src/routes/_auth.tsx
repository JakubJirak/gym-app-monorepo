import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: () => <Outlet />,
});
