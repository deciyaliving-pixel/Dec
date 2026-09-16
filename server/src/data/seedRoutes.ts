import type { RouteGuide } from "@staykhoj/shared";

export const seedRoutes: RouteGuide[] = [
  {
    id: "route-konkan-coastal-drive",
    slug: "konkan-coastal-drive",
    title: "The Konkan Coastal Drive",
    dek: "A slow, four-stop road trip down the coast from Ratnagiri to the Goa border",
    regionSlugs: ["western-ghats-konkan"],
    seasons: ["winter", "shoulder"],
    moods: ["weekend-escape", "nature-adventure"],
    durationDays: 4,
    stops: [
      {
        name: "Ratnagiri",
        lat: 16.9902,
        lng: 73.312,
        description: "Starting point on the coastal highway, known for Alphonso mango orchards and the Thibaw Palace.",
      },
      {
        name: "Ganpatipule",
        lat: 17.1449,
        lng: 73.264,
        description: "A beach town built around a coastal Ganesh temple, with a quiet white-sand beach.",
      },
      {
        name: "Amboli Ghat",
        lat: 15.9578,
        lng: 74.0021,
        description: "A detour inland to the waterfall-lined ghat, best added if travelling in monsoon or shoulder season.",
      },
      {
        name: "Tarkarli",
        lat: 16.0167,
        lng: 73.4667,
        description: "Final stop on the clear-water Sindhudurg coast, with the fort crossing as the closing activity.",
      },
    ],
    body:
      "This route strings together the Konkan coast's most drivable highlights without trying to cover the entire stretch from Mumbai to Goa in one go — it starts at Ratnagiri, reachable by rail or a half-day drive from Mumbai, and moves south at an unhurried pace.\n\nGanpatipule works well as a first overnight: an easy coastal town with a genuinely quiet beach outside of major holiday weekends. From there, the route has an optional inland detour to Amboli Ghat, worth adding specifically if travelling in monsoon or early shoulder season when the waterfalls are active — skip it in the dry months, when the ghat has far less to offer.\n\nThe drive closes at Tarkarli, with Sindhudurg Fort's tide-dependent boat crossing as a natural final-day activity before continuing on to Goa, another 1.5–2 hours south.",
    heroImage:
      "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    heroImageAlt: "A secluded sandy beach with palm trees on the Konkan coast",
    heroImageCredit: { photographer: "Ishvani Hans", profileUrl: "https://unsplash.com/@ishvanihans" },
    metaDescription:
      "A 4-day Konkan coastal drive itinerary from Ratnagiri to Tarkarli, with an optional Amboli Ghat waterfall detour.",
    canonicalUrl: "/routes/konkan-coastal-drive",
    authorId: "author-ananya-krishnan",
    publishDate: "2026-07-15",
    hasTimeSensitiveInfo: true,
    lastCheckedDate: "2026-08-20",
    reportingStatus: "verified_firsthand",
    status: "published",
    isSeedContent: true,
    relatedDestinationSlugs: ["amboli-ghat-waterfalls", "tarkarli-sindhudurg-coast"],
    relatedPlanningSlug: "/best-time-to-visit-india",
  },
  {
    id: "route-kochi-munnar-highland-loop",
    slug: "kochi-munnar-highland-loop",
    title: "Kochi to Munnar Highland Loop",
    dek: "A three-day loop from the coast into Kerala's tea country and back",
    regionSlugs: ["kerala"],
    seasons: ["winter", "shoulder", "summer"],
    moods: ["weekend-escape", "nature-adventure"],
    durationDays: 3,
    stops: [
      {
        name: "Kochi",
        lat: 9.9312,
        lng: 76.2673,
        description: "Loop start and end point, with Kochi international airport as the main arrival gateway.",
      },
      {
        name: "Thattekad",
        lat: 10.1833,
        lng: 76.5833,
        description: "A birding-focused halfway stop in the Periyar river valley, worth an early-morning walk.",
      },
      {
        name: "Munnar",
        lat: 10.0889,
        lng: 77.0595,
        description: "The highland base for tea estate walks and Eravikulam National Park.",
      },
    ],
    body:
      "This loop treats Munnar as a highland base rather than a drive-through stop, with a birding halt at Thattekad on the way up that most direct Kochi–Munnar itineraries skip entirely.\n\nDay one covers the drive from Kochi to Thattekad, with an afternoon and early-morning birding walk in the Periyar river valley's forest patches. Day two continues on to Munnar, arriving with enough daylight left for a first tea-estate walk. Day three is built around Eravikulam National Park before the drive back down to Kochi.\n\nThe route works across most of the year outside peak monsoon, though the specific activities — birding visibility, park access, viewpoint clarity — shift by season more than the drive itself does.",
    heroImage:
      "https://images.unsplash.com/photo-1723709431768-d749b0d814b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    heroImageAlt: "A car driving along a winding road through green hills",
    heroImageCredit: { photographer: "Adnan Saifee", profileUrl: "https://unsplash.com/@adnan_saifeee" },
    metaDescription:
      "A 3-day Kochi to Munnar highland loop itinerary with a Thattekad birding stop, tea estate walks, and Eravikulam National Park.",
    canonicalUrl: "/routes/kochi-munnar-highland-loop",
    authorId: "author-thomas-mathew",
    publishDate: "2026-06-10",
    hasTimeSensitiveInfo: true,
    lastCheckedDate: "2026-08-25",
    reportingStatus: "verified_firsthand",
    status: "published",
    isSeedContent: true,
    relatedDestinationSlugs: ["munnar-highlands", "alleppey-backwaters"],
    relatedPlanningSlug: "/best-time-to-visit-india",
  },
];
