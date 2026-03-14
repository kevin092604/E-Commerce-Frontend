import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function StripePaymentForm({ onSuccess, total, submitting }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/pedidos` },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      await onSuccess(paymentIntent.id);
    }
  };

  const isLoading = processing || submitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-serif font-bold text-lg text-gray-900 dark:text-white mb-4">
          Pago seguro
        </h2>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-3">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-gray-900 dark:bg-amber-400 dark:text-gray-900 text-white font-bold py-4 rounded-full hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors text-sm uppercase tracking-wider disabled:opacity-60"
      >
        {isLoading ? "Procesando..." : `Pagar L ${Math.round(total).toLocaleString()}`}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        🔒 Pago procesado de forma segura por Stripe
      </p>
    </form>
  );
}
