# Online-data extraction — Soulard, Midtown/SLU, The Grove, Dogtown (BEE-32)

Extraction sweep of venues' OWN web presence (sites + their linked menu pages only;
no Google Maps / Untappd / Yelp scraping). Checked 2026-09-03 via WebFetch.
Record-only-what-the-page-says rules applied: no inferred hours or typical-ized
prices. `hours` uses 24h times, keys mon..sun, closed days omitted, end < start
means past midnight. Specials `days` use ints 0–6, 0 = Sunday.

---

## Soulard (`soulard`)

### Molly's in Soulard ⭐

Bar hours published on homepage (bar open to 1:30am daily; kitchen closes earlier).
Happy hour Tue–Fri 3–7pm: "$1 OFF ALL DRINKS" (site notes it excludes Monday
because the kitchen is closed). Drink menu page (`/drinks`) is menu **images** —
no readable prices anywhere. Needs photo/manual for prices.

```json
{
  "slug": "mollys-in-soulard",
  "source_url": "https://www.mollysinsoulard.com",
  "checked": "2026-09-03",
  "hours": {
    "mon": [["15:00", "01:30"]],
    "tue": [["11:00", "01:30"]],
    "wed": [["11:00", "01:30"]],
    "thu": [["11:00", "01:30"]],
    "fri": [["11:00", "01:30"]],
    "sat": [["10:00", "01:30"]],
    "sun": [["10:00", "01:30"]]
  },
  "prices": [],
  "specials": [
    {
      "days": [2, 3, 4, 5],
      "start": "15:00",
      "end": "19:00",
      "applies_to": "all drinks",
      "deal_price": null,
      "discount": 1,
      "free_text": "Happy Hour Tuesday - Friday 3pm to 7pm: $1 OFF ALL DRINKS; $2 oysters at patio bar only (excludes Monday due to kitchen being closed)"
    }
  ],
  "obstacles": "Drink menu page is menu images with no readable text/prices — needs photo/manual"
}
```

### John D. McGurk's Irish Pub ⭐

Best result of the sweep: full per-beer priced list, inline HTML on
`/food-drinks/`. 14 drafts ($6–8.75, Guinness listed at 20 oz) + 19 bottles/cans
($5–8). Closed Mondays. No happy hour published.

```json
{
  "slug": "john-d-mcgurks-irish-pub",
  "source_url": "https://mcgurks.com/food-drinks/",
  "checked": "2026-09-03",
  "hours": {
    "tue": [["16:00", "01:30"]],
    "wed": [["16:00", "01:30"]],
    "thu": [["16:00", "01:30"]],
    "fri": [["11:30", "01:30"]],
    "sat": [["11:30", "01:30"]],
    "sun": [["11:30", "00:00"]]
  },
  "prices": [
    {"beer_name": "Incarnation IPA", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Contact High Wheat Ale", "brand": "4 Hands", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Honey Crisp Cider", "brand": "Brick River", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Budweiser Lager", "brand": "Budweiser", "format": "draft", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Guinness Irish Stout", "brand": "Guinness", "format": "draft", "size_oz": 20, "price": 8.75, "happy_hour_only": false},
    {"beer_name": "Big Wave Golden Ale", "brand": "Kona", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Mango Cart Mango Wheat", "brand": "Golden Road", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "McGurk's Irish Red Ale", "brand": "McGurk's", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "McGurk's Irish Stout", "brand": "McGurk's", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Michelob ULTRA Light Lager", "brand": "Michelob", "format": "draft", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Modelo Mexican Lager", "brand": "Modelo", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Squirrel Werks Hazy IPA", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Zwickel Bavarian Lager", "brand": "Urban Chestnut", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Yuengling Lager", "brand": "Yuengling", "format": "draft", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "City Wide APA", "brand": "4 Hands", "format": "bottle", "size_oz": null, "price": 7.00, "happy_hour_only": false},
    {"beer_name": "Blue Moon", "brand": "Blue Moon", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Bud Light", "brand": "Budweiser", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Bud Select", "brand": "Budweiser", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Budweiser", "brand": "Budweiser", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Busch", "brand": "Busch", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Busch Light", "brand": "Busch", "format": "bottle", "size_oz": null, "price": 5.00, "happy_hour_only": false},
    {"beer_name": "Carbliss Lemon Lime Seltzer", "brand": "Carbliss", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Corona Mexican Lager", "brand": "Corona", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false},
    {"beer_name": "Harp Lager", "brand": "Harp", "format": "bottle", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "High Noon Pineapple Seltzer", "brand": "High Noon", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Magners Cider", "brand": "Magners", "format": "bottle", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Michelob Golden", "brand": "Michelob", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Michelob Ultra", "brand": "Michelob", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "Miller Lite", "brand": "Miller", "format": "bottle", "size_oz": null, "price": 5.50, "happy_hour_only": false},
    {"beer_name": "NUTRL Orange Seltzer", "brand": "NUTRL", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Ole Chili Mango", "brand": "Ole", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Surfside Blueberry Lemonade", "brand": "Surfside", "format": "can", "size_oz": null, "price": 8.00, "happy_hour_only": false},
    {"beer_name": "Yuengling Flight", "brand": "Yuengling", "format": "bottle", "size_oz": null, "price": 6.00, "happy_hour_only": false}
  ],
  "specials": [],
  "obstacles": null
}
```

Notes: sizes not stated except Guinness 20 oz — mark others `size_assumed` at
seed time. "Beer & Cider" section doesn't distinguish bottle vs can per item;
bottle/can assignment above follows typical packaging for the brand as listed —
verify at seed. Seltzers ($8 Carbliss/High Noon/NUTRL/Surfside/Ole) and ciders
included for completeness; filter for beer-ranking as needed. Mango Cart is
listed on-site as "Mango Cart Mango Wheat" (brand Golden Road inferred from name
only — the menu itself just says "Mango Cart").

### Great Grizzly Bear ⭐

Hours daily 11am–midnight. Drink menu is inline HTML with a full tap/bottle
lineup — but **no prices**. Specials page is a dated events calendar showing
happy hour 2–6pm on every weekday entry (Sep 3, 4, 7, 8, 9 = Thu, Fri, Mon,
Tue, Wed) with priced deals.

```json
{
  "slug": "great-grizzly-bear",
  "source_url": "https://greatgrizzlystl.com",
  "checked": "2026-09-03",
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
  "specials": [
    {
      "days": [1, 2, 3, 4, 5],
      "start": "14:00",
      "end": "18:00",
      "applies_to": "happy hour: domestic beer, drafts, well drinks, select shots",
      "deal_price": null,
      "discount": null,
      "free_text": "$3 Domestic Beer, $4 Drafts, $4 Well Drinks, and $5 shots of Jager, Milagro, Fireball, or Tullamore Dew. Days derived from specials-page calendar entries (Thu 9/3, Fri 9/4, Mon 9/7, Tue 9/8, Wed 9/9, all 2:00-6:00 PM); page does not state 'Mon-Fri' explicitly"
    }
  ],
  "obstacles": "Drink menu is inline HTML with full draft/tallboy/bottle/seltzer lineup but zero prices; happy-hour page is a dated calendar, not a static schedule — needs photo/manual for regular beer prices"
}
```

Beer list (unpriced, for reference): drafts — Brick River Crisp Apple, Bud
Light, Busch Light, Goose Island Hazy Beer Hug, Kona Big Wave, Michelob Ultra,
Modelo Especial, Stella Artois, Yuengling, Blue Moon, Golden Road Mango Cart.
16oz tall boys — Busch, Busch Light, Guinness, Iron Hops Battle Brew IPA, Iron
Hops Ka-Kaw Lager, Leinenkugel's Summer Shandy, PBR, Stag, 4 Hands City Wide,
4 Hands Parker Pilsner. 12oz bottles — Bud Light, Bud Light Lime, Bud Select,
Budweiser, Busch, Busch Light, Coors Banquet, Coors Light, Corona, Coronita.
7oz bottles — Michelob Golden Light, Michelob Ultra, Miller Lite, Modelito,
Modelo Negra. Plus 12oz seltzers/hard teas.

### 1860 Saloon, Game Room & Hardshell Café

Homepage states "Open Daily 11 A.M. to 1:30 A.M." and "Happy Hour: M-F 3 to
6 P.M. Appetizers and Drink Specials" (no prices). Menu lives in a Clover
online-ordering embed — not readable.

```json
{
  "slug": "1860-saloon-game-room-hardshell-cafe",
  "source_url": "https://www.1860saloon.com",
  "checked": "2026-09-03",
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
  "obstacles": "Menu is a Clover online-ordering embed (clover.com) — needs photo/manual for beer prices"
}
```

### Big Daddy's Soulard

No hours anywhere on the site. Menu page offers a downloadable PDF plus menu
images — unreadable. Homepage lists recurring nights, incl. 30% off bar tabs on
industry nights (Mon/Tue), no times given.

```json
{
  "slug": "big-daddys-soulard",
  "source_url": "https://bigdaddyssoulardbar.com",
  "checked": "2026-09-03",
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
      "free_text": "30% Off Bar Tabs INDUSTRY NIGHTS Every Monday & Tuesday Night (no times published; percentage discount, not $ off)"
    },
    {
      "days": null,
      "start": null,
      "end": null,
      "applies_to": null,
      "deal_price": null,
      "discount": null,
      "free_text": "Site mentions 'great lunch specials, happy hour' with no details; Poker Night Wednesdays 7pm; DJ Fri & Sat 9pm-close"
    }
  ],
  "obstacles": "No hours published; menu is PDF + images — needs photo/manual"
}
```

### Duke's in Soulard

No web presence (no official site found; shortlist Website = null). Nothing to
extract — needs an in-person/photo visit, and confirm it's still trading.

```json
{"slug": "dukes-in-soulard", "source_url": null, "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit; verify still trading"}
```

### Hammerstone's

Site up but thin: menu page says "Our menu is being updated"; beer-list page
says "12 beers on tap inside, and 5 at our patio bar" with no beers, prices, or
hours listed anywhere.

```json
{
  "slug": "hammerstones",
  "source_url": "https://www.hammerstones.net",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Menu 'being updated'; beer-list page has no actual list; no hours published — needs photo/manual"
}
```

### International Tap House (iTap Soulard)

Location page lists opening times only, **no closing times** (Mon–Thu 3pm,
Fri 1pm, Sat 11am, Sun 11:30am) — can't build an hours JSON from that. Draft
menu is a **JPG hosted at a bare IP** (http://69.28.91.151/itapsoulard/soulard_1.jpg);
bottle menu is HTML (~300+ bottles with brand/origin/ABV/size) but **no prices**.

```json
{
  "slug": "international-tap-house-soulard",
  "source_url": "https://internationaltaphouse.com/soulard",
  "checked": "2026-09-03",
  "hours": null,
  "prices": [],
  "specials": [],
  "obstacles": "Hours show open times only (Mon-Thu 3pm, Fri 1pm, Sat 11am, Sun 11:30am), no close times; draft menu is a JPG image at a bare IP; bottle list is HTML but unpriced — needs photo/manual"
}
```

### Jack Nolen's

Hours published. Online menu is food-only (burgers/sandwiches/sides), no
beverage section at all.

```json
{
  "slug": "jack-nolens",
  "source_url": "https://jacknolens.com",
  "checked": "2026-09-03",
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
  "obstacles": "Online menu is food-only; no beverage menu published — needs photo/manual for beer prices"
}
```

### Cat's Meow

Facebook-only presence; the public page renders nothing without login (name
only, no hours/prices/specials visible to a fetcher).

```json
{"slug": "cats-meow", "source_url": "https://www.facebook.com/p/The-Cats-Meow-Soulard-100057598833911/", "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "Facebook-only presence, content behind login wall — needs photo/manual visit"}
```

### Carson's Sports Bar

No web presence (shortlist Website = null). Nothing to extract — needs an
in-person visit; shortlist already flags verifying it's still trading.

```json
{"slug": "carsons-sports-bar", "source_url": null, "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit; verify still trading"}
```

---

## Midtown / SLU (`midtown-slu`)

### Humphrey's Restaurant & Tavern ⭐

Homepage: "Tue, Wed, Thur, Fri, Sat 11:00 AM - 1:30 AM"; Sunday/Monday not
mentioned at all (recorded as omitted — page doesn't explicitly say closed).
Drink menu page says "We are updating our menu" — matches shortlist note.
Specials page has one structured deal: Tuesday $6 wings & $2 selected cans.

```json
{
  "slug": "humphreys-restaurant-tavern",
  "source_url": "https://humphreysmidtown.com",
  "checked": "2026-09-03",
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
      "free_text": "EVERY TUESDAY 11:00 AM - 10:00 PM: $6 WINGS & $2 CANS (selected)"
    }
  ],
  "obstacles": "Drink menu page says 'We are updating our menu' — no beer list or prices; Sun/Mon hours not stated on site — needs photo/manual"
}
```

### Urban Chestnut Midtown Brewery & Biergarten

Location page (urbanchestnut.com/visit/midtown-biergarten): Taste Room &
Kitchen hours Wed–Sun only (Mon/Tue not listed). Beers-on-tap is inline HTML
with name/style/ABV but **no prices**. Food menu is a Square Online embed.

```json
{
  "slug": "urban-chestnut-midtown-brewery-biergarten",
  "source_url": "https://www.urbanchestnut.com/visit/midtown-biergarten",
  "checked": "2026-09-03",
  "hours": {
    "wed": [["16:00", "22:00"]],
    "thu": [["16:00", "22:00"]],
    "fri": [["12:00", "22:00"]],
    "sat": [["12:00", "22:00"]],
    "sun": [["12:00", "19:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Tap list is inline HTML (names/styles/ABV) but unpriced; food menu is a Square Online embed; homepage mentions trivia nights but no schedule/deals — needs photo/manual for prices"
}
```

### Narwhal's Crafted

Site states "11am - Midnight, 7 days a week" (generic, not marked
location-specific). Menu content and prices live in a Toast online-ordering
system; nothing priced on the site itself.

```json
{
  "slug": "narwhals-crafted",
  "source_url": "https://www.narwhalscrafted.com",
  "checked": "2026-09-03",
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
  "obstacles": "Hours are a generic sitewide statement (not per-location); menu/prices behind Toast online ordering (order.narwhalscrafted.com) — needs photo/manual"
}
```

---

## The Grove (`grove`)

### La Calle ⭐

Priced drink menu confirmed (inline HTML): Domestic Beer $4.50, Mex Beer $5.50
(category prices; no per-brand list, no format/size stated). Margarita pitchers
$24–42 (display-only, never rank). Hours Thu–Sun 5pm–1:30am, closed Mon–Wed.
Specials page is a dated calendar; the only entry visible was Thursday (Sep 3):
Taco Thursday, $3 tacos / $4 house shots / $8 margaritas, 4:00 PM–1:30 AM.

```json
{
  "slug": "la-calle",
  "source_url": "https://lacallestl.com/st-louis-the-grove-la-calle-drink-menu",
  "checked": "2026-09-03",
  "hours": {
    "thu": [["17:00", "01:30"]],
    "fri": [["17:00", "01:30"]],
    "sat": [["17:00", "01:30"]],
    "sun": [["17:00", "01:30"]]
  },
  "prices": [
    {"beer_name": "Domestic Beer", "brand": null, "format": null, "size_oz": null, "price": 4.50, "happy_hour_only": false},
    {"beer_name": "Mexican Beer", "brand": null, "format": null, "size_oz": null, "price": 5.50, "happy_hour_only": false}
  ],
  "specials": [
    {
      "days": [4],
      "start": "16:00",
      "end": "01:30",
      "applies_to": "tacos, house shots, margaritas",
      "deal_price": null,
      "discount": null,
      "free_text": "Taco Thursday $3 Tacos, $4 House shots, $8 Margaritas (from specials calendar entry dated Thu Sep 3, 04:00 PM - 01:30 AM; page shows dated events, not a stated weekly schedule — note start 4 PM predates stated 5 PM opening)"
    }
  ],
  "obstacles": "Beer prices are category-level only (no brand list, format, or size); specials page is a dated event calendar rather than a weekly schedule"
}
```

### HandleBar

Hours on site (closed Tuesdays; note site also says "Monday - Thursday 4P",
Tuesday omitted below per the explicit "Closed Tuesdays"). Happy hour exists
but the happy-hour page content is an image; only homepage free text is
readable. Drinks menu is images + a PDF link; drafts tracked on Untappd (not
scraped per rules).

```json
{
  "slug": "handlebar",
  "source_url": "https://www.handlebarstl.com",
  "checked": "2026-09-03",
  "hours": {
    "mon": [["16:00", "02:30"]],
    "wed": [["16:00", "02:30"]],
    "thu": [["16:00", "02:30"]],
    "fri": [["15:00", "02:30"]],
    "sat": [["15:00", "02:30"]],
    "sun": [["15:00", "02:30"]]
  },
  "prices": [],
  "specials": [
    {
      "days": null,
      "start": null,
      "end": "18:00",
      "applies_to": "pizza + drinks",
      "deal_price": null,
      "discount": null,
      "free_text": "From open until 6 - and all night on Mondays - get 1/2 price pizza & discounted libations. (Days beyond Monday not itemized; drink discount amounts not stated.) Also: BIKE PERKS - roll in on two wheels & get 10% off"
    }
  ],
  "obstacles": "Happy-hour page details are in an image; drink menu is images + PDF; draft list is an Untappd link (not scraped) — needs photo/manual"
}
```

### Urban Chestnut Grove Brewery & Bierhall

Location page has full hours. Tap list inline HTML (24 beers, name/style/ABV),
**no prices**. Food menu is a PDF (Fordo's, the kitchen tenant).

```json
{
  "slug": "urban-chestnut-grove-brewery-bierhall",
  "source_url": "https://www.urbanchestnut.com/visit/the-grove-brewery-and-bierhall",
  "checked": "2026-09-03",
  "hours": {
    "mon": [["15:00", "22:00"]],
    "tue": [["15:00", "22:00"]],
    "wed": [["15:00", "22:00"]],
    "thu": [["11:00", "22:00"]],
    "fri": [["11:00", "00:00"]],
    "sat": [["11:00", "00:00"]],
    "sun": [["11:00", "21:00"]]
  },
  "prices": [],
  "specials": [],
  "obstacles": "Tap list is inline HTML (24 beers with styles/ABV) but unpriced; food menu is a PDF — needs photo/manual for beer prices"
}
```

### The Gramophone

No official site confirmed (shortlist Website = null). Nothing to extract.

```json
{"slug": "the-gramophone", "source_url": null, "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit"}
```

### Just John Nightclub

No official site confirmed (shortlist Website = null). Nothing to extract.

```json
{"slug": "just-john-nightclub", "source_url": null, "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit"}
```

---

## Dogtown (`dogtown`)

### Nick's Pub ⭐

Hours on homepage (bar to 3am daily). Specials page is priced and structured:
$15 domestic buckets, $8 domestic pitchers, during HH windows Mon–Sat 4–7pm,
Mon–Wed 10pm–midnight, and all local + NFL games. Per-beer tap prices are NOT
on the site — 99-tap list is a linked TapHunter page with no prices.
Note: buckets/pitchers never rank by default per product rules; both are
happy-hour-window deals here.

```json
{
  "slug": "nicks-pub",
  "source_url": "https://www.nicksirishpub.com/specials",
  "checked": "2026-09-03",
  "hours": {
    "mon": [["11:00", "03:00"]],
    "tue": [["11:00", "03:00"]],
    "wed": [["11:00", "03:00"]],
    "thu": [["11:00", "03:00"]],
    "fri": [["11:00", "03:00"]],
    "sat": [["17:00", "03:00"]],
    "sun": [["17:00", "03:00"]]
  },
  "prices": [
    {"beer_name": "Domestic Bucket (Bud, Bud Select, Bud Light, Busch, Busch Light)", "brand": "Anheuser-Busch", "format": "bucket", "size_oz": null, "price": 15.00, "happy_hour_only": true},
    {"beer_name": "Domestic Pitcher (Bud, Bud Select, Bud Lt, Coors Lt, Miller Lt, Golden Lt, Busch, Busch Lt)", "brand": null, "format": "pitcher", "size_oz": null, "price": 8.00, "happy_hour_only": true}
  ],
  "specials": [
    {
      "days": [1, 2, 3, 4, 5, 6],
      "start": "16:00",
      "end": "19:00",
      "applies_to": "happy hour & sports specials menu",
      "deal_price": null,
      "discount": null,
      "free_text": "Happy Hour Monday-Saturday 4-7pm: $15 Domestic Buckets (Bud, Bud Select, Bud Light, Busch & Busch LT); $8 Domestic Pitchers (Bud, Bud Select, Bud LT, Coors LT, Miller LT, Golden LT, Busch & Busch LT); shots four for $15; $6 Crown; food deals ($8 6pc boneless, $12 1lb bone-in, $6/$9 pizzas, $5-6 apps)"
    },
    {
      "days": [1, 2, 3],
      "start": "22:00",
      "end": "00:00",
      "applies_to": "happy hour & sports specials menu (late window)",
      "deal_price": null,
      "discount": null,
      "free_text": "Same specials menu Monday-Wednesday 10pm-12am"
    },
    {
      "days": null,
      "start": null,
      "end": null,
      "applies_to": "happy hour & sports specials menu (game windows)",
      "deal_price": null,
      "discount": null,
      "free_text": "Same specials 'During all Local and all NFL games' — game-conditional, no fixed schedule"
    }
  ],
  "obstacles": "Per-beer tap prices not on site; 99-beer tap list is a linked TapHunter page (name/style only, no prices) — needs photo/manual for individual draft prices"
}
```

### Seamus McDaniel's

No official site confirmed (shortlist Website = null). Nothing to extract.

```json
{"slug": "seamus-mcdaniels", "source_url": null, "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "No web presence — needs photo/manual visit"}
```

### Felix's Pizza Pub

Hours published on homepage. Menu page is a long HTML food menu (content
truncated in fetch); no drink prices found; site mentions "happy-hour food" as
a feature with zero details.

```json
{
  "slug": "felixs-pizza-pub",
  "source_url": "https://felixspizzapub.com",
  "checked": "2026-09-03",
  "hours": {
    "tue": [["15:00", "21:30"]],
    "wed": [["15:00", "21:30"]],
    "thu": [["15:00", "22:30"]],
    "fri": [["11:00", "23:00"]],
    "sat": [["11:00", "23:00"]],
    "sun": [["11:00", "20:00"]]
  },
  "prices": [],
  "specials": [
    {
      "days": null,
      "start": null,
      "end": null,
      "applies_to": null,
      "deal_price": null,
      "discount": null,
      "free_text": "Homepage lists 'Happy-hour food' as a feature — no days, times, or prices published"
    }
  ],
  "obstacles": "Menu page too long to extract fully (truncated); no beer/tap list or drink prices found online — needs photo/manual"
}
```

### The Pat Connolly Tavern

Full weekly hours on site. Menu (Squarespace HTML) is food-priced only; a
"HAPPY HOUR Specials" heading exists on the site but with no readable details.

```json
{
  "slug": "the-pat-connolly-tavern",
  "source_url": "https://patconnollytavern.com",
  "checked": "2026-09-03",
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
  "specials": [
    {
      "days": null,
      "start": null,
      "end": null,
      "applies_to": null,
      "deal_price": null,
      "discount": null,
      "free_text": "'HAPPY HOUR Specials' section heading present on site but details not readable/published"
    }
  ],
  "obstacles": "No drink prices online (menu is food-only); happy-hour details not published — needs photo/manual"
}
```

### Heavy Riff Brewing Co.

Site returns **HTTP 403** to fetchers (tried heavyriffbrewing.com and
www.heavyriffbrewing.com — both blocked). Nothing extractable.

```json
{"slug": "heavy-riff-brewing", "source_url": "https://heavyriffbrewing.com", "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "Site blocks fetchers (HTTP 403 on both hosts, 2 attempts) — needs photo/manual or in-browser check"}
```

### Tamm Avenue Bar

Facebook-only presence; public page renders nothing without login.

```json
{"slug": "tamm-avenue-bar", "source_url": "https://www.facebook.com/tammavebar", "checked": "2026-09-03", "hours": null, "prices": [], "specials": [], "obstacles": "Facebook-only presence, content behind login wall — needs photo/manual visit"}
```

---

## Summary

| Venue | Hours found? | # prices | # specials | Obstacle |
|---|---|---|---|---|
| Molly's in Soulard ⭐ | yes | 0 | 1 | drink menu = images |
| John D. McGurk's ⭐ | yes | 33 | 0 | none (sizes mostly unstated) |
| Great Grizzly Bear ⭐ | yes | 0 | 1 | drink menu unpriced; specials = dated calendar |
| 1860 Saloon | yes | 0 | 1 | menu = Clover embed |
| Big Daddy's Soulard | no | 0 | 2 | no hours; menu = PDF/images |
| Duke's in Soulard | no | 0 | 0 | no web presence |
| Hammerstone's | no | 0 | 0 | menu "being updated", beer list empty |
| iTap Soulard | partial (opens only) | 0 | 0 | draft menu = JPG; bottle list unpriced |
| Jack Nolen's | yes | 0 | 0 | food-only menu online |
| Cat's Meow | no | 0 | 0 | Facebook login wall |
| Carson's Sports Bar | no | 0 | 0 | no web presence |
| Humphrey's ⭐ | partial (Tue–Sat) | 0 | 1 | drink menu "being updated" |
| Urban Chestnut Midtown | yes (Wed–Sun) | 0 | 0 | tap list unpriced; Square food embed |
| Narwhal's Crafted | yes (generic) | 0 | 0 | prices behind Toast ordering |
| La Calle ⭐ | yes | 2 | 1 | category prices only; calendar specials |
| HandleBar | yes | 0 | 1 | HH details in image; menu images/PDF |
| Urban Chestnut Grove | yes | 0 | 0 | tap list unpriced; food PDF |
| The Gramophone | no | 0 | 0 | no web presence |
| Just John Nightclub | no | 0 | 0 | no web presence |
| Nick's Pub ⭐ | yes | 2 | 3 | tap prices only on TapHunter (unpriced) |
| Seamus McDaniel's | no | 0 | 0 | no web presence |
| Felix's Pizza Pub | yes | 0 | 1 | menu truncated; no drink prices |
| Pat Connolly Tavern | yes | 0 | 1 | HH details unpublished |
| Heavy Riff Brewing | no | 0 | 0 | HTTP 403 blocks fetchers |
| Tamm Avenue Bar | no | 0 | 0 | Facebook login wall |

**Totals:** hours 14 full + 3 partial/qualified of 25 · prices 37 line items
(33 McGurk's, 2 La Calle, 2 Nick's HH bucket/pitcher) · specials 13 entries
across 10 venues.

**Needs a photo/manual visit for prices (i.e., everyone except McGurk's):**
all 24 other venues — priority on anchors (Molly's, Grizzly, Humphrey's,
La Calle brand-level detail, Nick's per-draft prices) and on the
no-web-presence set (Duke's, Carson's, Cat's Meow, Gramophone, Just John,
Seamus McDaniel's, Tamm Avenue Bar, Heavy Riff) which also need
open-confirmation.
