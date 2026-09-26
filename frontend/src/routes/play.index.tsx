import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/play/")({
  beforeLoad: () => {
    throw redirect({
      to: "/play/$missionId",
      params: { missionId: "m14" },
    });
  },
});
