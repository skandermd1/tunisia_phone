import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 size={32} className="animate-spin text-forest" />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
