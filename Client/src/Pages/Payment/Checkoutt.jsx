/* eslint-disable react/prop-types */
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Tech_Logit from "../../API/config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastMessage } from "../../utils/toasfiy.jsx";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../store/Slices/userSlice.jsx";
import image from "../../assets/contact/stripeLogo2.webp";

export default function CheckoutForm({
  id,
  customerId,
  CLIENT_SECRET,
  billing_details,
  email,
  stripeCustomer,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCards, setSavedCards] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [saveCard, setSaveCard] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //-------------------------------------save Card Details------------------------------------------------------
  const saveCardDetails = async (
    paymentMethodId,
    customerId,
    stripeCustomer
  ) => {
    try {
      const res = await Tech_Logit.post(
        "save-Card",
        {
          paymentMethodId: paymentMethodId,
          customerId: customerId,
          stripeCustomer: stripeCustomer,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  //-------------------------------------Get AllCardDetails------------------------------------------------------
  const getSavedCards = async () => {
    try {
      const response = await Tech_Logit.get(`${customerId}/saved-cards`);
      setSavedCards(response.data);
      if (response.data && response.data.length > 0) {
        setSelectedCard(response.data[0].paymentMethodId);
      }
    } catch (error) {
      console.error(error);
    }
  };
  //-------------------------------------------------------------------------------------------------------
  const billingDetails = {
    name: `${billing_details.firstName} ${billing_details.lastName}`,
    email: email,
    address: {
      line1: billing_details.address,
      postal_code: billing_details.zip_code,
      state: billing_details.city,
    },
  };
  //-------------------------------------handle Submit------------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    try {
      let paymentMethodId;
      if (selectedCard) {
        paymentMethodId = selectedCard;
      } else {
        const paymentMethod = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        });
        paymentMethodId = paymentMethod.paymentMethod.id;
      }
      setIsLoading(true);
      const result = await stripe.confirmCardPayment(CLIENT_SECRET, {
        payment_method: paymentMethodId,
      });
      if (result.error) {
        setIsLoading(false);
        setMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          if (saveCard) {
            await saveCardDetails(paymentMethodId, customerId, stripeCustomer);
          }
          setIsLoading(false);
          dispatch(fetchUser(customerId));
          navigate(`/orderRecieved/${id}`);
        } else {
          toastMessage(
            "error",
            "An error occurred while confirming the Payment "
          );
        }
      }
    } catch (err) {
      setMessage("An error occurred while writing a card number");
      setIsLoading(false);
    }
  };
  const toggleSaveCard = () => {
    setSaveCard(!saveCard);
  };
  useEffect(() => {
    getSavedCards();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 border border-[main-color] p-5 rounded-lg my-2">
          <h3 className="text-2xl font-bold mb-2">Card Information</h3>
          {savedCards?.length > 0 ? (
            <div>
              <div className="my-5">Saved Payment Method</div>
              {savedCards?.map((card) => (
                <label
                  key={card._id}
                  className={`block mb-2 cursor-pointer border border-slate-300 p-4 rounded-lg ${
                    selectedCard === card.paymentMethodId
                      ? "text-[main-color] bg-[#ecf1ff] border-green-600"
                      : "text-gray-700"
                  }`}
                >
                  <div className="flex flex-row justify-between">
                    <div className="ml-2">
                      <input
                        type="radio"
                        name="selectedCard"
                        value={card.paymentMethodId}
                        checked={selectedCard === card.paymentMethodId}
                        onChange={() => setSelectedCard(card.paymentMethodId)}
                        className="form-radio text-[main-color] focus:ring-[main-color] border-gray-200 mr-5 h-4 w-4"
                      />
                      {card.brand}
                    </div>
                    <div className="ml-2">**** **** **** {card.last4}</div>
                  </div>
                </label>
              ))}
              <label
                className={`block mb-2 cursor-pointer border border-slate-300 p-4 rounded-lg ${
                  selectedCard === null
                    ? "text-[main-color] bg-gray-100 border-green-600 border-[2px]"
                    : "text-gray-700"
                }`}
              >
                <div className="flex flex-row justify-between">
                  <div className="ml-2">
                    <input
                      type="radio"
                      name="selectedCard"
                      value="new"
                      checked={selectedCard === null}
                      onChange={() => setSelectedCard(null)}
                      className="form-radio text-[main-color] focus:ring-[main-color] border-gray-200 mr-5 h-4 w-4"
                    />
                    Add a New Card
                  </div>
                </div>
              </label>
            </div>
          ) : (
            ""
          )}
          {selectedCard === null || savedCards?.length === 0 ? (
            <>
              <CardElement className="mt-3 mb-4 border border-[main-color] p-4 rounded-lg my-2 bg-[#F5F7F9]" />
              <label className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={toggleSaveCard}
                  className="form-checkbox h-4 w-4 text-green-500 border-green-400 focus:ring-green-400"
                />
                <span className="text-sm text-gray-600">
                  Save My Card details
                </span>
              </label>
            </>
          ) : null}
        </div>
        <div className="w-full max-w-screen-lg">
          <button
            disabled={isLoading || !stripe || !elements}
            type="submit"
            className={`bg-main-color text-white rounded-lg py-2 px-4 focus:outline-none w-full transition-all duration-300 ease-in-out`}
          >
            <span id="button-text">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
          <div className="flex flex-row items-center my-3">
            <img src={image} alt="stripe" className="h-[30px] w-[30px]" />
            <span className="mx-2">Powered by Stripe</span>
          </div>
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
    </>
  );
}
