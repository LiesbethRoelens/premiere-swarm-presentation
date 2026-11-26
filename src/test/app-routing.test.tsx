import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { Route as presentationRoute } from "@/routes/index";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("includes the thank-you closing slide at slide 9 and caps navigation there", () => {
    const validate = presentationRoute.options.validateSearch;
    if (typeof validate !== "function") throw new Error("Expected presentation search validation");
    expect(validate({ slide: 9 })).toEqual({ slide: 9 });
    expect(validate({ slide: 10 })).toEqual({ slide: 9 });
  });

  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
