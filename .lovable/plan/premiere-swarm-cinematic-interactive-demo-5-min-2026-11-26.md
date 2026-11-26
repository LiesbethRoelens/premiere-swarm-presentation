# Premiere Swarm: cinematic interactive demo (5 min)

A full-screen, click-through web presentation in the Telefónica/Movistar style. It follows the 5 slides in your PowerPoint, with missing content filled in and interactive visuals added.

## Style
- Telefónica blue (#0066FF) leads, with deep navy for the cinematic scenes and white for content scenes. Rounded cards, a bold clean sans-serif, generous spacing.
- Smooth scene transitions. Move between scenes with the arrow keys, a click or a swipe. A progress bar and a fullscreen button are always visible.
- Uses the images from your deck: the "And... Action!" clapperboard, both Movistar Christmas campaigns, the three persona photos, the MiroFish fishbowl and the checkered flag.

## Scenes
1. **Premiere Swarm (opening).** Clapperboard image with a "clap" animation. Catchy line: "Rehearse your campaign before the world sees it." Subline: "Before spending millions launching a campaign, what if we could test it in a synthetic world?" A swarm of dots forms the title.
2. **Two Campaigns, One Question.** Road A (Emotion) and Road B (Entertainment) side by side, each with its Movistar image and a short concept summary I'll write. An animated question mark sits between them, and the key question is revealed.
3. **The Audience.** Three persona cards: Family Planner, Digital Native and Skeptic, with their traits. Cards flip to show motivations, memory and relationships. A small animated network shows how they influence each other ("Agents with personality, memory and relations").
4. **Launch Experiment, powered by MiroFish.** Clicking the fishbowl starts the simulation. Fish (agents) swim around, and speech bubbles with persona dialogue pop up live. Counters show conversations, shares and sentiment, and a toggle switches between Campaign A and B.
5. **Which Campaign Wins?** Animated comparison charts for interest, conversation, recommendation and reputational risk, broken down by persona. Ends with a checkered-flag reveal of the winner (Road A, illustrative).
6. **But there's a surprise…** A dramatic reveal of an unexpected finding. Draft example: the Skeptic segment first reacts negatively to Road A's emotional tone, while one creative element (a grandparent video call) spreads unexpectedly through Digital Natives and turns Skeptics positive. Marked so you can swap in the real MiroFish finding.
7. **What-if scenario.** Controls to adjust the winning campaign (tone, offer, channel mix, add the viral element), then a Re-simulate button. The charts animate to show the change compared with the original.
8. **Recommendation and closing.** Launch "Road A+" with next steps, then the closing message: "We're not replacing real market research. We're giving marketing teams a new way to explore creative ideas, discover potential reactions and challenge their assumptions before spending money in the real world."

All numbers are illustrative demo data and will be clearly labeled that way.

## Technical details
- `src/routes/index.tsx` becomes the presentation, with one component per scene in `src/components/deck/` on a scaled 1920x1080 stage. `?slide=N` keeps the current scene in the address.
- Deck images are extracted from the .pptx and served through lovable-assets.
- Telefónica tokens live in `src/styles.css`, and the font loads with a `<link>` in the root head.
- Charts use recharts. The fishbowl and network are animated SVG. Transitions use framer-motion.
