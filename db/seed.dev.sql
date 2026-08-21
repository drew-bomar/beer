-- Dev-only seed data: fictional venues with plausible geometry for the Loop and Downtown.
-- Never run against production. Load with:
--   docker exec -i beer-db psql -U beer -d beer < db/seed.dev.sql

insert into coverage_areas (slug, name, area) values
  ('delmar-loop', 'The Delmar Loop', st_geogfromtext(
    'MULTIPOLYGON(((-90.3165 38.6535, -90.2905 38.6535, -90.2905 38.6585, -90.3165 38.6585, -90.3165 38.6535)))')),
  ('downtown', 'Downtown', st_geogfromtext(
    'MULTIPOLYGON(((-90.2045 38.6195, -90.1795 38.6195, -90.1795 38.6345, -90.2045 38.6345, -90.2045 38.6195)))'));

insert into venues (slug, name, address, location, district_id, hours, website_url) values
  ('the-test-tap', 'The Test Tap', '6100 Delmar Blvd',
    st_geogfromtext('POINT(-90.3020 38.6560)'),
    (select id from coverage_areas where slug = 'delmar-loop'),
    '{"mon":[["16:00","01:00"]],"tue":[["16:00","01:00"]],"wed":[["16:00","01:00"]],"thu":[["16:00","01:30"]],"fri":[["15:00","03:00"]],"sat":[["12:00","03:00"]],"sun":[["12:00","00:00"]]}',
    'https://example.com/test-tap'),
  ('devs-dive', 'Dev''s Dive', '6300 Delmar Blvd',
    st_geogfromtext('POINT(-90.3080 38.6555)'),
    (select id from coverage_areas where slug = 'delmar-loop'),
    '{"mon":[["11:00","01:00"]],"tue":[["11:00","01:00"]],"wed":[["11:00","01:00"]],"thu":[["11:00","01:00"]],"fri":[["11:00","02:00"]],"sat":[["11:00","02:00"]],"sun":[["11:00","23:00"]]}',
    'https://example.com/devs-dive'),
  ('stub-street-brews', 'Stub Street Brews', '6600 Delmar Blvd',
    st_geogfromtext('POINT(-90.3140 38.6550)'),
    (select id from coverage_areas where slug = 'delmar-loop'),
    '{"wed":[["16:00","00:00"]],"thu":[["16:00","00:00"]],"fri":[["14:00","01:30"]],"sat":[["12:00","01:30"]],"sun":[["12:00","22:00"]]}',
    null),
  ('mock-alley', 'Mock Alley', '1200 Washington Ave',
    st_geogfromtext('POINT(-90.1920 38.6310)'),
    (select id from coverage_areas where slug = 'downtown'),
    '{"mon":[["16:00","00:00"]],"tue":[["16:00","00:00"]],"wed":[["16:00","00:00"]],"thu":[["16:00","01:00"]],"fri":[["16:00","03:00"]],"sat":[["14:00","03:00"]]}',
    'https://example.com/mock-alley'),
  ('fixture-hall', 'Fixture Hall', '800 Market St',
    st_geogfromtext('POINT(-90.1900 38.6270)'),
    (select id from coverage_areas where slug = 'downtown'),
    '{"thu":[["15:00","00:00"]],"fri":[["15:00","02:00"]],"sat":[["11:00","02:00"]],"sun":[["11:00","23:00"]]}',
    'https://example.com/fixture-hall');

insert into offerings (venue_id, beer_name, brand, format, size_oz, price, source, is_popular) values
  -- The Test Tap: cheap drafts, the value leader
  ((select id from venues where slug = 'the-test-tap'), 'Busch Light', 'Busch', 'draft', 16, 3.00, 'official_site', true),
  ((select id from venues where slug = 'the-test-tap'), 'Stag', 'Stag', 'can', 12, 3.50, 'official_site', true),
  ((select id from venues where slug = 'the-test-tap'), 'Civil Life American Brown', 'Civil Life', 'draft', 16, 6.00, 'official_site', false),
  -- Dev's Dive: cheapest sticker price but small pour (ranking edge case)
  ((select id from venues where slug = 'devs-dive'), 'PBR', 'Pabst', 'draft', 10, 2.50, 'admin_visit', true),
  ((select id from venues where slug = 'devs-dive'), 'High Life', 'Miller', 'bottle', 12, 3.75, 'admin_visit', true),
  ((select id from venues where slug = 'devs-dive'), 'PBR Pitcher', 'Pabst', 'pitcher', 60, 9.00, 'admin_visit', false),
  -- Stub Street Brews: craft-priced, size assumed (no size published)
  ((select id from venues where slug = 'stub-street-brews'), 'House IPA', null, 'draft', 16, 7.00, 'menu_photo', true),
  ((select id from venues where slug = 'stub-street-brews'), 'House Lager', null, 'draft', 16, 6.00, 'menu_photo', true),
  -- Mock Alley: mid-range downtown
  ((select id from venues where slug = 'mock-alley'), 'Bud Light', 'Budweiser', 'draft', 16, 5.00, 'official_site', true),
  ((select id from venues where slug = 'mock-alley'), 'Michelob Ultra', 'Michelob', 'bottle', 12, 4.50, 'official_site', false),
  -- Fixture Hall: user-reported (unverified) price
  ((select id from venues where slug = 'fixture-hall'), 'Coors Banquet', 'Coors', 'draft', 16, 4.00, 'user_report', true);

update offerings set size_assumed = true
  where venue_id = (select id from venues where slug = 'stub-street-brews');

insert into specials (venue_id, days_of_week, start_time, end_time, target_type, offering_id, category, deal_price, discount_amount, free_text) values
  -- Classic weekday happy hour: all drafts $1 off
  ((select id from venues where slug = 'mock-alley'), '{1,2,3,4,5}', '16:00', '19:00',
    'category', null, 'all_draft', null, 1.00, null),
  -- Specific-beer deal: $2 Busch Light drafts
  ((select id from venues where slug = 'the-test-tap'), '{2,4}', '17:00', '20:00',
    'offering', (select id from offerings where beer_name = 'Busch Light'
      and venue_id = (select id from venues where slug = 'the-test-tap')), null, 2.00, null, null),
  -- Midnight-crossing late-night window (Fri/Sat 10pm–1am)
  ((select id from venues where slug = 'devs-dive'), '{5,6}', '22:00', '01:00',
    'category', null, 'all_beer', null, 0.50, null),
  -- Free-text-only deal: visible on venue page, never ranked
  ((select id from venues where slug = 'fixture-hall'), '{6}', '11:00', '23:00',
    'category', null, 'all_beer', null, null, '$12 buckets during Cardinals home games');
