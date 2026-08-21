import AreaForm from "../../../_components/AreaForm";

export const metadata = { title: "New coverage area · Beer admin" };

export default function NewAreaPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold">New coverage area</h1>
      <div className="mt-4">
        <AreaForm area={null} />
      </div>
    </div>
  );
}
