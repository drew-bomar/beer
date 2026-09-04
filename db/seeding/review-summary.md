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
