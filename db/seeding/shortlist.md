# Venue seeding shortlist (BEE-32)

Research shortlist of real St. Louis bars for seeding the Beer app's coverage zones.
Built 2026-08-31 from general web search, venues' own websites/social pages, and
address geocoding (OSM Nominatim + US Census geocoder). **Not yet seeded** — this is
the raw candidate list for the seeding scripts and the district polygon definitions.

Conventions:

- ⭐ = founder anchor (must include). Anchors are listed first in each table.
- Coordinates are approximate (lng, lat to 4 decimals), derived from the street
  address / OSM POI — good enough for map pins, not survey-grade.
- **Priced menu?** = does the venue's own site visibly show a menu with dollar prices
  (predicts price-extraction hit rate). Checked for all anchors and all Loop venues;
  `unknown` elsewhere means not yet checked, not that no menu exists.
- Venues with closure signals were dropped during research (see Summary); the one
  permanently closed **anchor** (Dos Salas) is kept as a flagged row for the record —
  do not seed it.
- District slugs: `loop`, `downtown`, `soulard`, `midtown-slu`, `grove`, `dogtown`,
  `clayton-washu`.

## Delmar Loop (`loop`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| Blueberry Hill | 6504 Delmar Blvd, University City, MO 63130 | -90.3050 | 38.6558 | loop | https://blueberryhill.com | yes | Loop institution, WashU crowd; food menu priced, beer prices not online |
| Three Kings Public House | 6307 Delmar Blvd, University City, MO 63130 | -90.3030 | 38.6559 | loop | https://www.threekingspub.com | unknown | Gastropub, big tap list, WashU student staple; site blocks fetchers (403) |
| Pin-Up Bowl | 6191 Delmar Blvd, St. Louis, MO 63112 | -90.2992 | 38.6558 | loop | https://pinupbowl.com | yes | Bowling + bar, open to 3am; food menu priced, bar menu not |
| Halo Bar (The Pageant) | 6161 Delmar Blvd, St. Louis, MO 63112 | -90.2979 | 38.6555 | loop | https://www.thepageant.com | no | Bar attached to The Pageant; busiest on show nights |
| Session Taco – Delmar Loop | 6235 Delmar Blvd, St. Louis, MO 63112 | -90.3009 | 38.6557 | loop | https://www.sessiontaco.com | unknown | Formerly Mission Taco Joint (2024 rebrand, same owners); late-night HH w/ "session drafts" |
| Salt + Smoke – Delmar Loop | 6525 Delmar Blvd, University City, MO 63130 | -90.3050 | 38.6561 | loop | https://www.saltandsmokebbq.com | no | BBQ + big bourbon/beer bar; online menu shows no prices |
| Moonrise Hotel rooftop (Eclipse) | 6177 Delmar Blvd, St. Louis, MO 63112 | -90.2988 | 38.6557 | loop | https://moonrisehotel.com | unknown | Rooftop Garden Bar + Twilight Room; hotel bar, more cocktail-leaning — lower priority |
| The W Karaoke Lounge | 6556 Delmar Blvd, University City, MO 63130 | -90.3072 | 38.6563 | loop | null | unknown | Karaoke lounge, student crowd; no official site found (social only) |

Dropped during research: Cicero's and Peacock Diner (long closed), La Gasolina
(hookah/Latin lounge, off-focus), Fitz's (no alcohol — craft-soda microbrewery).

## Downtown incl. Washington Ave + Ballpark Village (`downtown`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ PBR St. Louis: A Cowboy Bar | 601 Clark Ave, St. Louis, MO 63102 | -90.1916 | 38.6239 | downtown | https://stlballparkvillage.com/eat-and-drink/pbr-st-louis | unknown | Anchor ("PBR"). Ballpark Village country bar, mechanical bull; BPV site shows no menus |
| ⭐ Dos Salas | 1919 Washington Ave, St. Louis, MO 63103 | -90.2067 | 38.6339 | downtown | https://www.instagram.com/dossalasstl | n/a | Anchor — **PERMANENTLY CLOSED** (early 2025, rent lawsuit; confirmed via news + own IG). Do not seed |
| Budweiser Brew House | 601 Clark Ave, St. Louis, MO 63102 | -90.1913 | 38.6243 | downtown | https://stlballparkvillage.com/eat-and-drink/bud-deck-at-budweiser-brew-house | unknown | BPV; 100+ beers, rooftop Bud Deck; game-day crowd |
| Sports & Social St. Louis | 601 Clark Ave, St. Louis, MO 63102 | -90.1919 | 38.6241 | downtown | https://stlballparkvillage.com/Eat-and-Drink/Sports-and-Social | unknown | BPV sports bar/games venue |
| Salt + Smoke – Ballpark Village | 501 Clark Ave, St. Louis, MO 63102 | -90.1902 | 38.6237 | downtown | https://www.saltandsmokebbq.com/location/bpv/ | no | One Cardinal Way base, patio faces Busch Stadium |
| Paddy O's | 618 S 7th St, St. Louis, MO 63102 | -90.1940 | 38.6209 | downtown | https://stlpaddyos.com | unknown | Classic pre/post-game beer barn next to Busch Stadium; cheap-beer relevance high |
| Broadway Oyster Bar | 736 S Broadway, St. Louis, MO 63102 | -90.1924 | 38.6188 | downtown | https://www.broadwayoysterbar.com | unknown | Blues/live-music bar near stadium; patio |
| Tin Roof St. Louis | 1000 Clark Ave, St. Louis, MO 63102 | -90.1968 | 38.6244 | downtown | https://tinroofstlouis.com | unknown | Live-music joint, game-day/student crowd |
| Maggie O'Brien's | 2000 Market St, St. Louis, MO 63103 | -90.2096 | 38.6297 | downtown | https://www.maggieobriens.com | unknown | Irish pub near Union Station/CITYPARK; renovated 2022, appears open |

Dropped during research (closed): Start Bar (Oct 2024), Wheelhouse Downtown
(closed after NYE 2025→26), Flamingo Bowl (private events only, "reopening soon"
limbo — recheck later), Fieldhouse Pub & Grill (Nov 2024).

## Soulard (`soulard`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ Molly's in Soulard | 816 Geyer Ave, St. Louis, MO 63104 | -90.2041 | 38.6082 | soulard | https://www.mollysinsoulard.com | no | Anchor ("Mollys"). Bar/restaurant/patio/nightclub; menus online but unpriced; HH "$1 off all drinks" listed |
| ⭐ John D. McGurk's Irish Pub | 1200 Russell Blvd, St. Louis, MO 63104 | -90.2100 | 38.6076 | soulard | https://mcgurks.com | yes | Anchor ("McGurks"). Landmark Irish pub + garden; full menu incl. per-beer prices ($5–8.75 drafts) |
| ⭐ Great Grizzly Bear | 1027 Geyer Ave, St. Louis, MO 63104 | -90.2068 | 38.6091 | soulard | https://greatgrizzlystl.com | no | Anchor ("The grizzly bear"). ~40-yr Soulard institution; reopened under new ownership 2025 — menus online, no prices |
| 1860 Saloon, Game Room & Hardshell Café | 1860 S 9th St, St. Louis, MO 63104 | -90.2043 | 38.6085 | soulard | https://www.1860saloon.com | unknown | Live music nightly, Cajun kitchen, game room |
| Big Daddy's Soulard | 1000 Sidney St, St. Louis, MO 63104 | -90.2101 | 38.6013 | soulard | https://bigdaddyssoulardbar.com | unknown | Party bar, big patio; young/cheap-beer crowd |
| Duke's in Soulard | 2001 Menard St, St. Louis, MO 63104 | -90.2074 | 38.6080 | soulard | null | unknown | Neighborhood corner bar (on Soulard Restoration Group directory); no official site found |
| Hammerstone's | 2028 S 9th St, St. Louis, MO 63104 | -90.2051 | 38.6069 | soulard | https://www.hammerstones.net | unknown | Live music + sports corner bar |
| International Tap House (iTap Soulard) | 1711 S 9th St, St. Louis, MO 63104 | -90.2029 | 38.6106 | soulard | https://internationaltaphouse.com | unknown | 40+ taps / 500 bottles; craft-beer pricing skews higher |
| Jack Nolen's | 2501 S 9th St, St. Louis, MO 63104 | -90.2077 | 38.6020 | soulard | https://jacknolens.com | unknown | Burger bar/dive, south Soulard |
| Cat's Meow | 2600 S 11th St, St. Louis, MO 63104 | -90.2109 | 38.6016 | soulard | https://www.facebook.com/p/The-Cats-Meow-Soulard-100057598833911/ | unknown | No-frills dive, cash-cheap beer; Facebook only |
| Carson's Sports Bar | 1712 S 9th St, St. Louis, MO 63104 | -90.2027 | 38.6105 | soulard | null | unknown | Sports bar on SRG directory; no official site found — verify hours before seeding |

Dropped during research: Llywelyn's Pub Soulard (closed, per Yelp Aug 2026),
Nadine's (uncertain state), D's Place (couldn't confirm details).

## Midtown / SLU (`midtown-slu`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ Humphrey's Restaurant & Tavern | 3700 Laclede Ave, St. Louis, MO 63108 | -90.2375 | 38.6350 | midtown-slu | https://humphreysmidtown.com | yes | Anchor ("Humphreys"). THE SLU college bar since 1976 (closed 2017, reopened 2022); food menu priced, drink menu "being updated" |
| Urban Chestnut Midtown Brewery & Biergarten | 3229 Washington Ave, St. Louis, MO 63103 | -90.2258 | 38.6379 | midtown-slu | https://urbanchestnut.com | unknown | Brewery biergarten in Grand Center, near SLU north campus |
| Narwhal's Crafted | 3906 Laclede Ave, St. Louis, MO 63108 | -90.2422 | 38.6361 | midtown-slu | https://www.narwhalscrafted.com | unknown | Frozen-cocktail bar popular with SLU students; beer secondary |

Dropped: Fieldhouse Pub & Grill (SLU sports bar — closed Nov 2024). SLU's classic
bar strip largely died pre-2020 (see UNews "Last Call for SLU College Bars");
Humphrey's is the anchor that matters here.

## The Grove (`grove`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ La Calle | 4121 Manchester Ave, St. Louis, MO 63110 | -90.2511 | 38.6280 | grove | https://lacallestl.com | yes | Anchor ("La Calle"). Mexican street-food bar/club in The Grove; drink menu priced ($4.50 domestic / $5.50 Mexican beer) |
| HandleBar | 4127 Manchester Ave, St. Louis, MO 63110 | -90.2514 | 38.6278 | grove | https://www.handlebarstl.com | unknown | Bike-themed bar, karaoke/trivia/DJs; young crowd |
| Urban Chestnut Grove Brewery & Bierhall | 4465 Manchester Ave, St. Louis, MO 63110 | -90.2606 | 38.6268 | grove | https://urbanchestnut.com | unknown | Big bierhall + patio; own-brewed beer |
| The Gramophone | 4243 Manchester Ave, St. Louis, MO 63110 | -90.2556 | 38.6272 | grove | null | unknown | Sandwiches + bar, ex-music venue; no official site confirmed |
| Just John Nightclub | 4112 Manchester Ave, St. Louis, MO 63110 | -90.2507 | 38.6277 | grove | null | unknown | LGBTQ+ club, karaoke/trivia; club-priced drinks |

Dropped: Taha'a Twisted Tiki (closed 2025 — evicted), Atomic Cowboy (closed 2020).

## Dogtown (`dogtown`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ Nick's Pub | 6001 Manchester Ave, St. Louis, MO 63110 | -90.2866 | 38.6228 | dogtown | https://www.nicksirishpub.com | yes | Anchor ("Nick's Pub"). Irish pub, 101 taps, open to 3am; specials page priced ($15 domestic buckets), per-beer prices via TapHunter |
| Seamus McDaniel's | 1208 Tamm Ave, St. Louis, MO 63139 | -90.2928 | 38.6282 | dogtown | null | unknown | Dogtown Irish institution; no official site confirmed |
| Felix's Pizza Pub | 6401 Clayton Ave, St. Louis, MO 63139 | -90.2931 | 38.6288 | dogtown | https://felixspizzapub.com | unknown | Pizza pub, 20+ taps, open late |
| The Pat Connolly Tavern | 6400 Oakland Ave, St. Louis, MO 63139 | -90.2926 | 38.6314 | dogtown | https://patconnollytavern.com | unknown | 1942 Irish tavern ("Pat's") |
| Heavy Riff Brewing Co. | 6413 Clayton Ave, St. Louis, MO 63139 | -90.2936 | 38.6289 | dogtown | https://heavyriffbrewing.com | unknown | Rock-themed brewery taproom, 15 drafts |
| Tamm Avenue Bar | 1227 Tamm Ave, St. Louis, MO 63139 | -90.2931 | 38.6280 | dogtown | https://www.facebook.com/tammavebar | unknown | Neighborhood bar; food tenant now Byrd & Barrel; Facebook is main presence |

## Clayton / WashU (`clayton-washu`)

| Venue | Address | Lng | Lat | District | Website | Priced menu? | Notes |
|---|---|---|---|---|---|---|---|
| ⭐ Krueger's Bar | 7347 Forsyth Blvd, Clayton, MO 63105 | -90.3268 | 38.6485 | clayton-washu | https://www.kruegersbar.com | yes | Anchor ("Krugers" = **Krueger's**, note spelling). Dive/sports bar since 1946, WashU student go-to; food menu priced, beer not |

Single-venue district: Clayton nightlife is thin — WashU students otherwise drink in
the Loop. Seed a small polygon around Krueger's or fold it into a future
"Clayton" expansion district.

## Summary

### Counts

| District | Venues listed | Seedable (open) | Official website | Priced menu = yes |
|---|---|---|---|---|
| loop | 8 | 8 | 7 | 2 (Blueberry Hill, Pin-Up) |
| downtown | 9 | 8 (Dos Salas closed) | 8 official + 1 IG | 0 |
| soulard | 11 | 11 | 8 official + 1 FB | 1 (McGurk's) |
| midtown-slu | 3 | 3 | 3 | 1 (Humphrey's) |
| grove | 5 | 5 | 3 | 1 (La Calle) |
| dogtown | 6 | 6 | 4 official + 1 FB | 1 (Nick's) |
| clayton-washu | 1 | 1 | 1 | 1 (Krueger's) |
| **Total** | **43** | **42** | **34 official + 3 social, 6 null** | **7 yes / 5 no / 30 unknown / 1 n·a (closed)** |

Priced-menu takeaway: even where sites publish menus, **beer prices are rarely
online** (only McGurk's and La Calle show per-drink dollar amounts). Expect
extraction to lean on menu photos and manual admin entry, exactly as the spec
assumes.

### Anchor resolution

All 9 anchors identified; none ambiguous:

- "Krugers" → **Krueger's Bar**, 7347 Forsyth Blvd, Clayton (spelling differs from founder's).
- "Mollys" → Molly's in Soulard ✔ (founder hint correct).
- "McGurks" → John D. McGurk's Irish Pub, Soulard ✔.
- "PBR" → PBR St. Louis: A Cowboy Bar, Ballpark Village ✔.
- "Humphreys" → Humphrey's Restaurant & Tavern, 3700 Laclede (SLU) ✔ — note it closed 2017–2022; open again since Nov 2022.
- "The grizzly bear" → **Great Grizzly Bear**, 1027 Geyer Ave, Soulard (reopened July 2025 under new ownership — mild churn risk).
- "Nick's Pub" → Nick's Pub (Nick's Irish Pub), 6001 Manchester Ave, Dogtown.
- "La Calle" → La Calle, 4121 Manchester Ave, The Grove.
- "Dos Salas" → Dos Salas, 1919 Washington Ave — **permanently closed** (early 2025, rent-dispute eviction). Kept as a flagged row; do not seed.

### Recommended district bounding boxes (lng/lat, with margin; all listed venues fall inside)

| District | lng min | lng max | lat min | lat max |
|---|---|---|---|---|
| loop | -90.3120 | -90.2930 | 38.6510 | 38.6610 |
| downtown | -90.2150 | -90.1840 | 38.6130 | 38.6400 |
| soulard | -90.2180 | -90.1970 | 38.5960 | 38.6170 |
| midtown-slu | -90.2480 | -90.2200 | 38.6290 | 38.6440 |
| grove | -90.2670 | -90.2450 | 38.6210 | 38.6340 |
| dogtown | -90.3000 | -90.2800 | 38.6170 | 38.6370 |
| clayton-washu | -90.3330 | -90.3200 | 38.6430 | 38.6540 |

Sanity: Loop lats sit at ~38.6555–38.6563 (Delmar Blvd ✔), Soulard at 38.601–38.611
(~38.60 ✔), downtown core at 38.619–38.624 with Downtown-West rows up to 38.634
(box extended accordingly ✔).

### Open follow-ups

- Verify Carson's, Duke's, Cat's Meow, and The W Karaoke Lounge are still trading
  before seeding (directory-listed, but no official web presence to confirm).
- Great Grizzly Bear changed hands July 2025 — recheck hours/menu at seed time.
- Flamingo Bowl (downtown) may resume regular operations "under new management" —
  candidate for a later pass.
- Three Kings' site blocks bots; check its menu prices manually (likely priced —
  it's a full gastropub).
