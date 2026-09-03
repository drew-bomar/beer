# Online-data extraction — Loop / Downtown / Clayton (BEE-32)

Extraction sweep over venues' OWN web presences (sites + their linked menu pages only;
no Google Maps / Untappd / Yelp scraping). Checked 2026-09-03 via WebFetch.
Rule applied: only what a page actually says — no inferred hours or "typical" prices.
`size_oz: 16` on drafts is recorded only where the menu itself says "Pint" or "16 oz".

Covers the Delmar Loop, Downtown, and Clayton / WashU tables of `shortlist.md`
(Dos Salas skipped — permanently closed). 17 venues.

---

## Delmar Loop

### Blueberry Hill

Best result of the sweep. Full bar menu with per-beer prices as readable HTML on
`/bar/`; hours on homepage; happy hour stated (Mon–Fri 4–6pm) but with discounts only,
no HH dollar amounts. Bottle/can list below is the fetcher's selection from a longer
menu — a re-fetch of `/bar/` can pull the full list. Drafts priced by "Pint"
(recorded as 16 oz) and "Pitcher" (size not stated).

```json
{
  "slug": "blueberry-hill",
  "source_url": "https://blueberryhill.com/bar/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["11:00", "00:00"]],
    "mon": [["11:00", "00:00"]],
    "tue": [["11:00", "00:00"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["11:00", "01:30"]]
  },
  "prices": [
    {"beer_name": "Featured Draught", "brand": "4 Hands", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "City Pilsner", "brand": "4 Hands", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Pale Ale", "brand": "Schlafly", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Raspberry Hefeweizen", "brand": "Schlafly", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Squirrelworks", "brand": "Urban Chestnut", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Zwickel", "brand": "Urban Chestnut", "format": "draft", "size_oz": 16, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Featured Draught", "brand": "4 Hands", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "City Pilsner", "brand": "4 Hands", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Pale Ale", "brand": "Schlafly", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Raspberry Hefeweizen", "brand": "Schlafly", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Squirrelworks", "brand": "Urban Chestnut", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Zwickel", "brand": "Urban Chestnut", "format": "pitcher", "size_oz": null, "price": 20.50, "happy_hour_only": false},
    {"beer_name": "Bud Light", "brand": "Anheuser-Busch", "format": "draft", "size_oz": 16, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Busch", "brand": "Anheuser-Busch", "format": "draft", "size_oz": 16, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Belgian White", "brand": "Golden Road", "format": "draft", "size_oz": 16, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Yuengling", "brand": "Yuengling", "format": "draft", "size_oz": 16, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Bud Light", "brand": "Anheuser-Busch", "format": "pitcher", "size_oz": null, "price": 15.00, "happy_hour_only": false},
    {"beer_name": "Busch", "brand": "Anheuser-Busch", "format": "pitcher", "size_oz": null, "price": 15.00, "happy_hour_only": false},
    {"beer_name": "Belgian White", "brand": "Golden Road", "format": "pitcher", "size_oz": null, "price": 15.00, "happy_hour_only": false},
    {"beer_name": "Yuengling", "brand": "Yuengling", "format": "pitcher", "size_oz": null, "price": 15.00, "happy_hour_only": false},
    {"beer_name": "Labatt Blue", "brand": "Labatt", "format": "draft", "size_oz": 16, "price": 4.75, "happy_hour_only": false},
    {"beer_name": "Labatt Blue", "brand": "Labatt", "format": "pitcher", "size_oz": null, "price": 14.00, "happy_hour_only": false},
    {"beer_name": "City Wide Light / Pale Ale", "brand": "4 Hands", "format": "bottle", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Blue Moon", "brand": "Blue Moon", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Corona", "brand": "Corona", "format": "bottle", "size_oz": null, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Guinness", "brand": "Guinness", "format": "bottle", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Heineken", "brand": "Heineken", "format": "bottle", "size_oz": null, "price": 5.75, "happy_hour_only": false},
    {"beer_name": "Miller High Life", "brand": "Miller", "format": "bottle", "size_oz": null, "price": 5.25, "happy_hour_only": false},
    {"beer_name": "Rolling Rock", "brand": "Rolling Rock", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Stella Artois", "brand": "Stella Artois", "format": "bottle", "size_oz": null, "price": 6.50, "happy_hour_only": false}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "16:00", "end": "18:00", "applies_to": "select draft beers, well drinks, appetizers", "deal_price": null, "discount": null, "free_text": "Happy hour specials Monday through Friday from 4:00 p.m. to 6:00 p.m. Happy hour includes discounts on select draft beers, well drinks, and appetizers."}
  ],
  "obstacles": "Happy-hour discount amounts not published (only 'discounts on select draft beers'). Bottle/can list may be partial (fetcher selection). Hours shown are bar hours; kitchen closes earlier."
}
```

### Three Kings Public House

Site blocks fetchers — HTTP 403 on both `www.threekingspub.com` and
`threekingspub.com` (2 attempts, as budgeted; matches the shortlist's earlier note).
Nothing extracted. Likely priced gastropub menu behind the block.

```json
{
  "slug": "three-kings-public-house",
  "source_url": "https://www.threekingspub.com",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Site returns HTTP 403 to fetchers (2 attempts, www and bare domain). needs photo/manual"
}
```

### Pin-Up Bowl

Bar menu (`/cocktails-beer/`) is readable HTML with full per-beer prices: 8 drafts
all $6/pint and 12 packaged beers $3–$9. Hours on homepage. No happy hour or
specials anywhere on the site. Packaged list recorded as `bottle` (menu labels the
section "Packaged" without per-item bottle/can distinction).

```json
{
  "slug": "pin-up-bowl",
  "source_url": "https://pinupbowl.com/cocktails-beer/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["15:00", "03:00"]],
    "mon": [["15:00", "03:00"]],
    "tue": [["15:00", "03:00"]],
    "wed": [["15:00", "03:00"]],
    "thu": [["15:00", "03:00"]],
    "fri": [["12:00", "03:00"]],
    "sat": [["12:00", "03:00"]]
  },
  "prices": [
    {"beer_name": "Single Speed Blonde", "brand": "4 Hands", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Divided Sky Rye IPA", "brand": "4 Hands", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Soothsayer Weisenbock", "brand": "Iron Hops", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Chicken Hawk Amber", "brand": "Iron Hops", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "The Angel & The Sword ESB", "brand": "Civil Life", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "American Brown", "brand": "Civil Life", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Coffee Stout", "brand": "Schlafly", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Kolsch", "brand": "Schlafly", "format": "draft", "size_oz": 16, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Pabst Blue Ribbon", "brand": "Pabst", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Czechvar", "brand": "Czechvar", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Gumballhead", "brand": "Three Floyds", "format": "bottle", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Sol Cerveza", "brand": "Sol", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Technical Ecstasy", "brand": "2nd Shift", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Montucky Cold Snack", "brand": "Montucky", "format": "bottle", "size_oz": null, "price": 3.00, "happy_hour_only": false},
    {"beer_name": "City Wide", "brand": "4 Hands", "format": "bottle", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Brewligans", "brand": "2nd Shift", "format": "bottle", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Zombie Ice", "brand": "Three Floyds", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Sandman", "brand": "Third Wheel", "format": "bottle", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Dark Matter", "brand": "Logboat", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "German Porter", "brand": "Urban Chestnut", "format": "bottle", "size_oz": null, "price": 7.00, "happy_hour_only": false}
  ],
  "specials": [],
  "obstacles": "Packaged-beer section does not distinguish bottle vs can per item (recorded as bottle). No happy hour published."
}
```

### Halo Bar (The Pageant)

No weekly schedule exists: "The Halo Bar opens at 6pm on The Pageant show nights."
No menu, prices, or specials anywhere on thepageant.com.

```json
{
  "slug": "halo-bar-the-pageant",
  "source_url": "https://www.thepageant.com/venue-info/the-halo-bar/",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": null, "deal_price": null, "discount": null, "free_text": "The Halo Bar opens at 6pm on The Pageant show nights. (Event-driven hours, no weekly schedule published.)"}
  ],
  "obstacles": "No menu or prices published at all; hours are event-driven (show nights only). needs photo/manual"
}
```

### Session Taco – Delmar Loop

Hours found on the locations page. Nightly late-night happy hour confirmed on the
homepage ("9pm to close every night" — end time is "close", which varies by day; see
hours). No dollar prices for drinks; the drinks side of the menu delegates the beer
list to untappd.com (not scraped per rules), and no session-draft price is published.

```json
{
  "slug": "session-taco-delmar-loop",
  "source_url": "https://www.sessiontaco.com/find-your-session",
  "checked": "2026-09-03",
  "hours": {
    "tue": [["11:00", "23:00"]],
    "wed": [["11:00", "23:00"]],
    "thu": [["11:00", "23:00"]],
    "fri": [["11:00", "00:00"]],
    "sat": [["11:00", "00:00"]],
    "sun": [["11:00", "22:00"]]
  },
  "prices": [],
  "specials": [
    {"days": [0, 2, 3, 4, 5, 6], "start": "21:00", "end": null, "applies_to": "select tacos, guac & queso, shots, cocktail quickies, session drafts", "deal_price": null, "discount": null, "free_text": "9pm to close every night. Stop in for $3 select tacos, happy hour guac & queso, shots, cocktail quickies and session drafts! (End time = close, varies by day; Delmar Loop closed Mondays so Monday omitted from days.)"}
  ],
  "obstacles": "Menu says 'go to untappd.com for current draft and canned beer selection' — beer list is an Untappd hand-off with no prices on the venue's own site. Happy-hour draft price not published. needs photo/manual for beer prices"
}
```

### Salt + Smoke – Delmar Loop

Sitewide bar menu (readable HTML) has full draft and bottle/can prices — better than
the shortlist's "no" flag. Happy hour Mon–Fri 3–6pm: "$2 off all draft beer + draft
cocktails." Caveat: the bar menu is not labeled per-location; prices below come from
the chain's shared `/bar-menu/` page.

```json
{
  "slug": "salt-and-smoke-delmar-loop",
  "source_url": "https://www.saltandsmokebbq.com/bar-menu/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["11:00", "21:00"]],
    "mon": [["11:00", "21:00"]],
    "tue": [["11:00", "21:00"]],
    "wed": [["11:00", "21:00"]],
    "thu": [["11:00", "21:00"]],
    "fri": [["11:00", "22:00"]],
    "sat": [["11:00", "22:00"]]
  },
  "prices": [
    {"beer_name": "Schmidt's Light American Lager", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Citrus Wheat", "brand": "Old Bakery", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Up River Juicy IPA", "brand": "Old Bakery", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "SIUE Cougar Red Amber Lager", "brand": "Old Herald", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Seasonal Cider (Gluten Free)", "brand": "Brick River", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Brown Ale", "brand": "Civil Life", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "APA", "brand": "4 Hands", "format": "can", "size_oz": 16, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Yuengling", "brand": "Yuengling", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Budweiser / Bud Light / Bud Select", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Busch Light", "brand": "Anheuser-Busch", "format": "can", "size_oz": 12, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Michelob Ultra", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "15:00", "end": "18:00", "applies_to": "all draft beer + draft cocktails", "deal_price": null, "discount": 2.00, "free_text": "Happy Hour Mon – Fri, 3–6pm: All Draft Beer + Draft Cocktails $2 Off. Also select appetizers $2 off, wine by the glass 8.00."}
  ],
  "obstacles": "Bar menu is the chain's shared page, not labeled Delmar-specific; draft sizes not stated; packaged section's bottle-vs-can split partly unstated (recorded from item text where given)."
}
```

### Moonrise Hotel rooftop (Eclipse)

Rooftop Garden Bar hours found. Happy hour window published (Sun–Thu 4–6pm) with no
deal details. No beer names or prices: food menu is a PNG image, cocktail menu is a
QR-code hand-off to a third-party platform.

```json
{
  "slug": "moonrise-hotel-rooftop-eclipse",
  "source_url": "https://moonrisehotel.com/food-drinks/rooftop-bar/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["16:00", "00:00"]],
    "mon": [["16:00", "00:00"]],
    "tue": [["16:00", "00:00"]],
    "wed": [["16:00", "00:00"]],
    "thu": [["16:00", "00:00"]],
    "fri": [["16:00", "01:00"]],
    "sat": [["16:00", "01:00"]]
  },
  "prices": [],
  "specials": [
    {"days": [0, 1, 2, 3, 4], "start": "16:00", "end": "18:00", "applies_to": null, "deal_price": null, "discount": null, "free_text": "Garden Bar Happy Hour: Sunday – Thursday 4:00 PM – 6:00 PM. No discount details or pricing published."}
  ],
  "obstacles": "Food menu is a PNG image; cocktail/drink menu is behind a QR code to a third-party platform. Site warns 'Hours may vary based on private events and weather conditions.' needs photo/manual"
}
```

### The W Karaoke Lounge

No web presence to extract from — the shortlist records no official site (social
only, no URL captured). Nothing checked online.

```json
{
  "slug": "the-w-karaoke-lounge",
  "source_url": null,
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "No official website or captured social URL. needs photo/manual (and confirm still trading, per shortlist follow-ups)"
}
```

---

## Downtown

### PBR St. Louis: A Cowboy Bar

Ballpark Village venue page lists hours only for Thu/Fri/Sat (Sun–Wed unstated —
presumably closed but not confirmed, so omitted). No menu of any kind on the BPV
site. One weekly special: Freedom Friday (military/veterans/first-responders perks,
not a price deal).

```json
{
  "slug": "pbr-st-louis-a-cowboy-bar",
  "source_url": "https://stlballparkvillage.com/eat-and-drink/pbr-st-louis",
  "checked": "2026-09-03",
  "hours": {
    "thu": [["20:00", "02:00"]],
    "fri": [["20:00", "03:00"]],
    "sat": [["20:00", "03:00"]]
  },
  "prices": [],
  "specials": [
    {"days": [5], "start": "20:00", "end": "02:30", "applies_to": "military, veterans, first responders, public service (with credentials)", "deal_price": null, "discount": null, "free_text": "Freedom Friday, every Friday 8:00 PM – 2:30 AM: FREE cover & skip the line; first cold one on us; bottle service specials; military salute at midnight."}
  ],
  "obstacles": "No menu published on the BPV site (no PDF/image/embed — nothing at all). Sun–Wed hours unstated. needs photo/manual"
}
```

### Budweiser Brew House

The BPV site has no page for the Brew House proper — only the "Bud Deck Rooftop"
sub-page, which is ticketed-event-driven ($32 all-inclusive packages, packages
required for entry) with no bar hours, menu, or per-beer prices. Its Linktree is
ticket/reservation links only.

```json
{
  "slug": "budweiser-brew-house",
  "source_url": "https://stlballparkvillage.com/eat-and-drink/bud-deck-at-budweiser-brew-house",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": "Bud Deck rooftop", "deal_price": 32.00, "discount": null, "free_text": "Bud Deck: $32 all-inclusive packages include domestic beer, N/A beverages, hot dogs, and burgers (21+); packages are required for entry. Event-date driven, many dates closed for private events."}
  ],
  "obstacles": "No Brew House venue page, hours, or menu on BPV site; Linktree is tickets/OpenTable only. needs photo/manual"
}
```

### Sports & Social St. Louis

Hours found on the BPV venue page (Monday unstated — omitted, not assumed closed).
Weekly programming listed (Taco Tuesday, Sports Watch, plaza music) but with no
prices or drink details. "View Menu" button exists but its target wasn't reachable
in the page content.

```json
{
  "slug": "sports-and-social-st-louis",
  "source_url": "https://stlballparkvillage.com/Eat-and-Drink/Sports-and-Social",
  "checked": "2026-09-03",
  "hours": {
    "tue": [["16:00", "22:00"]],
    "wed": [["16:00", "22:00"]],
    "thu": [["16:00", "23:00"]],
    "fri": [["16:00", "01:00"]],
    "sat": [["11:00", "01:00"]],
    "sun": [["11:00", "19:00"]]
  },
  "prices": [],
  "specials": [
    {"days": [2], "start": null, "end": null, "applies_to": "tacos", "deal_price": null, "discount": null, "free_text": "Taco Tuesday, every Tuesday (listed 12 AM – 10 PM on BPV specials page); no prices or drink details published."}
  ],
  "obstacles": "Menu behind a 'View Menu' button whose URL is not exposed in page content (likely JS/third-party embed). No drink prices anywhere. Monday hours unstated. needs photo/manual"
}
```

### Salt + Smoke – Ballpark Village

Same shared site as the Delmar location: same hours, same shared bar menu and happy
hour (see Delmar section for the full 12-item price list — identical source page,
not location-labeled). BPV-specific caveat printed on the happy-hour menu: it is
"not available at Ballpark Village on Game Days." BPV's own directory shows "No
opening hours available" for this venue; hours below are from saltandsmokebbq.com.

```json
{
  "slug": "salt-and-smoke-ballpark-village",
  "source_url": "https://www.saltandsmokebbq.com/bar-menu/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["11:00", "21:00"]],
    "mon": [["11:00", "21:00"]],
    "tue": [["11:00", "21:00"]],
    "wed": [["11:00", "21:00"]],
    "thu": [["11:00", "21:00"]],
    "fri": [["11:00", "22:00"]],
    "sat": [["11:00", "22:00"]]
  },
  "prices": [
    {"beer_name": "Schmidt's Light American Lager", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Citrus Wheat", "brand": "Old Bakery", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Up River Juicy IPA", "brand": "Old Bakery", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "SIUE Cougar Red Amber Lager", "brand": "Old Herald", "format": "draft", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Seasonal Cider (Gluten Free)", "brand": "Brick River", "format": "draft", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Brown Ale", "brand": "Civil Life", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "APA", "brand": "4 Hands", "format": "can", "size_oz": 16, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Yuengling", "brand": "Yuengling", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Budweiser / Bud Light / Bud Select", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Busch Light", "brand": "Anheuser-Busch", "format": "can", "size_oz": 12, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Michelob Ultra", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "15:00", "end": "18:00", "applies_to": "all draft beer + draft cocktails", "deal_price": null, "discount": 2.00, "free_text": "Happy Hour Mon – Fri, 3–6pm: All Draft Beer + Draft Cocktails $2 Off. Menu not available at Ballpark Village on Game Days."}
  ],
  "obstacles": "Prices are from the chain's shared bar menu, not labeled BPV-specific; happy hour suspended at BPV on game days; BPV directory itself lists no hours for this venue. Verify on-site."
}
```

### Paddy O's

Entirely game-day-driven: "Open three hours before St. Louis Cardinals' home games
til last call on drinks." No weekly hours, no menu, no prices; the "Game Day
Specials" page names no actual deals (just live DJ every home game). High
cheap-beer relevance, zero extractable data.

```json
{
  "slug": "paddy-os",
  "source_url": "https://stlpaddyos.com/game-day-specials/",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": null, "deal_price": null, "discount": null, "free_text": "Open three hours before St. Louis Cardinals' home games til last call on drinks. Live DJ at every Cardinals home game. No drink prices published."}
  ],
  "obstacles": "Event-driven hours (Cardinals home games only, no weekly schedule); no menu or prices anywhere on site. needs photo/manual"
}
```

### Broadway Oyster Bar

Drink menu exists but only as JPG images (`picts/bob-drink-menu1.jpg` etc.) — not
machine-readable. A caption references "Happy Hour 11 am - 4 pm" with no days
stated. No weekly hours found on the site's pages.

```json
{
  "slug": "broadway-oyster-bar",
  "source_url": "https://www.broadwayoysterbar.com/drinkmenu1.html",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": null, "deal_price": null, "discount": null, "free_text": "Happy Hour 11 am - 4 pm (from an image caption; days of week and deal details not stated in readable text — details are inside the menu images)."}
  ],
  "obstacles": "Drink menu is JPG images, not text; hours not published in readable text. needs photo/manual"
}
```

### Tin Roof St. Louis

Hours on homepage. Rich specials calendar in readable text — the standout downtown
result: happy hour Mon–Fri 2–6pm ($3 domestic bottles), $3 Bud Family drafts
Mondays, $1 well refills Thursday cup night, $20 beer buckets Sundays. Full food
and drink menus are PDFs (unread), so the only beer prices are the specials.

```json
{
  "slug": "tin-roof-st-louis",
  "source_url": "https://tinroofstlouis.com/restaurant-bar/",
  "checked": "2026-09-03",
  "hours": {
    "sun": [["11:00", "02:00"]],
    "mon": [["11:00", "00:00"]],
    "tue": [["11:00", "00:00"]],
    "wed": [["11:00", "02:00"]],
    "thu": [["11:00", "02:00"]],
    "fri": [["11:00", "03:00"]],
    "sat": [["11:00", "03:00"]]
  },
  "prices": [
    {"beer_name": "Domestic bottles", "brand": null, "format": "bottle", "size_oz": null, "price": 3.00, "happy_hour_only": true},
    {"beer_name": "Bud Family draft", "brand": "Anheuser-Busch", "format": "draft", "size_oz": null, "price": 3.00, "happy_hour_only": true},
    {"beer_name": "Beer bucket", "brand": null, "format": "bucket", "size_oz": null, "price": 20.00, "happy_hour_only": true}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "14:00", "end": "18:00", "applies_to": "domestic bottles, wells, special shots, seltzers, call liquors", "deal_price": 3.00, "discount": null, "free_text": "Happy Hour Mon-Fri 2pm-6pm: $3 Domestic Bottles, $3 Wells, $4 Special Shots, $5 seltzers, $5 call liquors"},
    {"days": [1], "start": null, "end": null, "applies_to": "Bud Family drafts, wells, seltzers, quesadillas", "deal_price": 3.00, "discount": null, "free_text": "Monday: $5 Quesadillas; $3 Bud Family Draft, $5 Wells, & $5 Seltzers (times not stated)"},
    {"days": [2], "start": null, "end": null, "applies_to": "happy hour drink list", "deal_price": null, "discount": null, "free_text": "Tuesday: Happy Hour Drink Specials ALL DAY!"},
    {"days": [4], "start": "21:00", "end": "00:00", "applies_to": "well refills in $5 souvenir cup", "deal_price": 1.00, "discount": null, "free_text": "Cup Night every Thursday: grab a $5 souvenir cup and enjoy $1 well refills from 9 PM–Midnight. Also $5 Teas and Bombs."},
    {"days": [0], "start": null, "end": null, "applies_to": "beer buckets and select liquor", "deal_price": 20.00, "discount": null, "free_text": "Sunday: $20 Beer Buckets, $5 Jameson, $5 Titos, $6 Deep Eddy, $6 Green and White Tea shots (times not stated)"}
  ],
  "obstacles": "Full food and drink menus are PDF links (not read); regular non-special beer prices unknown. Bucket contents/count not stated."
}
```

### Maggie O'Brien's

Site blocks fetchers — HTTP 403 on both `www.maggieobriens.com` and
`maggieobriens.com` (2 attempts). Nothing extracted.

```json
{
  "slug": "maggie-obriens",
  "source_url": "https://www.maggieobriens.com",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Site returns HTTP 403 to fetchers (2 attempts, www and bare domain). needs photo/manual"
}
```

---

## Clayton / WashU

### Krueger's Bar

Hours and happy hour on the homepage: $3 domestic bottles / $4 rail, 4–6pm Mon–Fri;
free tacos Thursdays with a drink purchase. Menu page is readable text but carries
no beer prices (food only).

```json
{
  "slug": "kruegers-bar",
  "source_url": "https://www.kruegersbar.com",
  "checked": "2026-09-03",
  "hours": {
    "mon": [["12:00", "00:00"]],
    "tue": [["12:00", "01:00"]],
    "wed": [["12:00", "01:00"]],
    "thu": [["12:00", "01:00"]],
    "fri": [["12:00", "01:00"]],
    "sat": [["12:00", "01:00"]],
    "sun": [["12:00", "00:00"]]
  },
  "prices": [
    {"beer_name": "Domestic bottles", "brand": null, "format": "bottle", "size_oz": null, "price": 3.00, "happy_hour_only": true}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "16:00", "end": "18:00", "applies_to": "domestic bottles, rail cocktails", "deal_price": 3.00, "discount": null, "free_text": "Happy Hour 4PM - 6PM Monday - Friday: $3 Domestic Bottles, $4 Rail Cocktails"},
    {"days": [4], "start": null, "end": null, "applies_to": "tacos with drink purchase", "deal_price": null, "discount": null, "free_text": "Free tacos on Thursday with a drink purchase!"}
  ],
  "obstacles": "Regular (non-happy-hour) beer prices not published; menu page is readable text but food-only."
}
```

---

## Summary

| Venue | Hours found? | # prices | # specials | Obstacle |
|---|---|---|---|---|
| Blueberry Hill | yes (7 days) | 32 | 1 | HH amounts unpublished; bottle list may be partial |
| Three Kings Public House | no | 0 | 0 | 403 blocks fetchers — needs photo/manual |
| Pin-Up Bowl | yes (7 days) | 20 | 0 | bottle-vs-can not itemized |
| Halo Bar (The Pageant) | no (show nights only) | 0 | 1 (free_text) | no menu at all; event-driven hours — needs photo/manual |
| Session Taco – Delmar Loop | yes (6 days, Mon closed) | 0 | 1 | beer list handed off to Untappd, no prices — needs photo/manual |
| Salt + Smoke – Delmar Loop | yes (7 days) | 12 | 1 | shared chain menu, not location-labeled; no draft sizes |
| Moonrise Hotel rooftop (Eclipse) | yes (7 days) | 0 | 1 | menus are PNG/QR third-party — needs photo/manual |
| The W Karaoke Lounge | no | 0 | 0 | no web presence — needs photo/manual + confirm trading |
| PBR St. Louis: A Cowboy Bar | partial (Thu–Sat only) | 0 | 1 | no menu on BPV site — needs photo/manual |
| Budweiser Brew House | no | 0 | 1 (free_text) | no venue page/menu; Bud Deck is ticketed packages — needs photo/manual |
| Sports & Social St. Louis | yes (6 days, Mon unstated) | 0 | 1 | menu behind JS button; no drink prices — needs photo/manual |
| Salt + Smoke – Ballpark Village | yes (7 days, from own site) | 12 | 1 | shared chain menu; HH off on game days; BPV lists no hours |
| Paddy O's | no (game days only) | 0 | 1 (free_text) | event-driven; no menu/prices — needs photo/manual |
| Broadway Oyster Bar | no | 0 | 1 (free_text) | drink menu is JPG images — needs photo/manual |
| Tin Roof St. Louis | yes (7 days) | 3 (all HH/special) | 5 | full menus are PDFs; regular prices unknown |
| Maggie O'Brien's | no | 0 | 0 | 403 blocks fetchers — needs photo/manual |
| Krueger's Bar | yes (7 days) | 1 (HH only) | 2 | regular beer prices unpublished |

Totals: hours 10/17 full + 1 partial · prices 80 rows across 6 venues (Blueberry
Hill 32, Pin-Up 20, Salt + Smoke 12×2, Tin Roof 3, Krueger's 1) · specials 17 rows
across 12 venues. The shortlist's takeaway holds: regular per-beer prices are online
at only 4 distinct menus (Blueberry Hill, Pin-Up Bowl, Salt + Smoke, plus specials
pricing at Tin Roof/Krueger's); everything else needs a photo visit or manual entry.
