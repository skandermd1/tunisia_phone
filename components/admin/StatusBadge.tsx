const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  pending: { label: 'En attente', classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmee', classes: 'bg-blue-100 text-blue-800' },
  processing: { label: 'En cours', classes: 'bg-orange-100 text-orange-800' },
  shipped: { label: 'Expediee', classes: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livree', classes: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulee', classes: 'bg-red-100 text-red-800' },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, classes: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}
