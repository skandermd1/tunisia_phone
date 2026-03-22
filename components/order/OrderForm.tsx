"use client";

import { useState } from "react";
import { GOVERNORATES } from "@/lib/constants";

export interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_governorate: string;
  notes: string;
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  loading?: boolean;
}

export default function OrderForm({ onSubmit, loading }: OrderFormProps) {
  const [form, setForm] = useState<OrderFormData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    customer_governorate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});

  function validate(): boolean {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};

    if (!form.customer_name.trim()) {
      newErrors.customer_name = "Le nom est requis";
    }
    if (
      !form.customer_email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email.trim())
    ) {
      newErrors.customer_email = "Adresse email invalide";
    }
    if (!/^\d{8}$/.test(form.customer_phone.trim())) {
      newErrors.customer_phone = "Numero de telephone invalide (8 chiffres)";
    }
    if (!form.customer_address.trim()) {
      newErrors.customer_address = "L'adresse est requise";
    }
    if (!form.customer_city.trim()) {
      newErrors.customer_city = "La ville est requise";
    }
    if (!form.customer_governorate) {
      newErrors.customer_governorate = "Le gouvernorat est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  }

  function update(field: keyof OrderFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const inputClass = (field: keyof OrderFormData) =>
    `w-full px-4 py-2.5 border rounded-md text-sm focus:outline-none transition-colors ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-forest"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-bold text-lg text-gray-900 mb-4">
        Informations de livraison
      </h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet *
        </label>
        <input
          type="text"
          value={form.customer_name}
          onChange={(e) => update("customer_name", e.target.value)}
          className={inputClass("customer_name")}
          placeholder="Votre nom complet"
        />
        {errors.customer_name && (
          <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={form.customer_email}
          onChange={(e) => update("customer_email", e.target.value)}
          className={inputClass("customer_email")}
          placeholder="votre@email.com"
        />
        {errors.customer_email && (
          <p className="text-xs text-red-500 mt-1">{errors.customer_email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telephone *
        </label>
        <input
          type="tel"
          value={form.customer_phone}
          onChange={(e) => update("customer_phone", e.target.value)}
          className={inputClass("customer_phone")}
          placeholder="12345678"
          maxLength={8}
        />
        {errors.customer_phone && (
          <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>
        )}
      </div>

      {/* Governorate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gouvernorat *
        </label>
        <select
          value={form.customer_governorate}
          onChange={(e) => update("customer_governorate", e.target.value)}
          className={inputClass("customer_governorate")}
        >
          <option value="">Choisir un gouvernorat</option>
          {GOVERNORATES.map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>
        {errors.customer_governorate && (
          <p className="text-xs text-red-500 mt-1">
            {errors.customer_governorate}
          </p>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ville *
        </label>
        <input
          type="text"
          value={form.customer_city}
          onChange={(e) => update("customer_city", e.target.value)}
          className={inputClass("customer_city")}
          placeholder="Votre ville"
        />
        {errors.customer_city && (
          <p className="text-xs text-red-500 mt-1">{errors.customer_city}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse *
        </label>
        <textarea
          value={form.customer_address}
          onChange={(e) => update("customer_address", e.target.value)}
          className={inputClass("customer_address")}
          placeholder="Adresse complete de livraison"
          rows={3}
        />
        {errors.customer_address && (
          <p className="text-xs text-red-500 mt-1">
            {errors.customer_address}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optionnel)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-forest transition-colors"
          placeholder="Instructions speciales pour la livraison..."
          rows={2}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-forest hover:bg-forest-light text-white py-3 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours..." : "Confirmer la commande"}
      </button>
    </form>
  );
}
