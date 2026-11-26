import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PrintMode } from "@/components/deck/print";
import { SceneOpening, SceneCampaigns, SceneAudience } from "@/components/deck/ScenesIntro";
import { SceneMiroFish } from "@/components/deck/ScenesSim";
import { SceneResults, SceneSurprise, SceneWhatIf } from "@/components/deck/ScenesOutcome";
import { SceneNetworks } from "@/components/deck/SceneNetworks";
import { SceneThankYou } from "@/components/deck/SceneThankYou";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "Premiere Swarm · PDF export" },
      { name: "description", content: "Printable version of the Premiere Swarm demo, one scene per page." },
      { property: "og:title", content: "Premiere Swarm · PDF export" },
      { property: "og:description", content: "All Premiere Swarm demo scenes on one page each, ready to save as PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrintDeck,
});

const pages = [
  <SceneOpening key="1" />,
  <SceneCampaigns key="2" />,
  <SceneAudience key="3" />,
  <SceneMiroFish key="4" />,
  <SceneResults key="5" />,
  <SceneResults key="5b" showWinner />,
  <SceneSurprise key="6" />,
  <SceneWhatIf key="7" />,
  <SceneNetworks key="8" />,
  <SceneThankYou key="9" />,
];

function PrintDeck() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Let entrance animations and charts finish before opening the print dialog.
    const t = setTimeout(() => {
      setReady(true);
      window.print();
    }, 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <PrintMode.Provider value={true}>
      <div className="print-hide fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-brand px-6 py-3 text-primary-foreground shadow-xl">
        {ready ? (
          <button onClick={() => window.print()}>Print again · choose “Save as PDF”</button>
        ) : (
          "Preparing your PDF…"
        )}
      </div>
      <div className="print-deck">
        {pages.map((p, i) => (
          <div key={i} className="print-page">
            {p}
          </div>
        ))}
      </div>
    </PrintMode.Provider>
  );
}
