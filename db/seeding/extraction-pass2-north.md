# Deep-crawl extraction PASS 2 — Loop / Downtown / Clayton (BEE-32)

Second-pass deliberate crawl over the same venues' own web presences, 2026-09-04.
Method: raw curl of homepages, full link/asset enumeration, platform tricks
(WP media API, embedded Sitecore JSON), and download+OCR of every menu-looking
PDF/image asset. Rules held: venues' own sites and own-hosted assets only; no
Google Maps / Untappd / Yelp. `price: null` rows are roster-only entries (beer
confirmed on the menu, no dollar amount published).

Excludes venues completed in pass 1: Blueberry Hill, Pin-Up Bowl, both
Salt + Smoke locations, Tin Roof.

---

## Delmar Loop

### Three Kings Public House

Deep crawl blocked. Homepage AND `/menu` return HTTP 403 (Cloudflare "Just a
moment..." challenge page) even with a full browser User-Agent. No assets
reachable; no alternate own-domain found. Needs a real browser session.

```json
{
  "slug": "three-kings-public-house",
  "source_url": "https://www.threekingspub.com",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Cloudflare interactive challenge (403) on homepage and /menu, browser UA retried. needs browser"
}
```

### Halo Bar (The Pageant)

Deep crawl of thepageant.com found exactly two Halo assets: a venue photo and
`Halo-Bar-Specs.pdf` — downloaded and read; it is stage/production specs (PA,
lighting, load-in), zero menu content. Confirms no drink menu exists anywhere
on the site. Hours remain event-driven (opens 6pm on Pageant show nights).

```json
{
  "slug": "halo-bar-the-pageant",
  "source_url": "https://www.thepageant.com/venue-info/the-halo-bar/",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": null, "deal_price": null, "discount": null, "free_text": "The Halo Bar opens at 6pm on The Pageant show nights. (Event-driven hours; no weekly schedule published.)"}
  ],
  "obstacles": "Only Halo asset on the site is a stage-specs PDF (read: no menu content). No prices exist online — needs photo/manual"
}
```

### Session Taco – Delmar Loop

Full menu is inline HTML (not JS-hidden) — read in full: every food and drink
item is published WITHOUT prices by design. Beer section literally says "go to
untappd.com for current draft and canned beer selection" (third-party hand-off,
not crawled). Nightly late-night happy hour confirmed on homepage; only dollar
amount stated is $3 select tacos. Delmar hours re-confirmed on locations page.
Toast online-ordering embed noted (order.toasttab.com) — not crawled.

```json
{
  "slug": "session-taco-delmar-loop",
  "source_url": "https://www.sessiontaco.com/menu",
  "checked": "2026-09-04",
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
    {"days": [0, 2, 3, 4, 5, 6], "start": "21:00", "end": null, "applies_to": "select tacos, guac & queso, shots, cocktail quickies, session drafts", "deal_price": null, "discount": null, "free_text": "LATE NIGHT HAPPY HOUR: 9pm to close every night. $3 select tacos, happy hour guac & queso, shots, cocktail quickies and session drafts (drink prices not stated). End = close, varies by day; Delmar closed Mondays."}
  ],
  "obstacles": "Entire menu unpriced by design; beer list delegated to Untappd (not crawled per rules); session-draft HH price unpublished. Third-party: Toast ordering embed. needs photo/manual for beer prices"
}
```

### Moonrise Hotel rooftop (Eclipse / Garden Bar)

Pass-2 win via the WordPress media API (`/wp-json/wp/v2/media?search=menu` —
uploads not linked from any page): found `2024/02/BEER-MENU.pdf`, downloaded and
read — full beer menu WITH prices: 8 local drafts all $7, 8 domestics all $5,
8 imports all $6, 2 N/A beers $6. Caveat: upload dated Feb 2024. Newest menu
uploads (July 2026 "Twilight and rooftop bar menu" PNG, read) are food-only;
March 2026 "Bar Menu" JPG (read) is bottomless-mimosas brunch only. Rooftop
hours restated on rooftop page; HH Sun–Thu 4–6pm still has no deal details.

```json
{
  "slug": "moonrise-hotel-rooftop-eclipse",
  "source_url": "https://moonrisehotel.com/wp-content/uploads/2024/02/BEER-MENU.pdf",
  "checked": "2026-09-04",
  "hours": {
    "sun": [["16:00", "00:00"]],
    "mon": [["16:00", "00:00"]],
    "tue": [["16:00", "00:00"]],
    "wed": [["16:00", "00:00"]],
    "thu": [["16:00", "00:00"]],
    "fri": [["16:00", "01:00"]],
    "sat": [["16:00", "01:00"]]
  },
  "prices": [
    {"beer_name": "Schlafly Seasonal", "brand": "Schlafly", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Passing Clouds Witbier", "brand": "Rockwell", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Schnickelfritz Weissbier", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "City Wide APA", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Zwickel", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "American Brown Ale", "brand": "Civil Life", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "First Available IPA", "brand": "Rockwell", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Budweiser", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Bud Light", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Bud Select", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Michelob Ultra", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Busch", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Coors Light", "brand": "Coors", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Miller Lite", "brand": "Miller", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Yuengling", "brand": "Yuengling", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Corona Extra", "brand": "Corona", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Hoegaarden", "brand": "Hoegaarden", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Peroni", "brand": "Peroni", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Stella Artois", "brand": "Stella Artois", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Guinness", "brand": "Guinness", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Modelo Especial", "brand": "Modelo", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Sapporo", "brand": "Sapporo", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Stella Artois Cidre (cider)", "brand": "Stella Artois", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Upside Dawn (N/A)", "brand": "Athletic Brewing", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Intentional IPA (N/A)", "brand": "WellBeing", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false}
  ],
  "specials": [
    {"days": [0, 1, 2, 3, 4], "start": "16:00", "end": "18:00", "applies_to": null, "deal_price": null, "discount": null, "free_text": "Garden Bar Happy Hour: Sunday – Thursday 4:00 PM – 6:00 PM. No discount details published."}
  ],
  "obstacles": "Beer menu PDF is dated (uploaded Feb 2024) — verify current. Draft sizes not stated; domestic/import format not stated per item (recorded as bottle). Rooftop is seasonal/weather-dependent; current on-page drink menu is still a QR hand-off to qrcodechimp.com (third-party, not crawled)."
}
```

### The W Karaoke Lounge

No official web presence exists (shortlist records social-only, no URL). Nothing
to crawl; unchanged from pass 1.

```json
{
  "slug": "the-w-karaoke-lounge",
  "source_url": null,
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "No official website or captured social URL. needs photo/manual (and confirm still trading)"
}
```

---

## Downtown

### PBR St. Louis: A Cowboy Bar

Deep crawl of the BPV venue page: all four large "EatDrinkPBRDetail" JPGs were
downloaded and read — they are promo photos (bar scenes), NOT menus. No menu
data blocks exist in the page JSON (unlike Sports & Social). Hours block on the
Freedom Friday detail page lists Thu/Fri/Sat only. Note a contradiction: the
specials calendar says Freedom Friday is "Every Friday 8:00 PM–2:30 AM" while
the body text says "first Friday of each month". No own-domain site found
(candidate domains don't resolve).

```json
{
  "slug": "pbr-st-louis-a-cowboy-bar",
  "source_url": "https://stlballparkvillage.com/eat-and-drink/pbr-st-louis",
  "checked": "2026-09-04",
  "hours": {
    "thu": [["20:00", "02:00"]],
    "fri": [["20:00", "03:00"]],
    "sat": [["20:00", "03:00"]]
  },
  "prices": [],
  "specials": [
    {"days": [5], "start": "20:00", "end": "02:30", "applies_to": "military, veterans, first responders, public service (with credentials)", "deal_price": null, "discount": null, "free_text": "Freedom Friday: FREE cover & skip the line; first cold one on us; bottle service specials; military salute at midnight. CONFLICT in source: specials calendar says 'Every Friday', event body says 'first Friday of each month'."}
  ],
  "obstacles": "No menu anywhere (page images verified by OCR to be promo photos). Sun–Wed hours unstated. No own domain. needs photo/manual"
}
```

### Budweiser Brew House

Re-crawled: BPV has no Brew House venue page (`/eat-and-drink/budweiser-brew-house`
404s) — only the ticketed Bud Deck sub-page, which embeds no menu data, hours,
or prices. budweiserbrewhouse.com (www and bare) does not resolve. Unchanged
from pass 1; nothing extractable online.

```json
{
  "slug": "budweiser-brew-house",
  "source_url": "https://stlballparkvillage.com/eat-and-drink/bud-deck-at-budweiser-brew-house",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": "Bud Deck rooftop", "deal_price": 32.00, "discount": null, "free_text": "Bud Deck: $32 all-inclusive packages include domestic beer, N/A beverages, hot dogs, and burgers (21+); packages required for entry. Event-date driven."}
  ],
  "obstacles": "No venue page (404), no own domain resolves, no menu assets in BPV media. needs photo/manual"
}
```

### Sports & Social St. Louis

Pass-2 breakthrough: the "View Menu" content is embedded in the page's Sitecore
JSON (`/data/menu/...` items) — extracted without a browser. Happy Hour menu:
$4 Domestic Drafts (Bud, Bud Light), $5 Orange Crushes, $6 House Wines, plus
$4 wings / $5 fries / $6 nachos — but NO happy-hour days/times are published
anywhere. Weekly specials pages add real beer deals: Taco Tuesday ($5 Corona
16oz cans, $5 Estrellas, $3 Corona Premier 12oz cans) and Sports Watch game-day
deals ($3 drafts after the 7th inning Mon–Thu on Cards home game days, $25
buckets / $30 Bud Light towers). Hours from the venue-details block (Monday
unlisted). A 3% facilities fee is printed on the menu.

```json
{
  "slug": "sports-and-social-st-louis",
  "source_url": "https://stlballparkvillage.com/Eat-and-Drink/Sports-and-Social",
  "checked": "2026-09-04",
  "hours": {
    "tue": [["16:00", "22:00"]],
    "wed": [["16:00", "22:00"]],
    "thu": [["16:00", "23:00"]],
    "fri": [["16:00", "01:00"]],
    "sat": [["11:00", "01:00"]],
    "sun": [["11:00", "19:00"]]
  },
  "prices": [
    {"beer_name": "Domestic drafts (Bud, Bud Light)", "brand": "Anheuser-Busch", "format": "draft", "size_oz": null, "price": 4.00, "happy_hour_only": true},
    {"beer_name": "Corona", "brand": "Corona", "format": "can", "size_oz": 16, "price": 5.00, "happy_hour_only": true},
    {"beer_name": "Estrella", "brand": "Estrella", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": true},
    {"beer_name": "Corona Premier", "brand": "Corona", "format": "can", "size_oz": 12, "price": 3.00, "happy_hour_only": true}
  ],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": "happy hour menu", "deal_price": null, "discount": null, "free_text": "Happy Hour menu (embedded in site menu data): $4 Domestic Drafts (Bud, Bud Light), $5 Orange Crushes, $6 House Wines (Chateau Ste. Michelle rose & white, 14 Hands red), $4 traditional wings, $5 signature fries, $6 loaded nachos. Days/times NOT published."},
    {"days": [2], "start": "00:00", "end": "22:00", "applies_to": "tacos, margaritas, Corona/Estrella beers", "deal_price": null, "discount": null, "free_text": "Taco Tuesday, every Tuesday (listed 12:00 AM–10:00 PM): $2 tacos, $5 Social/frozen margaritas, $5 Chips and Salsa, $5 Corona 16oz cans, $5 Estrellas, $3 Corona Premier 12oz cans, plus karaoke. Offers not valid on Cardinals home game days."},
    {"days": [0, 1, 2, 3, 4, 5, 6], "start": "11:00", "end": "22:00", "applies_to": "beer buckets, beer towers, drafts on game days", "deal_price": null, "discount": null, "free_text": "Sports Watch, every day 11 AM–10 PM: $25 beer buckets and $30 Bud Light beer towers on football/CITY/Blues/Cardinals game days; $3 drafts from the 7th inning until close Monday–Thursday on Cards home game days; $25 buckets and $30 beer towers on Blues game days."},
    {"days": null, "start": null, "end": null, "applies_to": "domestic drafts, beer towers, buckets", "deal_price": null, "discount": null, "free_text": "Football watch parties (venue page): $30 bottomless domestic drafts, $30 bottomless beer towers*, $20 buckets — days/times not stated on the S&S page (BPV lists NFL watch parties Mon/Thu/Sun at Live! Arena)."}
  ],
  "obstacles": "Happy-hour schedule unpublished (menu exists, no days/times); draft sizes unstated; specials are game-day-conditional; 3% facilities fee on all checks. Verify HH times on-site."
}
```

### Paddy O's

Full site enumerated (about-us, FAQ, events, galleries, parking — no menu page
exists at all). FAQ and about-us both repeat the only schedule statement:
"Open three hours before St. Louis Cardinals' home games til last call on
drinks." No prices anywhere. Unchanged from pass 1, now exhaustively confirmed.

```json
{
  "slug": "paddy-os",
  "source_url": "https://stlpaddyos.com/faq/",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [
    {"days": null, "start": null, "end": null, "applies_to": null, "deal_price": null, "discount": null, "free_text": "Open three hours before St. Louis Cardinals' home games til last call on drinks. Live DJ at every Cardinals home game. No drink prices published."}
  ],
  "obstacles": "No menu page exists on the site (full link enumeration). Event-driven hours only. needs photo/manual"
}
```

### Broadway Oyster Bar

Pass-2 star. Found `hours.html` (linked only from JS): full 7-day bar hours.
Downloaded and OCR-read the drink-menu JPGs (`picts/bob-drink-menu1–3.jpg`) and
the happy-hour graphic (`broadwayoyster-bar-happy-hour-specials25.jpg`):

- Menu page 2 is the full BEER list — 20 bottle/can + 9 drafts with brewery and
  ABV, but NO prices printed (cocktails/wine pages are priced; beer is not).
- Happy hour: Monday–Friday 11am–4pm, $1.00 OFF draft beers, well drinks,
  Mezzacorona, Maggio Cabernet Sauvignon ("LIMITED TIME").
- "Biggs Nightcap" combo: choice of Budweiser or Stag + shot of Jameson (no price).

Third-party embed noted: Heartland POS ordering (`broadwayoysterbar.hrpos.heartland.us/menu`)
and Grubhub — not crawled.

```json
{
  "slug": "broadway-oyster-bar",
  "source_url": "https://www.broadwayoysterbar.com/drinkmenu1.html",
  "checked": "2026-09-04",
  "hours": {
    "sun": [["11:00", "01:30"]],
    "mon": [["11:00", "01:30"]],
    "tue": [["11:00", "01:30"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["11:00", "01:30"]]
  },
  "prices": [
    {"beer_name": "Budweiser", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Bud Light", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Bud Select", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Michelob Ultra", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Busch", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Busch Light", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Mango Cart", "brand": "Golden Road", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Coors Light", "brand": "Coors", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Miller Lite", "brand": "Miller", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Pabst Blue Ribbon", "brand": "Pabst", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Abita Amber", "brand": "Abita", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Stag", "brand": "Stag", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Modelo Especial", "brand": "Modelo", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Heineken", "brand": "Heineken", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Guinness", "brand": "Guinness", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "City Wide", "brand": "4 Hands", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Stella Artois", "brand": "Stella Artois", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Athletic IPA (N/A)", "brand": "Athletic Brewing", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Mango Cart (N/A)", "brand": "Golden Road", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Busch (N/A)", "brand": "Anheuser-Busch", "format": "bottle", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Zwickel (Bavarian Lager 5.1%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Octohaze (Hazy IPA 7%)", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Incarnation (American IPA 7%)", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Purple Haze (Fruit and Field 4.2%)", "brand": "Abita", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "American Brown (Brown Ale 4.8%)", "brand": "Civil Life", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Citrapolis (American IPA 7%)", "brand": "Modern Brewery", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "High Tide (Wheat Ale 5.5%)", "brand": "Logboat", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Bud Light (Lager 4.2%)", "brand": "Anheuser-Busch", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Yuengling (Lager 4.5%)", "brand": "Yuengling", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false}
  ],
  "specials": [
    {"days": [1, 2, 3, 4, 5], "start": "11:00", "end": "16:00", "applies_to": "draft beers, well drinks, Mezzacorona, Maggio Cabernet Sauvignon", "deal_price": null, "discount": 1.00, "free_text": "Happy Hour Monday–Friday 11am–4pm: $1.00 OFF draft beers, well drinks, Mezzacorona, Maggio Cabernet Sauvignon. Marked LIMITED TIME on the graphic."}
  ],
  "obstacles": "Beer roster complete (OCR of own-hosted menu images) but the beer page prints NO prices (cocktails/wine are priced; beer is not). 'Ask about our seasonal selection.' Menu subject to change; HH graphic says limited time. Hours page also lists 2026 early-open and closed dates. Third-party: Heartland POS ordering link. needs photo/manual for regular beer prices"
}
```

### Maggie O'Brien's

Still blocked: HTTP 403 Cloudflare interactive challenge on www and bare domain
with a full browser User-Agent. No crawlable assets. Needs a real browser.

```json
{
  "slug": "maggie-obriens",
  "source_url": "https://www.maggieobriens.com",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Cloudflare interactive challenge (403), browser UA retried. needs browser"
}
```

---

## Clayton / WashU

### Krueger's Bar

Full-menu hunt completed: the Wix site's `/menu` page ("All Time Favorites")
was rendered server-side and read in full — it is a priced FOOD menu only
(pretzel bites $7 … shrimp po' boy $12). The site has only Home / Menu / About;
no drink menu or beer roster exists anywhere on it. Regular beer prices remain
unpublished; happy hour from the homepage unchanged.

```json
{
  "slug": "kruegers-bar",
  "source_url": "https://www.kruegersbar.com/menu",
  "checked": "2026-09-04",
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
    {"days": [1, 2, 3, 4, 5], "start": "16:00", "end": "18:00", "applies_to": "domestic bottles, rail cocktails", "deal_price": 3.00, "discount": null, "free_text": "Happy Hour 4PM–6PM Monday–Friday: $3 Domestic Bottles, $4 Rail Cocktails"},
    {"days": [4], "start": null, "end": null, "applies_to": "tacos with drink purchase", "deal_price": null, "discount": null, "free_text": "Free tacos on Thursday with a drink purchase!"}
  ],
  "obstacles": "Site fully enumerated (Wix: Home/Menu/About): /menu is food-only with prices; no beer roster or regular beer prices exist online. needs photo/manual for regular beer prices"
}
```

---

## Summary

| Venue | Hours | # priced | # roster-only | # specials | Obstacle |
|---|---|---|---|---|---|
| Three Kings Public House | no | 0 | 0 | 0 | Cloudflare 403 — **needs browser** |
| Halo Bar (The Pageant) | no (show nights) | 0 | 0 | 1 (free_text) | no menu exists (only asset is a stage-specs PDF) — needs photo/manual |
| Session Taco – Delmar Loop | yes (6 days, Mon closed) | 0 | 0 | 1 | menu unpriced by design; beer → Untappd — needs photo/manual |
| Moonrise Hotel rooftop (Eclipse) | yes (7 days) | 26 | 0 | 1 | beer PDF found via WP media API but dated Feb 2024 — verify current |
| The W Karaoke Lounge | no | 0 | 0 | 0 | no web presence — needs photo/manual |
| PBR St. Louis: A Cowboy Bar | partial (Thu–Sat) | 0 | 0 | 1 | page images OCR'd = promo photos, no menu — needs photo/manual |
| Budweiser Brew House | no | 0 | 0 | 1 (free_text) | no venue page (404) / no own domain — needs photo/manual |
| Sports & Social St. Louis | yes (6 days, Mon unlisted) | 4 (all special-only) | 0 | 4 | HH menu extracted from embedded JSON but HH times unpublished |
| Paddy O's | no (game days only) | 0 | 0 | 1 (free_text) | site exhaustively enumerated: no menu page exists — needs photo/manual |
| Broadway Oyster Bar | yes (7 days) | 0 | 29 | 1 | full beer roster OCR'd from own menu images, but beer page prints no prices |
| Maggie O'Brien's | no | 0 | 0 | 0 | Cloudflare 403 — **needs browser** |
| Krueger's Bar | yes (7 days) | 1 (HH only) | 0 | 2 | /menu read in full: food-only; no regular beer prices online |

### Pass-2 totals (12 venues)

- **Hours:** 5 full (Moonrise, Session Taco*, Sports & Social*, Broadway Oyster
  Bar, Krueger's — * = one weekday closed/unlisted) + 1 partial (PBR Thu–Sat).
- **Priced rows:** 31 (Moonrise 26, Sports & Social 4 special-only, Krueger's 1 HH).
- **Roster-only rows (price null):** 29 (all Broadway Oyster Bar — 20 bottle/can + 9 draft).
- **Specials:** 13 rows across 9 venues.
- **New vs pass 1:** Moonrise full priced beer menu (26 rows, dated), Broadway
  Oyster Bar full roster + hours + HH details, Sports & Social HH/Taco-Tuesday
  beer prices + embedded menu, Halo/Paddy O's/Krueger's/Session Taco confirmed
  exhaustively empty of beer pricing.

### Still needs browser or photo visit

- **Needs browser (Cloudflare challenge):** Three Kings Public House, Maggie O'Brien's.
- **Needs photo/manual visit (no data online, confirmed at depth):** Halo Bar,
  The W Karaoke Lounge (also confirm trading), PBR St. Louis, Budweiser Brew
  House, Paddy O's, Session Taco (beer prices), Broadway Oyster Bar (beer
  prices — roster already captured), Krueger's (regular beer prices).
- **Verify on-site:** Moonrise beer prices (menu dated Feb 2024), Sports &
  Social happy-hour days/times.
