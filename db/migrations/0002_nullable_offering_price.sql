-- Allow roster-only offerings: a venue's known tap/bottle list imported without
-- prices (e.g. a menu that names beers but prints no dollars). Unpriced rows are
-- excluded from ranking and deal math everywhere; they exist so the venue page
-- can show the list and prompt users to supply prices (BEE-32 finding).
-- price_per_12oz is a generated column and becomes null automatically.

alter table offerings alter column price drop not null;
-- Updates archive the previous row, so history must accept unpriced rows too.
alter table offering_history alter column price drop not null;
