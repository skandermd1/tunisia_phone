import { PackageOpen } from "lucide-react";

export default function EmptyState({
  message = "Aucun resultat trouve.",
  icon: Icon = PackageOpen,
}: {
  message?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
      <Icon size={48} className="text-gray-300" />
      <p className="text-base">{message}</p>
    </div>
  );
}
