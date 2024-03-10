import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import "./checkoutForm.css";
import { domainName } from "../../../API/config";

export default function CheckoutForm({ id }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${domainName}payment/${id}?confirmationStatus=success`,
      },
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 border border-[main-color] p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold mb-2">Contact Info</h3>
        <AddressElement options={{ mode: "billing" }} />
      </div>
      <div className="mb-4 border border-[main-color] p-5 rounded-lg my-2">
        <h3 className="text-2xl font-bold mb-2">Payment</h3>
        <PaymentElement
          options={{
            paymentMethodOrder: ["card"],
          }}
        />
      </div>
      <div className="w-full max-w-screen-lg">
        <button
          disabled={isLoading || !stripe || !elements}
          type="submit"
          className="bg-main-color text-white rounded-lg py-2 px-4 hover:bg-gray-800 focus:outline-none w-full transition-all duration-300 ease-in-out"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
      </div>
      {message && (
        <div
          className="flex justify-center my-4 text-red-600"
          id="payment-message"
        >
          {message}
        </div>
      )}
    </form>
  );
}
