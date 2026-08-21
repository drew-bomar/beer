import { sql } from "@/lib/db";
import VenueForm, { type District } from "../../../_components/VenueForm";

export const metadata = { title: "New venue · Beer admin" };
export const dynamic = "force-dynamic";

export default async function NewVenuePage() {
  const districts = await sql<District[]>`
    select id, name from coverage_areas order by name
  `;
  return (
    <div>
      <h1 className="text-lg font-semibold">New venue</h1>
      <div className="mt-4 max-w-2xl">
        <VenueForm districts={districts} venue={null} />
      </div>
    </div>
  );
}
