import {
  ClipboardCheck,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const STATUS_STEPS = [
  { key: "pending", label: "En attente", icon: ClipboardCheck },
  { key: "confirmed", label: "Confirmee", icon: Package },
  { key: "shipped", label: "Expediee", icon: Truck },
  { key: "delivered", label: "Livree", icon: CheckCircle2 },
];

function getStepIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : -1;
}

export default function OrderTracking({ order }: { order: Order }) {
  const isCancelled = order.status === "cancelled";
  const currentStep = getStepIndex(order.status);

  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Commande:</span>{" "}
            <span className="font-semibold text-gray-900">
              #{order.order_number}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Client:</span>{" "}
            <span className="text-gray-900">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Telephone:</span>{" "}
            <span className="text-gray-900">{order.customer_phone}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>{" "}
            <span className="text-gray-900">
              {new Date(order.created_at).toLocaleDateString("fr-TN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <XCircle size={24} />
          <div>
            <p className="font-semibold">Commande annulee</p>
            <p className="text-sm mt-0.5">
              Cette commande a ete annulee.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-start justify-between">
            {STATUS_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;

              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        i < currentStep ? "bg-forest" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-forest text-white"
                        : "bg-gray-200 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-forest/20" : ""}`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs mt-2 text-center ${
                      isCompleted
                        ? "text-forest font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <h3 className="px-5 py-3 bg-gray-50 font-semibold text-sm text-gray-900 border-b border-gray-200">
            Articles commandes
          </h3>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.variant_label} x{item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
