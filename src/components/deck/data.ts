import familyImg from "@/assets/family-planner.jpg.asset.json";
import digitalImg from "@/assets/digital-native.jpg.asset.json";
import skepticImg from "@/assets/skeptic.jpg.asset.json";

export type PersonaId = "family" | "digital" | "skeptic";
export type CampaignId = "A" | "B";

export const personas: {
  id: PersonaId;
  name: string;
  person: string;
  img: string;
  traits: string[];
  motivation: string;
  memory: string;
  relations: string;
  color: string;
}[] = [
  {
    id: "family",
    name: "The Family-Oriented",
    person: "Lucía",
    img: familyImg.url,
    traits: ["Values family", "Price-conscious", "Practical"],
    motivation: "Wants Christmas to feel warm, and wants plans that save money.",
    memory: "Remembers last year's roaming bill and which brands 'felt honest'.",
    relations: "Listens to her kids. Talks to other parents in WhatsApp groups.",
    color: "var(--persona-family)",
  },
  {
    id: "digital",
    name: "The Digital Native",
    person: "Jorge",
    img: digitalImg.url,
    traits: ["Lives online", "Influenced by trends", "Shares quickly"],
    motivation: "Wants content worth sharing: funny, fresh, meme-able.",
    memory: "Knows every Christmas ad trope and calls out cringe fast.",
    relations: "A big network. When he shares, his followers notice.",
    color: "var(--persona-digital)",
  },
  {
    id: "skeptic",
    name: "The Skeptic",
    person: "Carlos",
    img: skepticImg.url,
    traits: ["Doesn't trust advertising", "Needs a reason to care", "Hard to move"],
    motivation: "Wants proof, not promises. Respects brands that don't oversell.",
    memory: "Holds grudges against brands that oversold before.",
    relations: "A small circle, but a very credible one.",
    color: "var(--persona-skeptic)",
  },
];

export const metrics = [
  { key: "viewing", label: "Viewing intention" },
  { key: "recommendation", label: "Recommendation" },
  { key: "amplification", label: "Amplification" },
  { key: "clarity", label: "Concept clarity" },
  { key: "sentiment", label: "Positive sentiment" },
  { key: "risk", label: "Reputational risk" },
] as const;
export type MetricKey = (typeof metrics)[number]["key"];
export type Scores = Record<MetricKey, number>;

// Illustrative simulation output (scores 0-100), based on the deck's chart.
export const results: Record<CampaignId, Scores> = {
  A: { viewing: 68, recommendation: 72, amplification: 60, clarity: 75, sentiment: 80, risk: 14 },
  B: { viewing: 88, recommendation: 84, amplification: 91, clarity: 86, sentiment: 72, risk: 19 },
};

export const personaScores: Record<CampaignId, Record<PersonaId, number>> = {
  A: { family: 84, digital: 52, skeptic: 41 },
  B: { family: 63, digital: 93, skeptic: 58 },
};

export type Chat = { persona: PersonaId; agent: number; text: string };
export const chats: Record<CampaignId, Chat[]> = {
  A: [
    { persona: "family", agent: 12, text: "This is literally my family at Christmas. I teared up a bit." },
    { persona: "digital", agent: 24, text: "Beautiful, but I've seen this ad every December since 2015." },
    { persona: "skeptic", agent: 8, text: "Nice feelings. What are they actually selling me?" },
    { persona: "family", agent: 31, text: "Sent it to the cousins' group. Mum loved it." },
    { persona: "digital", agent: 47, text: "I'd watch it, but I wouldn't post it." },
    { persona: "skeptic", agent: 19, text: "At least it doesn't shout at me. I'll give them that." },
    { persona: "family", agent: 5, text: "It reminds me why I keep everyone connected." },
    { persona: "digital", agent: 62, text: "My algorithm is skipping it after 3 seconds, tbh." },
  ],
  B: [
    { persona: "digital", agent: 24, text: "Okay, this one is funny. Already shared the trailer." },
    { persona: "family", agent: 12, text: "The kids keep quoting it at dinner. Is it a series?" },
    { persona: "skeptic", agent: 8, text: "Both look like advertising. Why is everyone talking about this one?" },
    { persona: "digital", agent: 51, text: "The elf scene is becoming a meme. Stitching it now 😂" },
    { persona: "skeptic", agent: 19, text: "Fine. It's self-aware. I laughed, against my will." },
    { persona: "family", agent: 31, text: "Fun, but I miss a bit of that Christmas warmth." },
    { persona: "digital", agent: 77, text: "Everyone in my feed has their own version of it now." },
    { persona: "skeptic", agent: 33, text: "My nephew sent it to me. Usually I'd ignore ads." },
  ],
};
