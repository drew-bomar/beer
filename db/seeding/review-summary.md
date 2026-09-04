# BEE-32 extraction → DB staging (pending review)

Apply with: `scripts/prod-db.sh -f - < db/seeding/apply-offerings-specials.sql`

## Proposed rows

**blueberry-hill**
  - Featured Draught · draft 16oz · $7.0
  - Incarnation IPA · draft 16oz · $7.0
  - City Pilsner · draft 16oz · $7.0
  - Pale Ale · draft 16oz · $7.0
  - Raspberry Hefeweizen · draft 16oz · $7.0
  - Squirrelworks · draft 16oz · $7.0
  - Zwickel · draft 16oz · $7.0
  - Featured Draught · pitcher 60oz (assumed) · $20.5
  - Incarnation IPA · pitcher 60oz (assumed) · $20.5
  - City Pilsner · pitcher 60oz (assumed) · $20.5
  - Pale Ale · pitcher 60oz (assumed) · $20.5
  - Raspberry Hefeweizen · pitcher 60oz (assumed) · $20.5
  - Squirrelworks · pitcher 60oz (assumed) · $20.5
  - Zwickel · pitcher 60oz (assumed) · $20.5
  - Bud Light · draft 16oz · $5.75
  - Busch · draft 16oz · $5.75
  - Belgian White · draft 16oz · $5.75
  - Yuengling · draft 16oz · $5.75
  - Bud Light · pitcher 60oz (assumed) · $15.0
  - Busch · pitcher 60oz (assumed) · $15.0
  - Belgian White · pitcher 60oz (assumed) · $15.0
  - Yuengling · pitcher 60oz (assumed) · $15.0
  - Labatt Blue · draft 16oz · $4.75
  - Labatt Blue · pitcher 60oz (assumed) · $14.0
  - City Wide Light / Pale Ale · bottle 12oz (assumed) · $7.0
  - Blue Moon · bottle 12oz (assumed) · $5.5
  - Corona · bottle 12oz (assumed) · $5.75
  - Guinness · bottle 12oz (assumed) · $8.0
  - Heineken · bottle 12oz (assumed) · $5.75
  - Miller High Life · bottle 12oz (assumed) · $5.25
  - Rolling Rock · bottle 12oz (assumed) · $5.5
  - Stella Artois · bottle 12oz (assumed) · $6.5
  - special [1, 2, 3, 4, 5] 16:00-18:00 → all_beer [display-only] · «Happy hour specials Monday through Friday from 4:00 p.m. to 6:00 p.m. Happy hour includes discounts on select draft beers, well drinks, and appetizers.»

**pin-up-bowl**
  - Single Speed Blonde · draft 16oz · $6.0
  - Divided Sky Rye IPA · draft 16oz · $6.0
  - Soothsayer Weisenbock · draft 16oz · $6.0
  - Chicken Hawk Amber · draft 16oz · $6.0
  - The Angel & The Sword ESB · draft 16oz · $6.0
  - American Brown · draft 16oz · $6.0
  - Coffee Stout · draft 16oz · $6.0
  - Kolsch · draft 16oz · $6.0
  - Pabst Blue Ribbon · bottle 12oz (assumed) · $5.0
  - Czechvar · bottle 12oz (assumed) · $5.0
  - Gumballhead · bottle 12oz (assumed) · $8.0
  - Sol Cerveza · bottle 12oz (assumed) · $6.0
  - Technical Ecstasy · bottle 12oz (assumed) · $6.0
  - Montucky Cold Snack · bottle 12oz (assumed) · $3.0
  - City Wide · bottle 12oz (assumed) · $7.0
  - Brewligans · bottle 12oz (assumed) · $9.0
  - Zombie Ice · bottle 12oz (assumed) · $5.0
  - Sandman · bottle 12oz (assumed) · $8.0
  - Dark Matter · bottle 12oz (assumed) · $5.0
  - German Porter · bottle 12oz (assumed) · $7.0

**salt-smoke-delmar-loop**
  - Schmidt's Light American Lager · draft 16oz (assumed) · $8.0
  - Citrus Wheat · draft 16oz (assumed) · $8.0
  - Up River Juicy IPA · draft 16oz (assumed) · $9.0
  - Incarnation IPA · draft 16oz (assumed) · $9.0
  - SIUE Cougar Red Amber Lager · draft 16oz (assumed) · $8.0
  - Seasonal Cider (Gluten Free) · draft 16oz (assumed) · $9.0
  - Brown Ale · can 12oz (assumed) · $7.0
  - APA · can 16oz · $9.0
  - Yuengling · bottle 12oz (assumed) · $5.0
  - Budweiser / Bud Light / Bud Select · bottle 12oz (assumed) · $5.0
  - Busch Light · can 12oz · $5.0
  - Michelob Ultra · bottle 12oz (assumed) · $6.0
  - special [1, 2, 3, 4, 5] 15:00-18:00 → all_draft -$2.0 · «Happy Hour Mon – Fri, 3–6pm: All Draft Beer + Draft Cocktails $2 Off. Also select appetizers $2 off, wine by the glass 8.00.»

**moonrise-hotel-rooftop-eclipse**
  - special [0, 1, 2, 3, 4] 16:00-18:00 → all_beer [display-only] · «Garden Bar Happy Hour: Sunday – Thursday 4:00 PM – 6:00 PM. No discount details or pricing published.»

**pbr-st-louis-a-cowboy-bar**
  - special [5] 20:00-02:30 → all_beer [display-only] · «Freedom Friday, every Friday 8:00 PM – 2:30 AM: FREE cover & skip the line; first cold one on us; bottle service specials; military salute at midnight.»

**salt-smoke-ballpark-village**
  - Schmidt's Light American Lager · draft 16oz (assumed) · $8.0
  - Citrus Wheat · draft 16oz (assumed) · $8.0
  - Up River Juicy IPA · draft 16oz (assumed) · $9.0
  - Incarnation IPA · draft 16oz (assumed) · $9.0
  - SIUE Cougar Red Amber Lager · draft 16oz (assumed) · $8.0
  - Seasonal Cider (Gluten Free) · draft 16oz (assumed) · $9.0
  - Brown Ale · can 12oz (assumed) · $7.0
  - APA · can 16oz · $9.0
  - Yuengling · bottle 12oz (assumed) · $5.0
  - Budweiser / Bud Light / Bud Select · bottle 12oz (assumed) · $5.0
  - Busch Light · can 12oz · $5.0
  - Michelob Ultra · bottle 12oz (assumed) · $6.0
  - special [1, 2, 3, 4, 5] 15:00-18:00 → all_draft -$2.0 · «Happy Hour Mon – Fri, 3–6pm: All Draft Beer + Draft Cocktails $2 Off. Menu not available at Ballpark Village on Game Days.»

**tin-roof-st-louis**
  - special [1, 2, 3, 4, 5] 14:00-18:00 → all_beer [display-only] · «Happy Hour Mon-Fri 2pm-6pm: $3 Domestic Bottles, $3 Wells, $4 Special Shots, $5 seltzers, $5 call liquors»
  - special [4] 21:00-00:00 → all_beer [display-only] · «Cup Night every Thursday: grab a $5 souvenir cup and enjoy $1 well refills from 9 PM–Midnight. Also $5 Teas and Bombs.»

**krueger-s-bar**
  - special [1, 2, 3, 4, 5] 16:00-18:00 → all_beer [display-only] · «Happy Hour 4PM - 6PM Monday - Friday: $3 Domestic Bottles, $4 Rail Cocktails»

**molly-s-in-soulard**
  - special [2, 3, 4, 5] 15:00-19:00 → all_beer -$1 · «Happy Hour Tuesday - Friday 3pm to 7pm: $1 OFF ALL DRINKS; $2 oysters at patio bar only (excludes Monday due to kitchen being closed)»

**john-d-mcgurk-s-irish-pub**
  - Incarnation IPA · draft 16oz (assumed) · $7.0
  - Contact High Wheat Ale · draft 16oz (assumed) · $7.0
  - Honey Crisp Cider · draft 16oz (assumed) · $7.0
  - Budweiser Lager · draft 16oz (assumed) · $6.0
  - Guinness Irish Stout · draft 20oz · $8.75
  - Big Wave Golden Ale · draft 16oz (assumed) · $7.0
  - Mango Cart Mango Wheat · draft 16oz (assumed) · $7.0
  - McGurk's Irish Red Ale · draft 16oz (assumed) · $7.0
  - McGurk's Irish Stout · draft 16oz (assumed) · $7.0
  - Michelob ULTRA Light Lager · draft 16oz (assumed) · $6.0
  - Modelo Mexican Lager · draft 16oz (assumed) · $7.0
  - Squirrel Werks Hazy IPA · draft 16oz (assumed) · $7.0
  - Zwickel Bavarian Lager · draft 16oz (assumed) · $7.0
  - Yuengling Lager · draft 16oz (assumed) · $7.0
  - City Wide APA · bottle 12oz (assumed) · $7.0
  - Blue Moon · bottle 12oz (assumed) · $6.0
  - Bud Light · bottle 12oz (assumed) · $5.5
  - Bud Select · bottle 12oz (assumed) · $5.5
  - Budweiser · bottle 12oz (assumed) · $5.5
  - Busch · bottle 12oz (assumed) · $5.5
  - Busch Light · bottle 12oz (assumed) · $5.0
  - Carbliss Lemon Lime Seltzer · can 12oz (assumed) · $8.0
  - Corona Mexican Lager · bottle 12oz (assumed) · $6.0
  - Harp Lager · bottle 12oz (assumed) · $8.0
  - High Noon Pineapple Seltzer · can 12oz (assumed) · $8.0
  - Magners Cider · bottle 12oz (assumed) · $8.0
  - Michelob Golden · bottle 12oz (assumed) · $5.5
  - Michelob Ultra · bottle 12oz (assumed) · $5.5
  - Miller Lite · bottle 12oz (assumed) · $5.5
  - NUTRL Orange Seltzer · can 12oz (assumed) · $8.0
  - Ole Chili Mango · can 12oz (assumed) · $8.0
  - Surfside Blueberry Lemonade · can 12oz (assumed) · $8.0
  - Yuengling Flight · bottle 12oz (assumed) · $6.0

**great-grizzly-bear**
  - special [1, 2, 3, 4, 5] 14:00-18:00 → all_beer [display-only] · «$3 Domestic Beer, $4 Drafts, $4 Well Drinks, and $5 shots of Jager, Milagro, Fireball, or Tullamore Dew. Days derived from specials-page calendar entries (Thu 9/3, Fri 9/4, Mon 9/7, Tue 9/8, Wed 9/9, all 2:00-6:00 PM); page does not state 'Mon-Fri' explicitly»

**1860-saloon-game-room-hardshell-cafe**
  - special [1, 2, 3, 4, 5] 15:00-18:00 → all_beer [display-only] · «Happy Hour: M-F 3 to 6 P.M. Appetizers and Drink Specials (no prices published)»

**humphrey-s-restaurant-tavern**
  - special [2] 11:00-22:00 → all_beer [display-only] · «EVERY TUESDAY 11:00 AM - 10:00 PM: $6 WINGS & $2 CANS (selected)»

**la-calle**
  - Domestic Beer · draft 16oz (assumed) · $4.5
  - Mexican Beer · draft 16oz (assumed) · $5.5
  - special [4] 16:00-01:30 → all_beer [display-only] · «Taco Thursday $3 Tacos, $4 House shots, $8 Margaritas (from specials calendar entry dated Thu Sep 3, 04:00 PM - 01:30 AM; page shows dated events, not a stated weekly schedule — note start 4 PM predates stated 5 PM opening)»

**nick-s-pub**
  - special [1, 2, 3, 4, 5, 6] 16:00-19:00 → all_beer [display-only] · «Happy Hour Monday-Saturday 4-7pm: $15 Domestic Buckets (Bud, Bud Select, Bud Light, Busch & Busch LT); $8 Domestic Pitchers (Bud, Bud Select, Bud LT, Coors LT, Miller LT, Golden LT, Busch & Busch LT); shots four for $15; $6 Crown; food deals ($8 6pc boneless, $12 1lb bone-in, $6/$9 pizzas, $5-6 apps)»
  - special [1, 2, 3] 22:00-00:00 → all_beer [display-only] · «Same specials menu Monday-Wednesday 10pm-12am»

## Manual follow-ups (not inserted)

- halo-bar-the-pageant: special not insertable (missing days/times): The Halo Bar opens at 6pm on The Pageant show nights. (Event-driven hours, no weekly schedule published.)
- session-taco-delmar-loop: special not insertable (missing days/times): 9pm to close every night. Stop in for $3 select tacos, happy hour guac & queso, shots, cocktail quickies and session drafts! (End time = close, varies by day; Delmar Loop closed Mondays so Monday omitted from days.)
- budweiser-brew-house: special not insertable (missing days/times): Bud Deck: $32 all-inclusive packages include domestic beer, N/A beverages, hot dogs, and burgers (21+); packages are required for entry. Event-date driven, many dates closed for private events.
- sports-social-st-louis: special not insertable (missing days/times): Taco Tuesday, every Tuesday (listed 12 AM – 10 PM on BPV specials page); no prices or drink details published.
- paddy-o-s: special not insertable (missing days/times): Open three hours before St. Louis Cardinals' home games til last call on drinks. Live DJ at every Cardinals home game. No drink prices published.
- broadway-oyster-bar: special not insertable (missing days/times): Happy Hour 11 am - 4 pm (from an image caption; days of week and deal details not stated in readable text — details are inside the menu images).
- tin-roof-st-louis: special not insertable (missing days/times): Monday: $5 Quesadillas; $3 Bud Family Draft, $5 Wells, & $5 Seltzers (times not stated)
- tin-roof-st-louis: special not insertable (missing days/times): Tuesday: Happy Hour Drink Specials ALL DAY!
- tin-roof-st-louis: special not insertable (missing days/times): Sunday: $20 Beer Buckets, $5 Jameson, $5 Titos, $6 Deep Eddy, $6 Green and White Tea shots (times not stated)
- tin-roof-st-louis: HH-only price kept out of standing offerings: Domestic bottles $3.0
- tin-roof-st-louis: HH-only price kept out of standing offerings: Bud Family draft $3.0
- tin-roof-st-louis: HH-only price kept out of standing offerings: Beer bucket $20.0
- krueger-s-bar: special not insertable (missing days/times): Free tacos on Thursday with a drink purchase!
- krueger-s-bar: HH-only price kept out of standing offerings: Domestic bottles $3.0
- big-daddy-s-soulard: special not insertable (missing days/times): 30% Off Bar Tabs INDUSTRY NIGHTS Every Monday & Tuesday Night (no times published; percentage discount, not $ off)
- big-daddy-s-soulard: special not insertable (missing days/times): Site mentions 'great lunch specials, happy hour' with no details; Poker Night Wednesdays 7pm; DJ Fri & Sat 9pm-close
- handlebar: special not insertable (missing days/times): From open until 6 - and all night on Mondays - get 1/2 price pizza & discounted libations. (Days beyond Monday not itemized; drink discount amounts not stated.) Also: BIKE PERKS - roll in on two wheels & get 10% off
- nick-s-pub: special not insertable (missing days/times): Same specials 'During all Local and all NFL games' — game-conditional, no fixed schedule
- nick-s-pub: HH-only price kept out of standing offerings: Domestic Bucket (Bud, Bud Select, Bud Light, Busch, Busch Light) $15.0
- nick-s-pub: HH-only price kept out of standing offerings: Domestic Pitcher (Bud, Bud Select, Bud Lt, Coors Lt, Miller Lt, Golden Lt, Busch, Busch Lt) $8.0
- felix-s-pizza-pub: special not insertable (missing days/times): Homepage lists 'Happy-hour food' as a feature — no days, times, or prices published
- the-pat-connolly-tavern: special not insertable (missing days/times): 'HAPPY HOUR Specials' section heading present on site but details not readable/published

## Founder-intel round (Tin Roof PDF · Molly's image · Great Grizzly roster)


**tin-roof-st-louis**
  - Angry Orchard · draft 16oz (assumed) · $6.00
  - Blue Moon · draft 16oz (assumed) · $6.00
  - Bud Light · draft 16oz (assumed) · $5.00
  - Busch Light · draft 16oz (assumed) · $5.00
  - Coors Light · draft 16oz (assumed) · $5.00
  - Kona Big Wave · draft 16oz (assumed) · $6.00
  - Lagunitas IPA · draft 16oz (assumed) · $7.00
  - Mango Cart · draft 16oz (assumed) · $6.00
  - Michelob Ultra · draft 16oz (assumed) · $5.00
  - Miller Lite · draft 16oz (assumed) · $5.00
  - Modelo Especial · draft 16oz (assumed) · $6.00
  - Tin Roof Light Lager · draft 16oz (assumed) · $5.00
  - Voodoo Ranger Juicy Haze IPA · draft 16oz (assumed) · $6.00
  - Yuengling · draft 16oz (assumed) · $5.00
  - Bud Light · bottle 12oz (assumed) · $5.00
  - Budweiser · bottle 12oz (assumed) · $5.00
  - Bud Select · bottle 12oz (assumed) · $5.00
  - Coors Light · bottle 12oz (assumed) · $5.00
  - Corona Extra · bottle 12oz (assumed) · $6.00
  - Corona Light · bottle 12oz (assumed) · $6.00
  - Michelob Ultra · bottle 12oz (assumed) · $5.00
  - Michelob Ultra Zero · bottle 12oz (assumed) · $5.00
  - Michelob Ultra Zero Lime · bottle 12oz (assumed) · $5.00
  - Miller High Life · bottle 12oz (assumed) · $6.00
  - Miller Lite · bottle 12oz (assumed) · $5.00
  - Modelo Especial · bottle 12oz (assumed) · $6.00
  - Pacifico · bottle 12oz (assumed) · $6.00
  - Zwickel Light · bottle 12oz (assumed) · $5.00
  - Busch Light · can 16oz · $5.00

**molly-s-in-soulard**
  - Guinness · can 16oz · $7.00
  - Mango Cart · can 12oz · $6.00
  - Blue Moon · can 16oz · $6.00
  - Stella Artois · bottle 12oz · $6.00
  - Corona Extra · bottle 12oz · $6.00
  - Modelo Especial · bottle 12oz · $6.00
  - 4 Hands Incarnation IPA · can 16oz · $8.00
  - Urban Chestnut Bushelhead Cider · can 16oz · $9.00
  - 4 Hands City Wide APA · can 16oz · $8.00
  - 2nd Shift Brewligans IPA · can 16oz · $8.00
  - Michelob Ultra · bottle 12oz (assumed) · $5.25
  - Bud Light · bottle 12oz (assumed) · $5.25
  - Bud Select · bottle 12oz (assumed) · $5.25
  - Budweiser · bottle 12oz (assumed) · $5.25
  - Busch · bottle 12oz (assumed) · $5.25
  - Busch Light · bottle 12oz (assumed) · $5.25
  - Miller Lite · bottle 12oz (assumed) · $5.25
  - Coors Light · bottle 12oz (assumed) · $5.25
  - Yuengling · bottle 12oz (assumed) · $6.00
  - Stag · bottle 12oz (assumed) · $4.50
  - PBR · bottle 12oz (assumed) · $4.50
  - Domestic bucket (5 beers) · bucket 60oz (assumed) · $25.00

**great-grizzly-bear**
  - Brick River Crisp Apple Cider · draft 16oz (assumed) · $?
  - Bud Light · draft 16oz (assumed) · $?
  - Busch Light · draft 16oz (assumed) · $?
  - Goose Island Hazy Beer Hug IPA · draft 16oz (assumed) · $?
  - Kona Big Wave · draft 16oz (assumed) · $?
  - Michelob Ultra · draft 16oz (assumed) · $?
  - Modelo Especial · draft 16oz (assumed) · $?
  - Stella Artois · draft 16oz (assumed) · $?
  - Yuengling · draft 16oz (assumed) · $?
  - Blue Moon · draft 16oz (assumed) · $?
  - Golden Road Mango Cart · draft 16oz (assumed) · $?
  - Busch · can 16oz · $?
  - Busch Light · can 16oz · $?
  - Guinness · can 16oz · $?
  - Iron Hops Battle Brew IPA · can 16oz · $?
  - Iron Hops Ka-Kaw Lager · can 16oz · $?
  - Leinenkugel's Summer Shandy · can 16oz · $?
  - PBR · can 16oz · $?
  - Stag · can 16oz · $?
  - 4 Hands City Wide · can 16oz · $?
  - 4 Hands Parker Pilsner · can 16oz · $?
  - Bud Light · bottle 12oz · $?
  - Bud Light Lime · bottle 12oz · $?
  - Bud Select · bottle 12oz · $?
  - Budweiser · bottle 12oz · $?
  - Busch · bottle 12oz · $?
  - Busch Light · bottle 12oz · $?
  - Coors Banquet · bottle 12oz · $?
  - Coors Light · bottle 12oz · $?
  - Corona · bottle 12oz · $?
  - Coronita · bottle 7oz · $?
  - Michelob Golden Light · bottle 12oz · $?
  - Michelob Ultra · bottle 12oz · $?
  - Miller Lite · bottle 12oz · $?
  - Modelito Especial · bottle 7oz · $?
  - Modelo Negra · bottle 12oz · $?

## Pass 2 deep-crawl round

**moonrise-hotel-rooftop-eclipse**
  - Schlafly Seasonal · draft 16oz (assumed) · $7.0
  - Passing Clouds Witbier · draft 16oz (assumed) · $7.0
  - Schnickelfritz Weissbier · draft 16oz (assumed) · $7.0
  - City Wide APA · draft 16oz (assumed) · $7.0
  - Zwickel · draft 16oz (assumed) · $7.0
  - American Brown Ale · draft 16oz (assumed) · $7.0
  - First Available IPA · draft 16oz (assumed) · $7.0
  - Incarnation IPA · draft 16oz (assumed) · $7.0
  - Budweiser · bottle 12oz (assumed) · $5.0
  - Bud Light · bottle 12oz (assumed) · $5.0
  - Bud Select · bottle 12oz (assumed) · $5.0
  - Michelob Ultra · bottle 12oz (assumed) · $5.0
  - Busch · bottle 12oz (assumed) · $5.0
  - Coors Light · bottle 12oz (assumed) · $5.0
  - Miller Lite · bottle 12oz (assumed) · $5.0
  - Yuengling · bottle 12oz (assumed) · $5.0
  - Corona Extra · bottle 12oz (assumed) · $6.0
  - Hoegaarden · bottle 12oz (assumed) · $6.0
  - Peroni · bottle 12oz (assumed) · $6.0
  - Stella Artois · bottle 12oz (assumed) · $6.0
  - Guinness · bottle 12oz (assumed) · $6.0
  - Modelo Especial · bottle 12oz (assumed) · $6.0
  - Sapporo · bottle 12oz (assumed) · $6.0
  - Stella Artois Cidre (cider) · bottle 12oz (assumed) · $6.0
  - Upside Dawn (N/A) · bottle 12oz (assumed) · $6.0
  - Intentional IPA (N/A) · bottle 12oz (assumed) · $6.0
  - special [0, 1, 2, 3, 4] 16:00-18:00 → all_beer [display-only] · «Garden Bar Happy Hour: Sunday – Thursday 4:00 PM – 6:00 PM. No discount details »

**pbr-st-louis-a-cowboy-bar**
  - special [5] 20:00-02:30 → all_beer [display-only] · «Freedom Friday: FREE cover & skip the line; first cold one on us; bottle service»

**sports-social-st-louis**
  - special [2] 00:00-22:00 → all_beer [display-only] · «Taco Tuesday, every Tuesday (listed 12:00 AM–10:00 PM): $2 tacos, $5 Social/froz»
  - special [0, 1, 2, 3, 4, 5, 6] 11:00-22:00 → all_draft [display-only] · «Sports Watch, every day 11 AM–10 PM: $25 beer buckets and $30 Bud Light beer tow»

**broadway-oyster-bar**
  - Budweiser · bottle 12oz (assumed) · $?
  - Bud Light · bottle 12oz (assumed) · $?
  - Bud Select · bottle 12oz (assumed) · $?
  - Michelob Ultra · bottle 12oz (assumed) · $?
  - Busch · bottle 12oz (assumed) · $?
  - Busch Light · bottle 12oz (assumed) · $?
  - Mango Cart · bottle 12oz (assumed) · $?
  - Coors Light · bottle 12oz (assumed) · $?
  - Miller Lite · bottle 12oz (assumed) · $?
  - Pabst Blue Ribbon · bottle 12oz (assumed) · $?
  - Abita Amber · bottle 12oz (assumed) · $?
  - Stag · bottle 12oz (assumed) · $?
  - Modelo Especial · bottle 12oz (assumed) · $?
  - Heineken · bottle 12oz (assumed) · $?
  - Guinness · bottle 12oz (assumed) · $?
  - City Wide · bottle 12oz (assumed) · $?
  - Stella Artois · bottle 12oz (assumed) · $?
  - Athletic IPA (N/A) · bottle 12oz (assumed) · $?
  - Mango Cart (N/A) · bottle 12oz (assumed) · $?
  - Busch (N/A) · bottle 12oz (assumed) · $?
  - Zwickel (Bavarian Lager 5.1%) · draft 16oz (assumed) · $?
  - Octohaze (Hazy IPA 7%) · draft 16oz (assumed) · $?
  - Incarnation (American IPA 7%) · draft 16oz (assumed) · $?
  - Purple Haze (Fruit and Field 4.2%) · draft 16oz (assumed) · $?
  - American Brown (Brown Ale 4.8%) · draft 16oz (assumed) · $?
  - Citrapolis (American IPA 7%) · draft 16oz (assumed) · $?
  - High Tide (Wheat Ale 5.5%) · draft 16oz (assumed) · $?
  - Bud Light (Lager 4.2%) · draft 16oz (assumed) · $?
  - Yuengling (Lager 4.5%) · draft 16oz (assumed) · $?
  - special [1, 2, 3, 4, 5] 11:00-16:00 → all_draft -$1.0 · «Happy Hour Monday–Friday 11am–4pm: $1.00 OFF draft beers, well drinks, Mezzacoro»

**krueger-s-bar**
  - special [1, 2, 3, 4, 5] 16:00-18:00 → all_beer [display-only] · «Happy Hour 4PM–6PM Monday–Friday: $3 Domestic Bottles, $4 Rail Cocktails»

**1860-saloon-game-room-hardshell-cafe**
  - special [1, 2, 3, 4, 5] 15:00-18:00 → all_beer [display-only] · «Happy Hour: M-F 3 to 6 P.M. Appetizers and Drink Specials (no prices published)»

**international-tap-house-itap-soulard**
  - Big Wave · draft 16oz (assumed) · $?
  - Blueberry · draft 16oz (assumed) · $?
  - Pseudo Sue · draft 16oz (assumed) · $?
  - Space Camper · draft 16oz (assumed) · $?
  - Mango Juicy Bits · draft 16oz (assumed) · $?
  - Juice Pants · draft 16oz (assumed) · $?
  - Run Wild IPA (NA) · draft 16oz (assumed) · $?
  - Two Hearted IPA · draft 16oz (assumed) · $?
  - Going Places · draft 16oz (assumed) · $?
  - Oktoberfest-Marzen · draft 16oz (assumed) · $?
  - Oktoberfest Marzen · draft 16oz (assumed) · $?
  - Dos Equis XX · draft 16oz (assumed) · $?
  - Pilsner Urquell · draft 16oz (assumed) · $?
  - Pivo Pils · draft 16oz (assumed) · $?
  - Premium Pils · draft 16oz (assumed) · $?
  - German Pilsner · draft 16oz (assumed) · $?
  - Labatt Blue · draft 16oz (assumed) · $?
  - City Red · draft 16oz (assumed) · $?
  - Tank 7 · draft 16oz (assumed) · $?

**humphrey-s-restaurant-tavern**
  - special [2] 11:00-22:00 → all_beer [display-only] · «$6 WINGS & $2 CANS (selected). EVERY TUESDAY! 11:00 AM - 10:00 PM»

**urban-chestnut-midtown-brewery-biergarten**
  - Knotty Pretzel Beer (Golden Pretzel Ale, 5.1%) · draft 16oz (assumed) · $?
  - I Am St. Louis Pilsner (Pre-Prohibition Pilsner, 5.4%) · draft 16oz (assumed) · $?
  - Barbe Rouge (Pilsner, 4.9%) · draft 16oz (assumed) · $?
  - Squirrel Werks Hazy IPA (6.6%) · draft 16oz (assumed) · $?
  - Zwickel Light (Light Lager, 4.0%) · draft 16oz (assumed) · $?
  - Maibock (6.8%) · draft 16oz (assumed) · $?
  - Big Shark Grapefruit Radler (4.2%) · draft 16oz (assumed) · $?
  - Ku'damm (Berliner Weisse, 4.2%) · draft 16oz (assumed) · $?
  - Bushelhead (Cider, 5.0%) · draft 16oz (assumed) · $?
  - Stammtisch (German Pilsner, 5.4%) · draft 16oz (assumed) · $?
  - STLIPA (Imperial IPA, 8.0%) · draft 16oz (assumed) · $?
  - Schnickelfritz (Bavarian Weissbier, 5.0%) · draft 16oz (assumed) · $?
  - Zwickel (Bavarian Lager, 5.1%) · draft 16oz (assumed) · $?
  - Dorfbier (Munich Dunkel, 4.8%) · draft 16oz (assumed) · $?

**la-calle**
  - special [4] 16:00-01:30 → all_beer [display-only] · «Taco Thursday: $3 Tacos, $4 House shots, $8 Margaritas, 04:00 PM - 01:30 AM (fro»

**handlebar**
  - Hamm's · can 12oz (assumed) · $3.0
  - Coors Light · can 12oz (assumed) · $4.0
  - Montucky Cold Snacks · can 12oz (assumed) · $4.0
  - PBR · can 12oz (assumed) · $4.0
  - Yuengling Flight · can 12oz (assumed) · $4.0
  - Hopewell Lil Buddy · can 12oz (assumed) · $5.0
  - Miller Lite · can 12oz (assumed) · $5.0
  - Stag · can 12oz (assumed) · $5.0
  - Logboat Dark Matter · can 12oz (assumed) · $6.0
  - Corona · can 12oz (assumed) · $6.0
  - Modelo Especial · can 12oz (assumed) · $6.0
  - UCBC Zwickel · can 12oz (assumed) · $7.0
  - UCBC Schnickelfritz · can 12oz (assumed) · $7.0
  - 3 Floyds Gumballhead · can 12oz (assumed) · $7.0
  - 3 Floyds Zombie Dust · can 12oz (assumed) · $7.0
  - Blue Moon · can 12oz (assumed) · $7.0
  - Schlafly Raspberry Hefeweizen · can 12oz (assumed) · $7.0
  - Heineken · can 12oz (assumed) · $7.0
  - Peroni · can 12oz (assumed) · $7.0
  - 2nd Shift Technical Ecstasy · can 12oz (assumed) · $8.0
  - 4 Hands City Wide Light · can 12oz (assumed) · $8.0
  - 4 Hands City Wide APA · can 12oz (assumed) · $8.0
  - 4 Hands Octohaze · can 12oz (assumed) · $8.0
  - 4 Hands Single Speed · can 12oz (assumed) · $8.0
  - Modern Disco Punch · can 12oz (assumed) · $8.0
  - Prairie Rainbow Sherbet · can 12oz (assumed) · $8.0
  - Schlafly Just a Little Bit Hazy · can 12oz (assumed) · $8.0
  - 2nd Shift Hibiscus Wit · can 12oz (assumed) · $9.0
  - Heavy Riff Squeezebox · can 12oz (assumed) · $9.0
  - Heavy Riff Love Gun · can 12oz (assumed) · $9.0
  - Heavy Riff Velvet Underbrown · can 12oz (assumed) · $9.0
  - 4 Hands Absence of Light · can 12oz (assumed) · $9.0
  - Prairie Blueberry Boyfriend · can 12oz (assumed) · $9.0
  - Perennial Saison de Lis · can 12oz (assumed) · $9.0
  - 2nd Shift Little Big Hop · can 12oz (assumed) · $10.0
  - 4 Hands Flamingo Dance Party · can 12oz (assumed) · $10.0
  - Perennial Poolside Breeze · can 12oz (assumed) · $10.0
  - Prairie Slush · can 12oz (assumed) · $10.0
  - Main & Mill Fruit Drops · can 12oz (assumed) · $11.0
  - Modern Citropolis · can 12oz (assumed) · $11.0
  - Narrow Gauge Fallen Flag · can 12oz (assumed) · $15.0
  - Brick River cider (sweet lou / cornerstone) · can 12oz (assumed) · $7.0
  - Waves strawberry rose cider · can 12oz (assumed) · $6.0
  - Mystery Can (canned cocktail, seltzer, or beer) · can 12oz (assumed) · $4.0

**urban-chestnut-grove-brewery-bierhall**
  - Zwickel (Bavarian Lager, 5.1%) · draft 16oz (assumed) · $?
  - Wolpertinger 2019 Barleywine (11.0%) · draft 16oz (assumed) · $?
  - Urban Underdog American Lager (4.7%) · draft 16oz (assumed) · $?
  - Tangerine Radler (Light Lager, 4.2%) · draft 16oz (assumed) · $?
  - STLIPA (Imperial IPA, 8.0%) · draft 16oz (assumed) · $?
  - Stammtisch (German Pilsner, 5.4%) · draft 16oz (assumed) · $?
  - Squirrel Werks Hazy IPA (6.6%) · draft 16oz (assumed) · $?
  - Schnickelfritz (Bavarian Weissbier, 5.0%) · draft 16oz (assumed) · $?
  - O-Katz (Oktoberfest Lager, 5.4%) · draft 16oz (assumed) · $?
  - Knotty Pretzel Beer (Golden Pretzel Ale, 5.1%) · draft 16oz (assumed) · $?
  - Dad's Original Oatmeal Stout (5.9%) · draft 16oz (assumed) · $?
  - 5 Day IPA (American IPA, 6.1%) · draft 16oz (assumed) · $?
  - Maibock (6.8%) · draft 16oz (assumed) · $?
  - Ku'damm (Berliner Weisse, 4.2%) · draft 16oz (assumed) · $?
  - Konomi (Japanese Ale, 5.4%) · draft 16oz (assumed) · $?
  - Fest Bier (Festival Pale Lager, 5.9%) · draft 16oz (assumed) · $?
  - Dorfbier (Munich Dunkel, 4.8%) · draft 16oz (assumed) · $?
  - Bushelhead (Cider, 5.0%) · draft 16oz (assumed) · $?
  - Annie's Irish Red (4.6%) · draft 16oz (assumed) · $?

**seamus-mcdaniel-s**
  - special [5, 6] 22:00-00:00 → all_beer [display-only] · «Late Night Appetizers Friday - Saturday 10:00 pm - 12:00 am (availability, not a»

### Pass-2 follow-ups (not inserted)

- halo-bar-the-pageant: special not insertable (missing days/times): The Halo Bar opens at 6pm on The Pageant show nights. (Event-driven hours; no weekly sched
- session-taco-delmar-loop: special not insertable (missing days/times): LATE NIGHT HAPPY HOUR: 9pm to close every night. $3 select tacos, happy hour guac & queso,
- budweiser-brew-house: special not insertable (missing days/times): Bud Deck: $32 all-inclusive packages include domestic beer, N/A beverages, hot dogs, and b
- sports-social-st-louis: HH-only price kept out of standing offerings: Domestic drafts (Bud, Bud Light) $4.0
- sports-social-st-louis: HH-only price kept out of standing offerings: Corona $5.0
- sports-social-st-louis: HH-only price kept out of standing offerings: Estrella $5.0
- sports-social-st-louis: HH-only price kept out of standing offerings: Corona Premier $3.0
- sports-social-st-louis: special not insertable (missing days/times): Happy Hour menu (embedded in site menu data): $4 Domestic Drafts (Bud, Bud Light), $5 Oran
- sports-social-st-louis: special not insertable (missing days/times): Football watch parties (venue page): $30 bottomless domestic drafts, $30 bottomless beer t
- paddy-o-s: special not insertable (missing days/times): Open three hours before St. Louis Cardinals' home games til last call on drinks. Live DJ a
- krueger-s-bar: HH-only price kept out of standing offerings: Domestic bottles $3.0
- krueger-s-bar: special not insertable (missing days/times): Free tacos on Thursday with a drink purchase!
- big-daddy-s-soulard: special not insertable (missing days/times): 30% Off Bar Tabs INDUSTRY NIGHTS Every Monday & Tuesday Night (no times published; percent
- big-daddy-s-soulard: special not insertable (missing days/times): Site mentions lunch specials and happy hour with no details; Poker Wednesdays 7pm; DJ Fri 
- la-calle: price row skipped (already staged in pass 1): Domestic Beer (category)
- la-calle: price row skipped (already staged in pass 1): Mexican Beer (category)
- la-calle: price row skipped (already staged in pass 1): High Noon (seltzer)
- la-calle: price row skipped (already staged in pass 1): Beergarita
- la-calle: price row skipped (already staged in pass 1): Michelada
- handlebar: HH-only price kept out of standing offerings: Hamm's (happy hour) $1.0
- handlebar: special not insertable (missing days/times): HAPPY HOUR: $3 WELLS | $1 HAMM'S | HALF PRICE PIZZA — EVERY DAY TIL 6P (start = open; deal
- handlebar: special not insertable (missing days/times): ALL DAY HAPPY HOUR every Monday: 1/2 off pizza, $1 Hamm's, $3 wells
- handlebar: special not insertable (missing days/times): FOUR ROSES FRIDAYS - $4 (no times stated)
- handlebar: special not insertable (missing days/times): 10% DISCOUNT FOR NEIGHBORS, STUDENTS, & CYCLISTS every night til 10p (must show ID and/or 
