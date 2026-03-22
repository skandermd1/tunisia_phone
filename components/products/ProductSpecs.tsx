export default function ProductSpecs({
  specs,
}: {
  specs: Record<string, string>;
}) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 text-sm mb-3">
        Fiche technique
      </h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {entries.map(([key, value], i) => (
              <tr
                key={key}
                className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2.5 font-medium text-gray-600 w-1/3">
                  {key}
                </td>
                <td className="px-4 py-2.5 text-gray-900">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
