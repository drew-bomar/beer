# Pass 2 deep-crawl extraction — Soulard, Midtown/SLU, The Grove, Dogtown (BEE-32)

Second, deliberate sweep over the venues' OWN web presence: homepage link/asset
enumeration, platform tricks (WP uploads, Wix media, Squarespace), and downloading +
OCR-reading every menu-looking PDF/image. Checked 2026-09-04 via curl (browser UA
fallback on 403). Same conventions as pass 1 (`extraction-south.md`): 24h times,
`days` 0=Sun..6=Sat, record only what sources say. New in pass 2: `prices` rows with
`"price": null` are roster-only entries (beer confirmed offered, price unpublished).
Venues already complete in pass 1 (McGurk's, Molly's, Great Grizzly Bear) are omitted.

Headline finds: **HandleBar publishes a fully priced ~36-beer can list in a menu PDF**
(plus $1 Hamm's happy hour); **Duke's, Seamus McDaniel's, and Just John have live
official sites** pass 1 missed (hours found for all three); iTap's "draft menu JPG" is
actually a **live webcam of the tap chalkboards** (roster partly readable, no prices);
Big Daddy's 2026 menu PDF and Duke's 2026 menu images were read in full — food only.

---

## Soulard (`soulard`)

### 1860 Saloon, Game Room & Hardshell Café

Deep crawl found `/menu/` now serves the full FOOD menu inline (priced, apps ~$6–15,
pizza, sandwiches) — new vs. pass 1's Clover-embed dead end — but there is still no
beer/drink price anywhere on the site. Kitchen hours on the menu page:
11–10 Sun–Thu, 11–11 Fri–Sat (bar hours 11am–1:30am daily, from pass 1 homepage).
Happy hour line unchanged, no prices. Ordering = Clover (third-party, flagged).

```json
{
  "slug": "1860-saloon-game-room-hardshell-cafe",
  "source_url": "https://1860saloon.com/menu/",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["11:00", "01:30"]],
    "tue": [["11:00", "01:30"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["11:00", "01:30"]],
    "sun": [["11:00", "01:30"]]
  },
  "prices": [],
  "specials": [
    {
      "days": [1, 2, 3, 4, 5],
      "start": "15:00",
      "end": "18:00",
      "applies_to": "appetizers and drinks",
      "deal_price": null,
      "discount": null,
      "free_text": "Happy Hour: M-F 3 to 6 P.M. Appetizers and Drink Specials (no prices published)"
    }
  ],
  "obstacles": "Full food menu now inline+priced but zero drink/beer prices on site; online ordering is a Clover embed (flagged, not crawled) — beer prices still need photo/manual"
}
```

### Big Daddy's Soulard

Deep crawl surfaced the current menu PDF in WP uploads (dated folder `2026/05`:
`2026_11x17_SoulardBigDaddys_Menu.pdf`) — downloaded and read in full: **food only**,
no drinks section at all. Still no hours anywhere on the site. Specials as pass 1
(industry nights Mon/Tue 30% off tabs; poker Wed 7pm; DJs Fri/Sat 9pm–close).

```json
{
  "slug": "big-daddys-soulard",
  "source_url": "https://bigdaddyssoulardbar.com/wp-content/uploads/2026/05/2026_11x17_SoulardBigDaddys_Menu.pdf",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [],
  "specials": [
    {
      "days": [1, 2],
      "start": null,
      "end": null,
      "applies_to": "bar tabs (industry night)",
      "deal_price": null,
      "discount": null,
      "free_text": "30% Off Bar Tabs INDUSTRY NIGHTS Every Monday & Tuesday Night (no times published; percentage discount)"
    },
    {
      "days": null,
      "start": null,
      "end": null,
      "applies_to": null,
      "deal_price": null,
      "discount": null,
      "free_text": "Site mentions lunch specials and happy hour with no details; Poker Wednesdays 7pm; DJ Fri & Sat 9pm-close"
    }
  ],
  "obstacles": "Current 2026 menu PDF found and read in full: food only, no drinks pages; no hours published anywhere — beer prices need photo/manual"
}
```

### Duke's in Soulard

**New find: Duke's has a live official site** (https://www.dukesinsoulard.com — Wix;
pass 1 had "no web presence"). Full hours published. Menu = two Wix-hosted images
("DUKE'S — 2026 MENU PAGE 1/2 FINAL") — downloaded and OCR-read in full: **food only**
(apps, pizza, smash burgers, cajun, po'boys), no drink section. About page confirms
"top-shelf liquors, local & craft beer, 3 bars" but nothing itemized. Homepage was
fetched but not exhaustively scanned for specials (noting as unchecked).

```json
{
  "slug": "dukes-in-soulard",
  "source_url": "https://www.dukesinsoulard.com",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["11:00", "01:30"]],
    "tue": [["11:00", "01:30"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["10:00", "01:30"]],
    "sun": [["10:00", "00:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Site found (pass 1 missed it) and 2026 menu images read in full: food only, no drink prices; homepage specials scan left unchecked — beer prices need photo/manual"
}
```

### Hammerstone's

Deep crawl confirms pass 1: menu page "being updated", beer-list page still says only
"12 beers on tap inside, and 5 at our patio bar" with no list, no hours anywhere.
Only menu-ish asset in WP uploads is a 2018-dated `beers.jpg` (left unchecked —
seven years stale regardless).

```json
{"slug": "hammerstones", "source_url": "https://www.hammerstones.net", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "Confirmed dead end on deep crawl: no hours, no beer list, menu 'being updated'; only asset is a 2018 beers.jpg (unchecked, stale) — needs photo/manual"}
```

### International Tap House (iTap Soulard)

The pass-1 "draft menu JPG at a bare IP" was retrieved and read: it is a **live
webcam feed ("Soulard Tap Cam")** pointed at the draft chalkboards — refreshed
continuously (frame stamp 09/04/2026 11:20), so it is a real-time tap list, not a
menu file. Beer names + ABVs are legible on the boards; **no prices are written on
them**. Legible roster captured below (left board partly washed out by glare).
The bottle menu (`/soulard-menu-style`) is clean HTML with name/origin/ABV/**size**
for ~300 bottles across 20+ style sections — still **zero prices** (full parse not
committed here; the page is structured and re-scrapable at seed time). Hours remain
open-times-only (Mon–Thu 3pm, Fri 1pm, Sat 11am, Sun 11:30am — no close times).

```json
{
  "slug": "international-tap-house-soulard",
  "source_url": "http://69.28.91.151/itapsoulard/soulard_1.jpg",
  "checked": "2026-09-04",
  "hours": null,
  "prices": [
    {"beer_name": "Big Wave", "brand": "Kona", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Blueberry", "brand": "Old Bakery", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Pseudo Sue", "brand": "Toppling Goliath", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Space Camper", "brand": "Boulevard", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Mango Juicy Bits", "brand": "WeldWerks", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Juice Pants", "brand": "Maplewood", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Run Wild IPA (NA)", "brand": "Athletic", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Two Hearted IPA", "brand": "Bell's", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Going Places", "brand": "Hopewell", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Oktoberfest-Marzen", "brand": "Ayinger", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Oktoberfest Marzen", "brand": "Paulaner", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Dos Equis XX", "brand": "Dos Equis", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Pilsner Urquell", "brand": "Pilsner Urquell", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Pivo Pils", "brand": "Firestone Walker", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Premium Pils", "brand": "Bitburger", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "German Pilsner", "brand": "Veltins", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Labatt Blue", "brand": "Labatt", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "City Red", "brand": "Perennial", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Tank 7", "brand": "Boulevard", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false}
  ],
  "specials": [],
  "obstacles": "Draft 'menu' is a live tap-cam webcam frame (roster legible, changes daily, NO prices on boards; several boards glare-washed); ~300-bottle HTML list has name/origin/ABV/size but no prices; hours have no close times — prices need photo/manual"
}
```

Roster caveat: rows above are what was legible on the 2026-09-04 cam frame — this is
a rotating tap list, so treat as a snapshot, not a stable menu.

### Jack Nolen's

Re-crawled `/menu`: food-only confirmed again (only beer mention is a Busch beer-cheese
sauce). Hours unchanged from pass 1. No drinks page exists.

```json
{
  "slug": "jack-nolens",
  "source_url": "https://jacknolens.com/menu",
  "checked": "2026-09-04",
  "hours": {
    "tue": [["11:00", "22:00"]],
    "wed": [["11:00", "22:00"]],
    "thu": [["11:00", "22:00"]],
    "fri": [["11:00", "22:00"]],
    "sat": [["11:00", "22:00"]],
    "sun": [["11:00", "17:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Deep crawl confirms food-only menu; no beverage page exists — needs photo/manual"
}
```

### Cat's Meow

Facebook page retried once without login (browser UA): HTTP 400, hard login wall.

```json
{"slug": "cats-meow", "source_url": "https://www.facebook.com/p/The-Cats-Meow-Soulard-100057598833911/", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "Facebook-only presence; public page returns HTTP 400 without login — needs photo/manual visit"}
```

### Carson's Sports Bar

Domain probes found no official site (matches pass 1). Nothing to extract.

```json
{"slug": "carsons-sports-bar", "source_url": null, "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit; verify still trading"}
```

---

## Midtown / SLU (`midtown-slu`)

### Humphrey's Restaurant & Tavern ⭐

Drink-menu page still literally says "We are updating our menu / Please stay tuned".
Specials page re-confirmed the Tuesday deal (entry dated Tue Sep 8, labeled "EVERY
TUESDAY!"). Site platform is SpotHopper; ordering via tmt.spotapps.co (third-party,
flagged). Hours as pass 1 (Tue–Sat only stated).

```json
{
  "slug": "humphreys-restaurant-tavern",
  "source_url": "https://humphreysmidtown.com/specials",
  "checked": "2026-09-04",
  "hours": {
    "tue": [["11:00", "01:30"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["11:00", "01:30"]]
  },
  "prices": [],
  "specials": [
    {
      "days": [2],
      "start": "11:00",
      "end": "22:00",
      "applies_to": "selected beer cans + wings",
      "deal_price": 2,
      "discount": null,
      "free_text": "$6 WINGS & $2 CANS (selected). EVERY TUESDAY! 11:00 AM - 10:00 PM"
    }
  ],
  "obstacles": "Drink menu still 'updating' on deep crawl; SpotHopper-hosted site, ordering via tmt.spotapps.co (flagged, not crawled); Sun/Mon hours unstated — beer prices need photo/manual"
}
```

### Urban Chestnut Midtown Brewery & Biergarten

Known target: full tap roster captured (14 taps, name/style/ABV, list "changes
weekly"). No prices anywhere; food is a Square Online embed (flagged). Hours per
location page.

```json
{
  "slug": "urban-chestnut-midtown-brewery-biergarten",
  "source_url": "https://www.urbanchestnut.com/visit/midtown-biergarten",
  "checked": "2026-09-04",
  "hours": {
    "wed": [["16:00", "22:00"]],
    "thu": [["16:00", "22:00"]],
    "fri": [["12:00", "22:00"]],
    "sat": [["12:00", "22:00"]],
    "sun": [["12:00", "19:00"]]
  },
  "prices": [
    {"beer_name": "Knotty Pretzel Beer (Golden Pretzel Ale, 5.1%)", "brand": "O'Fallon", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "I Am St. Louis Pilsner (Pre-Prohibition Pilsner, 5.4%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Barbe Rouge (Pilsner, 4.9%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Squirrel Werks Hazy IPA (6.6%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Zwickel Light (Light Lager, 4.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Maibock (6.8%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Big Shark Grapefruit Radler (4.2%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Ku'damm (Berliner Weisse, 4.2%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Bushelhead (Cider, 5.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Stammtisch (German Pilsner, 5.4%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "STLIPA (Imperial IPA, 8.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Schnickelfritz (Bavarian Weissbier, 5.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Zwickel (Bavarian Lager, 5.1%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Dorfbier (Munich Dunkel, 4.8%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false}
  ],
  "specials": [],
  "obstacles": "Full 14-tap roster captured but unpriced (site states list changes weekly); food menu is a Square Online embed (flagged) — prices need photo/manual"
}
```

### Narwhal's Crafted

Menu page re-crawled: confirms "Draft & Craft Beer Available … focus on craft and
local" but the live menu is Toast-powered (menu JS + toasttab.com links) and renders
nothing without JS. No beer names or prices extractable. Hours unchanged (sitewide
"11am – Midnight, 7 days a week").

```json
{
  "slug": "narwhals-crafted",
  "source_url": "https://www.narwhalscrafted.com/menu/",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["11:00", "00:00"]],
    "tue": [["11:00", "00:00"]],
    "wed": [["11:00", "00:00"]],
    "thu": [["11:00", "00:00"]],
    "fri": [["11:00", "00:00"]],
    "sat": [["11:00", "00:00"]],
    "sun": [["11:00", "00:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Live menu is Toast-powered (toasttab.com; flagged, not crawled) and JS-only; beer confirmed offered but no names/prices extractable — needs photo/manual"
}
```

---

## The Grove (`grove`)

### La Calle ⭐

Pass-2 goal achieved: the **complete drink menu** was extracted from the SpotHopper
drink-menu page. Result: beer really is category-priced only — Domestic $4.50 /
Mex Beer $5.50 / High Noon $7 — there is **no per-brand beer list on the site at
all**. Margarita/cocktail lineup and pitchers ($24–42, display-only per product
rules) captured for completeness. Specials page still a dated calendar (Taco
Thursday entry dated Thu Sep 10). Hours as pass 1 (Thu–Sun 5pm–1:30am).

```json
{
  "slug": "la-calle",
  "source_url": "https://lacallestl.com/st-louis-the-grove-la-calle-drink-menu",
  "checked": "2026-09-04",
  "hours": {
    "thu": [["17:00", "01:30"]],
    "fri": [["17:00", "01:30"]],
    "sat": [["17:00", "01:30"]],
    "sun": [["17:00", "01:30"]]
  },
  "prices": [
    {"beer_name": "Domestic Beer (category)", "brand": null, "format": null, "size_oz": null, "price": 4.50, "happy_hour_only": false},
    {"beer_name": "Mexican Beer (category)", "brand": null, "format": null, "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "High Noon (seltzer)", "brand": "High Noon", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Beergarita", "brand": null, "format": null, "size_oz": null, "price": 12.00, "happy_hour_only": false},
    {"beer_name": "Michelada", "brand": null, "format": null, "size_oz": null, "price": 12.00, "happy_hour_only": false}
  ],
  "specials": [
    {
      "days": [4],
      "start": "16:00",
      "end": "01:30",
      "applies_to": "tacos, house shots, margaritas",
      "deal_price": null,
      "discount": null,
      "free_text": "Taco Thursday: $3 Tacos, $4 House shots, $8 Margaritas, 04:00 PM - 01:30 AM (from dated calendar entry Thu Sep 10; recurring weekly implied by calendar but not stated as a static schedule)"
    }
  ],
  "obstacles": "Full drink menu extracted — confirms category-level beer pricing only (no brand list/format/size exists on site); margarita pitchers $24-42 are display-only (never rank). Nothing further to extract online"
}
```

### HandleBar

**Best result of pass 2.** The Wix deep crawl surfaced (a) the happy-hour poster
image full-size and (b) a 14-page menu PDF (`/_files/ugd/6887b3_1cb970d1…pdf`) —
both downloaded and read. The PDF contains a **fully priced canned-beer list**
(~36 beers + ciders + N/A), happy hour, weekly specials, and combo deals.
Happy hour: **$3 wells | $1 Hamm's | half-price pizza — every day til 6p, all day
Monday.** Other standing deals: Four Roses Fridays $4; $4 Mystery Cans (beer/
seltzer/cocktail); "Hamm's Sandwich" 2 Hamm's + well shot $6; "Hot Hamm & Cheese"
$6; 10% off for neighbors/students/cyclists every night til 10p. N/A beers on the
menu ($6–10: Athletic, Best Day, Guinness 0, Wellbeing x3, 4 Hands City Wide NA)
and THC/CBD cans excluded from rows below. PDF marks some beers "16OZ TALLBOY" and
some "LOCAL" with symbols that are indistinguishable in extraction — so `size_oz`
left null throughout (many are 16oz tallboys).

```json
{
  "slug": "handlebar",
  "source_url": "https://www.handlebarstl.com/_files/ugd/6887b3_1cb970d1b3a14a49895b02de10910137.pdf",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["16:00", "02:30"]],
    "wed": [["16:00", "02:30"]],
    "thu": [["16:00", "02:30"]],
    "fri": [["15:00", "02:30"]],
    "sat": [["15:00", "02:30"]],
    "sun": [["15:00", "02:30"]]
  },
  "prices": [
    {"beer_name": "Hamm's", "brand": "Hamm's", "format": "can", "size_oz": null, "price": 3.00, "happy_hour_only": false},
    {"beer_name": "Hamm's (happy hour)", "brand": "Hamm's", "format": "can", "size_oz": null, "price": 1.00, "happy_hour_only": true},
    {"beer_name": "Coors Light", "brand": "Coors", "format": "can", "size_oz": null, "price": 4.00, "happy_hour_only": false},
    {"beer_name": "Montucky Cold Snacks", "brand": "Montucky", "format": "can", "size_oz": null, "price": 4.00, "happy_hour_only": false},
    {"beer_name": "PBR", "brand": "Pabst", "format": "can", "size_oz": null, "price": 4.00, "happy_hour_only": false},
    {"beer_name": "Yuengling Flight", "brand": "Yuengling", "format": "can", "size_oz": null, "price": 4.00, "happy_hour_only": false},
    {"beer_name": "Hopewell Lil Buddy", "brand": "Hopewell", "format": "can", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Miller Lite", "brand": "Miller", "format": "can", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Stag", "brand": "Stag", "format": "can", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Logboat Dark Matter", "brand": "Logboat", "format": "can", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Corona", "brand": "Corona", "format": "can", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Modelo Especial", "brand": "Modelo", "format": "can", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "UCBC Zwickel", "brand": "Urban Chestnut", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "UCBC Schnickelfritz", "brand": "Urban Chestnut", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "3 Floyds Gumballhead", "brand": "3 Floyds", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "3 Floyds Zombie Dust", "brand": "3 Floyds", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Blue Moon", "brand": "Blue Moon", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Schlafly Raspberry Hefeweizen", "brand": "Schlafly", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Heineken", "brand": "Heineken", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Peroni", "brand": "Peroni", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "2nd Shift Technical Ecstasy", "brand": "2nd Shift", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "4 Hands City Wide Light", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "4 Hands City Wide APA", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "4 Hands Octohaze", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "4 Hands Single Speed", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Modern Disco Punch", "brand": "Modern Brewery", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Prairie Rainbow Sherbet", "brand": "Prairie", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Schlafly Just a Little Bit Hazy", "brand": "Schlafly", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "2nd Shift Hibiscus Wit", "brand": "2nd Shift", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Heavy Riff Squeezebox", "brand": "Heavy Riff", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Heavy Riff Love Gun", "brand": "Heavy Riff", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Heavy Riff Velvet Underbrown", "brand": "Heavy Riff", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "4 Hands Absence of Light", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Prairie Blueberry Boyfriend", "brand": "Prairie", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "Perennial Saison de Lis", "brand": "Perennial", "format": "can", "size_oz": null, "price": 9.00, "happy_hour_only": false},
    {"beer_name": "2nd Shift Little Big Hop", "brand": "2nd Shift", "format": "can", "size_oz": null, "price": 10.00, "happy_hour_only": false},
    {"beer_name": "4 Hands Flamingo Dance Party", "brand": "4 Hands", "format": "can", "size_oz": null, "price": 10.00, "happy_hour_only": false},
    {"beer_name": "Perennial Poolside Breeze", "brand": "Perennial", "format": "can", "size_oz": null, "price": 10.00, "happy_hour_only": false},
    {"beer_name": "Prairie Slush", "brand": "Prairie", "format": "can", "size_oz": null, "price": 10.00, "happy_hour_only": false},
    {"beer_name": "Main & Mill Fruit Drops", "brand": "Main & Mill", "format": "can", "size_oz": null, "price": 11.00, "happy_hour_only": false},
    {"beer_name": "Modern Citropolis", "brand": "Modern Brewery", "format": "can", "size_oz": null, "price": 11.00, "happy_hour_only": false},
    {"beer_name": "Narrow Gauge Fallen Flag", "brand": "Narrow Gauge", "format": "can", "size_oz": null, "price": 15.00, "happy_hour_only": false},
    {"beer_name": "Brick River cider (sweet lou / cornerstone)", "brand": "Brick River", "format": "can", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Waves strawberry rose cider", "brand": "Waves", "format": "can", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Mystery Can (canned cocktail, seltzer, or beer)", "brand": null, "format": "can", "size_oz": null, "price": 4.00, "happy_hour_only": false}
  ],
  "specials": [
    {
      "days": [0, 1, 2, 3, 4, 5, 6],
      "start": null,
      "end": "18:00",
      "applies_to": "wells, Hamm's, pizza",
      "deal_price": 1,
      "discount": null,
      "free_text": "HAPPY HOUR: $3 WELLS | $1 HAMM'S | HALF PRICE PIZZA — EVERY DAY TIL 6P (start = open; deal_price refers to Hamm's)"
    },
    {
      "days": [1],
      "start": null,
      "end": null,
      "applies_to": "wells, Hamm's, pizza (all day)",
      "deal_price": 1,
      "discount": null,
      "free_text": "ALL DAY HAPPY HOUR every Monday: 1/2 off pizza, $1 Hamm's, $3 wells"
    },
    {
      "days": [5],
      "start": null,
      "end": null,
      "applies_to": "Four Roses bourbon",
      "deal_price": 4,
      "discount": null,
      "free_text": "FOUR ROSES FRIDAYS - $4 (no times stated)"
    },
    {
      "days": [0, 1, 2, 3, 4, 5, 6],
      "start": null,
      "end": "22:00",
      "applies_to": "whole tab (neighbors, students, cyclists)",
      "deal_price": null,
      "discount": null,
      "free_text": "10% DISCOUNT FOR NEIGHBORS, STUDENTS, & CYCLISTS every night til 10p (must show ID and/or bicycle; percentage discount)"
    }
  ],
  "obstacles": "PDF marks 16oz-tallboy and local items with visually identical symbols (sizes not reliably attributable, size_oz left null); draft/tap beers (Untappd-tracked) still unpriced online. Otherwise fully extracted"
}
```

### Urban Chestnut Grove Brewery & Bierhall

Known target: full tap roster captured (19 taps, name/style/ABV, "changes weekly").
No prices. Food = Fordo's Killer Pizza PDF (kitchen tenant; food-only). Hours per
location page (note: page carries a stale "*open until 10pm on Sunday 1/18" footnote).

```json
{
  "slug": "urban-chestnut-grove-brewery-bierhall",
  "source_url": "https://www.urbanchestnut.com/visit/the-grove-brewery-and-bierhall",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["15:00", "22:00"]],
    "tue": [["15:00", "22:00"]],
    "wed": [["15:00", "22:00"]],
    "thu": [["11:00", "22:00"]],
    "fri": [["11:00", "00:00"]],
    "sat": [["11:00", "00:00"]],
    "sun": [["11:00", "21:00"]]
  },
  "prices": [
    {"beer_name": "Zwickel (Bavarian Lager, 5.1%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Wolpertinger 2019 Barleywine (11.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Urban Underdog American Lager (4.7%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Tangerine Radler (Light Lager, 4.2%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "STLIPA (Imperial IPA, 8.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Stammtisch (German Pilsner, 5.4%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Squirrel Werks Hazy IPA (6.6%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Schnickelfritz (Bavarian Weissbier, 5.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "O-Katz (Oktoberfest Lager, 5.4%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Knotty Pretzel Beer (Golden Pretzel Ale, 5.1%)", "brand": "O'Fallon", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Dad's Original Oatmeal Stout (5.9%)", "brand": "O'Fallon", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "5 Day IPA (American IPA, 6.1%)", "brand": "O'Fallon", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Maibock (6.8%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Ku'damm (Berliner Weisse, 4.2%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Konomi (Japanese Ale, 5.4%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Fest Bier (Festival Pale Lager, 5.9%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Dorfbier (Munich Dunkel, 4.8%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Bushelhead (Cider, 5.0%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false},
    {"beer_name": "Annie's Irish Red (4.6%)", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": null, "happy_hour_only": false}
  ],
  "specials": [],
  "obstacles": "Full 19-tap roster captured but unpriced (list changes weekly); food menu is a Fordo's PDF (food only) — prices need photo/manual"
}
```

### The Gramophone

**Partial new find:** gramophonestl.com resolves — it redirects to
`gramophonestl.toast.site` (a Toast-hosted venue site), which returns HTTP 403 to
fetchers. So the venue does have an official web presence, but it's unreadable
without a browser. Provider: Toast (flagged).

```json
{"slug": "the-gramophone", "source_url": "https://gramophonestl.com", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "Official domain redirects to Toast-hosted site (gramophonestl.toast.site) which 403s fetchers even with browser UA — needs browser"}
```

### Just John Nightclub

**New find: live official site** https://www.justjohnclub.com (Squarespace; pass 1
had none). Full hours published. Food page is a pizza menu whose prices live in an
image (columns "8in SM / 12in LG" with no extractable dollar amounts). Specials page
is an unfinished placeholder ("Services 3"). No drink prices anywhere;
/entertainment left unchecked.

```json
{
  "slug": "just-john-nightclub",
  "source_url": "https://www.justjohnclub.com",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["14:00", "01:30"]],
    "tue": [["14:00", "03:00"]],
    "wed": [["14:00", "03:00"]],
    "thu": [["14:00", "03:00"]],
    "fri": [["14:00", "03:00"]],
    "sat": [["14:00", "03:00"]],
    "sun": [["12:00", "01:30"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Site found (pass 1 missed it): hours captured; pizza-menu prices are in an image (not extracted); specials page is a placeholder; no drink prices; /entertainment unchecked — beer prices need photo/manual"
}
```

---

## Dogtown (`dogtown`)

### Nick's Pub ⭐

Deep crawl of `/menu` confirms pass-1 data (HH windows + $15 buckets / $8 pitchers
inline) and adds food-menu availability hours (Mon–Fri 11am–12am, Sat–Sun 5pm–12am).
A `/beer` URL 404s; the 99-tap list is still only the linked TapHunter page
(taphunter.com/location/nicks-pub/5336425427894272 — flagged, not crawled). No
per-draft prices exist on the site itself. Hours/prices/specials JSON unchanged from
pass 1 (see `extraction-south.md`) — not repeated here except the pointer row:

```json
{"slug": "nicks-pub", "source_url": "https://www.nicksirishpub.com/menu", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "Pass-1 record stands (hours + $15 bucket/$8 pitcher HH specials); deep crawl adds nothing new: /beer 404s, tap list is TapHunter (flagged) — per-draft prices need photo/manual. hours:null here means 'no change', see pass-1 entry"}
```

### Seamus McDaniel's

**New find: live official site** https://seamusmcdaniels.com (GoDaddy builder;
pass 1 had none). Kitchen hours published (bar hours only as a dynamic "Open today
11:00 am – 01:30 am" widget — captured Thu 2026-09-04, not a full weekly bar
schedule). Ordering/menu is Square Online (seamus-mcdaniels.square.site — flagged,
not crawled). No prices on the site itself. Hours below are KITCHEN hours.

```json
{
  "slug": "seamus-mcdaniels",
  "source_url": "https://seamusmcdaniels.com",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["11:00", "22:00"]],
    "tue": [["11:00", "22:00"]],
    "wed": [["11:00", "22:00"]],
    "thu": [["11:00", "22:00"]],
    "fri": [["11:00", "22:00"]],
    "sat": [["11:00", "22:00"]],
    "sun": [["11:00", "20:00"]]
  },
  "prices": [],
  "specials": [
    {
      "days": [5, 6],
      "start": "22:00",
      "end": "00:00",
      "applies_to": "late night appetizers",
      "deal_price": null,
      "discount": null,
      "free_text": "Late Night Appetizers Friday - Saturday 10:00 pm - 12:00 am (availability, not a price deal)"
    }
  ],
  "obstacles": "Site found (pass 1 missed it) but hours above are KITCHEN hours; bar hours only shown as dynamic 'Open today 11am-1:30am'; menu/ordering is Square Online (flagged) — beer prices need photo/manual"
}
```

### Felix's Pizza Pub

Retried with full browser UA + headers: still HTTP 403 (Cloudflare-style block) on
both attempts. Pass-1 hours (fetched via WebFetch, which got through) stand.

```json
{"slug": "felixs-pizza-pub", "source_url": "https://felixspizzapub.com", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "HTTP 403 to curl even with browser UA (pass-1 WebFetch hours stand) — NEEDS BROWSER for menu/drink hunt"}
```

### The Pat Connolly Tavern

Menu page (Squarespace) re-crawled and read in full: complete priced FOOD menu
(apps/small plates/big plates), **zero drink items**. The pass-1 "HAPPY HOUR
Specials" heading was not found on the menu page; homepage re-scan left unchecked.
Hours unchanged from pass 1.

```json
{
  "slug": "the-pat-connolly-tavern",
  "source_url": "https://www.patconnollytavern.com/menu",
  "checked": "2026-09-04",
  "hours": {
    "mon": [["17:00", "22:00"]],
    "tue": [["11:30", "01:00"]],
    "wed": [["11:30", "01:00"]],
    "thu": [["11:30", "01:00"]],
    "fri": [["11:30", "01:30"]],
    "sat": [["11:30", "01:30"]],
    "sun": [["11:30", "22:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Menu page fully read: food-priced only, no drinks; happy-hour details still unpublished (homepage re-scan unchecked) — beer prices need photo/manual"
}
```

### Heavy Riff Brewing Co.

Retried with browser UA + full headers: still HTTP 403 on both hosts. (Their beers
ARE priced as guest cans at HandleBar — $9 Squeezebox/Love Gun/Velvet Underbrown —
but that's HandleBar's pricing, not the taproom's.)

```json
{"slug": "heavy-riff-brewing", "source_url": "https://heavyriffbrewing.com", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "HTTP 403 with browser UA on 2 attempts (pass 1 + pass 2) — NEEDS BROWSER"}
```

### Tamm Avenue Bar

Facebook page retried once without login: HTTP 400, login wall.

```json
{"slug": "tamm-avenue-bar", "source_url": "https://www.facebook.com/tammavebar", "checked": "2026-09-04", "hours": null, "prices": [], "specials": [], "obstacles": "Facebook-only presence; public page returns HTTP 400 without login — needs photo/manual visit"}
```

---

## Summary

| Venue | Hours | # priced | # roster-only | # specials | Obstacle |
|---|---|---|---|---|---|
| 1860 Saloon | yes (daily) | 0 | 0 | 1 | food menu now inline+priced; drinks = Clover embed |
| Big Daddy's Soulard | no | 0 | 0 | 2 | 2026 menu PDF read — food only; no hours |
| Duke's in Soulard | **yes (new)** | 0 | 0 | 0 | site found; 2026 menu images read — food only |
| Hammerstone's | no | 0 | 0 | 0 | confirmed dead end; menu "being updated" |
| iTap Soulard | partial (opens only) | 0 | 19 | 0 | draft "menu" = live tap-cam (no prices); 300-bottle list unpriced |
| Jack Nolen's | yes | 0 | 0 | 0 | food-only menu confirmed |
| Cat's Meow | no | 0 | 0 | 0 | Facebook login wall (HTTP 400) |
| Carson's Sports Bar | no | 0 | 0 | 0 | no web presence |
| Humphrey's ⭐ | partial (Tue–Sat) | 0 | 0 | 1 | drink menu still "updating"; SpotHopper/spotapps |
| UCBC Midtown | yes (Wed–Sun) | 0 | 14 | 0 | full tap roster captured, unpriced |
| Narwhal's Crafted | yes (generic) | 0 | 0 | 0 | live menu = Toast (flagged) |
| La Calle ⭐ | yes (Thu–Sun) | 5 | 0 | 1 | full drink menu extracted — beer is category-priced only |
| HandleBar | yes | **45** | 0 | 4 | **fully priced can list from menu PDF**; only sizes ambiguous |
| UCBC Grove | yes | 0 | 19 | 0 | full tap roster captured, unpriced |
| The Gramophone | no | 0 | 0 | 0 | Toast-hosted site found but 403s — needs browser |
| Just John | **yes (new)** | 0 | 0 | 0 | site found; pizza prices in image; no drink prices |
| Nick's Pub ⭐ | (pass 1 stands) | 0 | 0 | 0 | /beer 404; taps = TapHunter (flagged) |
| Seamus McDaniel's | **yes (new, kitchen)** | 0 | 0 | 1 | site found; menu = Square Online (flagged) |
| Felix's Pizza Pub | (pass 1 stands) | 0 | 0 | 0 | 403 with browser UA — **needs browser** |
| Pat Connolly Tavern | yes | 0 | 0 | 0 | menu fully read — food only |
| Heavy Riff Brewing | no | 0 | 0 | 0 | 403 with browser UA — **needs browser** |
| Tamm Avenue Bar | no | 0 | 0 | 0 | Facebook login wall (HTTP 400) |

### Totals (pass 2, this file)

- **Priced rows: 50** — HandleBar 45 (incl. $1 HH Hamm's, 2 ciders, mystery can), La Calle 5.
- **Roster-only (price:null) rows: 52** — iTap tap-cam 19, UCBC Midtown 14, UCBC Grove 19.
- **Specials: 10 entries** across 7 venues (HandleBar's 4 are the newly structured ones).
- **New hours found: 3 venues** pass 1 had nothing for (Duke's, Just John, Seamus
  McDaniel's — all via newly-discovered official sites).

### Still needs browser (blocked to fetchers)

Felix's Pizza Pub, Heavy Riff Brewing, The Gramophone (Toast-hosted 403). Also
Three Kings (Loop, from shortlist) if in scope of the browser pass.

### Still needs a photo / in-person visit for beer prices

Everyone except HandleBar and (category-level) La Calle: 1860, Big Daddy's, Duke's,
Hammerstone's, iTap (per-draft/bottle prices), Jack Nolen's, Cat's Meow (also
confirm trading), Carson's (also confirm trading), Humphrey's, both UCBCs
(tap prices), Narwhal's, Gramophone, Just John, Nick's (per-draft prices),
Seamus McDaniel's, Felix's, Pat Connolly, Heavy Riff, Tamm Avenue Bar.

### Left deliberately unchecked in this pass (noted per-venue)

Duke's homepage specials scan; Just John `/entertainment`; Pat Connolly homepage HH
re-scan; Hammerstone's 2018 `beers.jpg`; full parse of iTap's ~300-bottle HTML list
(structured name/origin/ABV/size — cheap to script at seed time).
