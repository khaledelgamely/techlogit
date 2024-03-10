//-----------------------------------------------------------------------------------------------------------------------------------------
import CheckoutForm from "./Checkoutt";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FaExclamationCircle } from "react-icons/fa";
import { countries } from "../../constants/countries";
import Tech_Logit from "../../API/config";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotFoundPage from "../NotFoundPage";
import { selectCurrenct } from "../../store/Slices/currency";
import CurrencySign from "../../utils/CurrencySign";
import { fetchUser } from "../../store/Slices/userSlice";
import ConfirmModal from "../../Components/PaymentComponents/Stripe/ConfirmModal";
import { toastMessage } from "../../utils/toasfiy.jsx";
import Loader from "../../Shared/Loader/Loader.jsx";

export default function PaymentPage() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [expressLoading, setExpressLoading] = useState(true);
  const [expressError, setExpressError] = useState(false);
  const [ShowContactInformation, setShowContact] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const SignySelector = useSelector((state) => state.currency?.selected);
  const currencySelector = useSelector((state) => state.currency?.currency);
  const { loading } = useSelector((state) => state.user);
  const { selected } = useSelector((state) => state.currency);
  const dispatch = useDispatch();
  const { email, _id, ContactInformation, orders, firstName, lastName } =
    useSelector((state) => state.user?.user);
  const amountInCents = orderDetails?.totalPrice * 100;
  const contactInfos = {
    firstName: ContactInformation?.firstName,
    lastName: ContactInformation?.lastName,
    address: ContactInformation?.address,
    city: ContactInformation?.city,
    country: ContactInformation?.country,
  };

  const [shippingInformation, setShipingInformation] = useState(contactInfos);
  const userName = firstName + " " + lastName;

  useEffect(() => {
    const orderDetails = orders?.find((order) => order._id === id);
    if (!orderDetails) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
    setOrderDetails(orderDetails);
  }, [_id, dispatch, id, orders]);

  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    if (storedCurrency) {
      dispatch(selectCurrenct(storedCurrency));
    }
  }, []);
  //------------------------------------------------------------------Stripe--------------------------------------------------------------
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeCustomer, setStripeCustomer] = useState("");

  useEffect(() => {
    if (amountInCents) {
      Tech_Logit.post(
        "create-payment-intent",
        {
          amount: amountInCents,
          customerId: _id,
          orderId: id,
          email: email,
          name: userName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          setClientSecret(response.data.clientSecret);
          setStripeCustomer(response.data.stripeCustomer);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [_id, amountInCents, userName, email, id]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#F5F7F9",
      colorText: "#333",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "4.5px",
      borderRadius: "0.375rem",
    },
    rules: {
      ".Input": {
        borderColor: "transparent",
      },
    },
  };
  const options = {
    clientSecret,
    appearance,
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  //-------------------------------------------------------------------------Express Checkout--------------------------------------------------------------

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const confirmationStatus = urlParams.get("confirmationStatus");
    if (confirmationStatus === "success") {
      setShowConfirmModal(true);
    }
  }, []);
  useEffect(() => {
    if (amountInCents) {
      const loadStripeAndRenderElement = async () => {
        const stripePromises = loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISH_KEY
        );
        const stripe = await stripePromises;
        const elements = stripe.elements({
          locale: "en",
          mode: "payment",
          amount: amountInCents,
          currency: "usd",
        });
        try {
          const expressCheckoutElement = elements.create("expressCheckout");
          expressCheckoutElement.mount("#express-checkout-element");
          expressCheckoutElement.on("confirm", async (event) => {
            try {
              let customerName;
              if (event.billingDetails.name) {
                customerName = event.billingDetails.name;
              } else {
                customerName = userName;
              }
              const response = await Tech_Logit.post(
                "create-payment-intent-express",
                {
                  amount: amountInCents,
                  customerId: _id,
                  orderId: id,
                  email: email,
                  name: customerName,
                }
              );
              if (response.status === 200) {
                const client_secret = response.data.clientSecret;
                const result = await stripe.confirmPayment({
                  elements,
                  clientSecret: client_secret,
                  confirmParams: {
                    return_url: `${
                      import.meta.env.VITE_DOMAIN_URL
                    }orderRecieved/${id}`,
                  },
                });
                if (result.error) {
                  toastMessage(
                    "error",
                    "An error occurred while confirming the Payment "
                  );
                  console.error("Payment failed:", result.error.message);
                }
              } else {
                console.error("Payment failed.");
                toastMessage(
                  "error",
                  "An error occurred while confirming the Payment "
                );
              }
            } catch (error) {
              console.error("Payment error:", error);
              toastMessage(
                "error",
                "An error occurred while confirming the Payment "
              );
            }
          });
        } catch (err) {
          setExpressError(true);
        } finally {
          setExpressError(false);
          setTimeout(() => {
            setExpressLoading(false);
          }, 1850);
        }
      };
      loadStripeAndRenderElement();
    }
  }, [amountInCents, id, expressLoading]);

  const handleModalClose = () => {
    setShowConfirmModal(false);
  };
  //-----------------------------------------------------------------------------------------------------------------------------
  const editContactInfo = async (shippingInformation) => {
    if (contactInfos != shippingInformation) {
      await Tech_Logit.patch(`user/${_id}/contactInfo`, shippingInformation, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatch(fetchUser(_id));
    }
  };
  //------------------------------------------------Formik And Yup validation--------------------------------------------------------------------------------
  {
    /* Yup Validation  */
  }
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z]+$/, "First name should only contain letters")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters"),

    lastName: Yup.string()
      .required("Last name is required")
      .matches(/^[A-Za-z]+$/, "Last name should only contain letters")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters"),

    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(100, "Address must be at most 100 characters"),

    city: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters"),
  });
  {
    /* Formik Configuration  */
  }
  const initialValues = {
    firstName: ContactInformation?.firstName,
    lastName: ContactInformation?.lastName,
    address: ContactInformation?.address,
    city: ContactInformation?.city,
    country: ContactInformation?.country,
  };
  const handleSubmit = (values) => {
    setShowContact(false);
    setShipingInformation(values);
    editContactInfo(values);
  };

  //----------------------------------------------------------------------------------------------------------

  return (
    <>
      {loading ? (
        <Loader />
      ) : showErrorModal ? (
        <NotFoundPage />
      ) : (
        <>
          <div className="flex mt-24 mb-5 justify-center">
            {/* <!-- Header --> */}
            <h3 className="font-bold mb-5 mt-3 text-center text-[32px] md:text-[36px] mx-auto">
              {" "}
              Payment <span className="text-main-color">Method</span>
            </h3>{" "}
          </div>

          {/* <!-- Right and left column containers */}
          <div className="flex justify-center min-h-screen min-w-screen p-5 xs:flex-col-reverse  md:flex-row ">
            {/* <!-- left column container with form --> */}
            <div className="flex items-center flex-col w-full md:w-1/2">
              {/* <!-- Choose Payment Types column container with form --> */}
              <div className="xs:w-full sm:w-11/12 lg:w-10/12 p-5 mb-5">
                {ShowContactInformation ? (
                  <>
                    <h3 className=" mb-4 text-xl md:text-[24px] text-start leading-8 font-semibold ">
                      Choose Payment Types
                    </h3>
                    <div className="border border-stone-300 mb-10"></div>
                    <div className="flex flex-col border border-stone-300 p-3 justify-center mb-4 min-h-[100px]">
                      {/* This is where the Express Checkout element will be rendered */}
                      {expressLoading ? (
                        <>
                          <div className="flex justify-center flex-col sm:flex-row items-center">
                            {/* Each div represents a payment method */}
                            {["PayPal", "Apple Pay", "Google Pay"].map(
                              (method, index) => (
                                <div
                                  key={index}
                                  className="flex payment-method-skeleton justify-center animate-pulse w-full"
                                >
                                  <div className="w-full xs:my-1 sm:w-32 md:w-24 lg:w-28 xl:w-44 h-12 bg-gray-300 rounded"></div>{" "}
                                  {/* Placeholder for payment method name */}
                                </div>
                              )
                            )}
                          </div>
                        </>
                      ) : expressError ? (
                        <>
                          <div className="flex justify-center">
                            There is an Error at Express Checkout refresh the
                            page again
                          </div>
                        </>
                      ) : (
                        <div>
                          <div id="express-checkout-element"></div>
                        </div>
                      )}
                    </div>
                    <div className="text-center flex flex-row items-center justify-center">
                      <div className="border-t border-stone-300 inline-block w-1/6"></div>
                      <span className="text-stone-500  inline-block w-4/6">
                        Or continue bellow to pay with a credit card{" "}
                      </span>
                      <div className="border-t border-stone-300 inline-block w-1/6"></div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* Content for Credit Card payment */}
                <div className="creditCardDiv">
                  {ShowContactInformation ? (
                    <Formik
                      initialValues={initialValues}
                      onSubmit={handleSubmit}
                      validationSchema={validationSchema}
                    >
                      {(formik) => (
                        <Form>
                          <h3 className=" mb-4 mt-10 text-[18px] lg:text-[24px] leading-5 font-semibold">
                            Contact Information
                          </h3>
                          <div className="border border-stone-300 mb-5"></div>
                          <div className="flex flex-row mb-6">
                            <div className="w-1/2 pr-2">
                              <label className="fieldLable" htmlFor="firstName">
                                First Name
                              </label>
                              <Field
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="field h-[3rem]"
                                placeholder="Sam"
                              />
                              {formik.touched.firstName &&
                                formik.errors.firstName && (
                                  <div className="xs:text-[12px] sm:text-[16px] text-red-600 flex items-center">
                                    <span className="text-red-700 mx-2">
                                      <FaExclamationCircle />
                                    </span>{" "}
                                    {formik.errors.firstName}
                                  </div>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                              <label className="fieldLable" htmlFor="lastName">
                                Last Name
                              </label>
                              <Field
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="field h-[3rem]"
                                placeholder="Sam"
                              />
                              {formik.touched.lastName &&
                                formik.errors.lastName && (
                                  <div className="xs:text-[12px] sm:text-[16px] text-red-600 flex items-center">
                                    <span className="text-red-700 mx-2">
                                      <FaExclamationCircle />
                                    </span>{" "}
                                    {formik.errors.lastName}
                                  </div>
                                )}
                            </div>
                          </div>
                          {/* country and city inputs */}
                          <div className="flex flex-row mb-6">
                            <div className="w-1/2 pr-2 mr-2">
                              <label
                                className="text-neutral-700 text-md transition-transform transform-gpu origin-top-left"
                                htmlFor="country"
                              >
                                Country
                              </label>
                              <select
                                id="country"
                                name="country"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full h-[3rem] text-neutral-900 bg-[#F5F7F9] border-neutral-300 rounded-lg focus:outline-none focus:ring focus:border-primary my-1 px-2 py-2"
                              >
                                {ContactInformation?.country === "" ? (
                                  <option
                                    value="default"
                                    selected
                                    className="text-[#9d9d9d] !important xs:test-sm"
                                  >
                                    Select country
                                  </option>
                                ) : (
                                  <option value="defaultCountry" selected>
                                    {ContactInformation?.country}
                                  </option>
                                )}
                                {countries.map((country) => (
                                  <option
                                    key={country.value}
                                    value={country.label}
                                  >
                                    {country.label}
                                  </option>
                                ))}
                              </select>
                              {/* Display error message */}
                              {formik.touched.country &&
                                formik.errors.country && (
                                  <div className="xs:text-[12px] sm:text-[16px] text-red-600flex items-center">
                                    <span className="text-red-700 mx-2">
                                      <FaExclamationCircle />
                                    </span>
                                    {formik.errors.country}
                                  </div>
                                )}
                            </div>

                            {/*city inputs */}
                            <div className=" w-1/2">
                              <label className="fieldLable" htmlFor="city">
                                City
                              </label>
                              <Field
                                type="text"
                                id="city"
                                name="city"
                                className="field h-[3rem]"
                                placeholder="Gurgaon"
                              />
                              {formik.touched.city && formik.errors.city && (
                                <div className="xs:text-[12px] sm:text-[16px] text-red-600 flex items-center">
                                  <span className="text-red-700 mx-2">
                                    <FaExclamationCircle />
                                  </span>{" "}
                                  {formik.errors.city}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full">
                            {/* address input */}
                            <label className="fieldLable" htmlFor="address">
                              Address{" "}
                            </label>
                            <Field
                              type="address"
                              id="address"
                              name="address"
                              className="w-full h-[3rem] text-neutral-900 bg-[#F5F7F9] border-neutral-300  placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-4 py-2"
                              placeholder="Bangalore,Akshya Nagar 1st Block 1st Cross."
                            />
                            {/* Display error message */}
                            {formik.touched.address &&
                              formik.errors.address && (
                                <div className="xs:text-[12px] sm:text-[16px] text-red-600 flex items-center">
                                  <span className="text-red-700 mx-2">
                                    <FaExclamationCircle />
                                  </span>{" "}
                                  {formik.errors.address}
                                </div>
                              )}
                          </div>
                          <div className="flex mb-6">
                            <button
                              className={`xs:py-[7px] md:py-[9px] ${
                                (formik.errors &&
                                  Object.keys(formik.errors).length !== 0) ||
                                Object.values(formik.values).every(
                                  (value) => value == ""
                                ) ||
                                formik.values.country == "default" ||
                                formik.values.country == ""
                                  ? "bg-gray-400"
                                  : "bg-main-color"
                              } rounded-[3rem] xs:h-[50px] lg:text-lg text-white items-center mt-4 xs:w-full`}
                              disabled={
                                (formik.errors &&
                                  Object.keys(formik.errors).length !== 0) ||
                                Object.values(formik.values).every(
                                  (value) => value == ""
                                ) ||
                                formik.values.country == "default" ||
                                formik.values.country == ""
                              }
                            >
                              Continue To Payment
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    ""
                  )}
                  {clientSecret && !ShowContactInformation && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm
                        id={id}
                        customerId={_id}
                        CLIENT_SECRET={clientSecret}
                        billing_details={shippingInformation}
                        email={email}
                        stripeCustomer={stripeCustomer}
                        totalPrice={orderDetails?.totalPrice}
                      />
                    </Elements>
                  )}
                </div>
              </div>
            </div>
            {/* <!-- Right column container with background--> */}
            <div className="flex flex-col items-center justify-start md:w-1/2 w-full ">
              <div className="xs:w-full sm:w-11/12 lg:w-10/12 bg-[#ECF1FF] rounded-3xl h-[100%] mb-14 py-14 px-6">
                <div>
                  <h4 className="mb-4 text-[22px] text-start leading-3 font-[500]  md:text-[23px] lg:text-[26px]">
                    Purchase summary
                  </h4>
                  <p className="mb-12 text-[14px] md:text-[16px] text-start ">
                    <span className="text-[18px] mr-">Billed in</span>
                    <select
                      onChange={(event) => {
                        const selectedCurrency = event.target.value;
                        dispatch(selectCurrenct(selectedCurrency));
                        localStorage.setItem(
                          "selectedCurrency",
                          selectedCurrency
                        );
                      }}
                      id="currency-select"
                      style={{
                        maxWidth: "140px",
                        backgroundColor: "#ecf1ff",
                        color: "#1B75BC",
                        fontSize: "18px",
                      }}
                      value={selected}
                    >
                      <option value="USD">USD</option>
                      <option value="AED">AED</option>
                      <option value="AFN">AFN</option>
                      <option value="ALL">ALL</option>
                      <option value="AMD">AMD</option>
                      <option value="ANG">ANG</option>
                      <option value="AOA">AOA</option>
                      <option value="ARS">ARS</option>
                      <option value="AUD">AUD</option>
                      <option value="AWG">AWG</option>
                      <option value="AZN">AZN</option>
                      <option value="BAM">BAM</option>
                      <option value="BBD">BBD</option>
                      <option value="BDT">BDT</option>
                      <option value="BGN">BGN</option>
                      <option value="BHD">BHD</option>
                      <option value="BIF">BIF</option>
                      <option value="BMD">BMD</option>
                      <option value="BND">BND</option>
                      <option value="BOB">BOB</option>
                      <option value="BRL">BRL</option>
                      <option value="BSD">BSD</option>
                      <option value="BTN">BTN</option>
                      <option value="BWP">BWP</option>
                      <option value="BYN">BYN</option>
                      <option value="BZD">BZD</option>
                      <option value="CAD">CAD</option>
                      <option value="CDF">CDF</option>
                      <option value="CHF">CHF</option>
                      <option value="CLP">CLP</option>
                      <option value="CNY">CNY</option>
                      <option value="COP">COP</option>
                      <option value="CRC">CRC</option>
                      <option value="CUP">CUP</option>
                      <option value="CVE">CVE</option>
                      <option value="CZK">CZK</option>
                      <option value="DJF">DJF</option>
                      <option value="DKK">DKK</option>
                      <option value="DOP">DOP</option>
                      <option value="DZD">DZD</option>
                      <option value="EGP">EGP</option>
                      <option value="ERN">ERN</option>
                      <option value="ETB">ETB</option>
                      <option value="EUR">EUR</option>
                      <option value="FJD">FJD</option>
                      <option value="FKP">FKP</option>
                      <option value="FOK">FOK</option>
                      <option value="GBP">GBP</option>
                      <option value="GEL">GEL</option>
                      <option value="GGP">GGP</option>
                      <option value="GHS">GHS</option>
                      <option value="GIP">GIP</option>
                      <option value="GMD">GMD</option>
                      <option value="GNF">GNF</option>
                      <option value="GTQ">GTQ</option>
                      <option value="GYD">GYD</option>
                      <option value="HKD">HKD</option>
                      <option value="HNL">HNL</option>
                      <option value="HRK">HRK</option>
                      <option value="HTG">HTG</option>
                      <option value="HUF">HUF</option>
                      <option value="IDR">IDR</option>
                      <option value="ILS">ILS</option>
                      <option value="IMP">IMP</option>
                      <option value="INR">INR</option>
                      <option value="IQD">IQD</option>
                      <option value="IRR">IRR</option>
                      <option value="ISK">ISK</option>
                      <option value="JEP">JEP</option>
                      <option value="JMD">JMD</option>
                      <option value="JOD">JOD</option>
                      <option value="JPY">JPY</option>
                      <option value="KES">KES</option>
                      <option value="KGS">KGS</option>
                      <option value="KHR">KHR</option>
                      <option value="KID">KID</option>
                      <option value="KMF">KMF</option>
                      <option value="KRW">KRW</option>
                      <option value="KWD">KWD</option>
                      <option value="KYD">KYD</option>
                      <option value="KZT">KZT</option>
                      <option value="LAK">LAK</option>
                      <option value="LBP">LBP</option>
                      <option value="LKR">LKR</option>
                      <option value="LRD">LRD</option>
                      <option value="LSL">LSL</option>
                      <option value="LYD">LYD</option>
                      <option value="MAD">MAD</option>
                      <option value="MDL">MDL</option>
                      <option value="MGA">MGA</option>
                      <option value="MKD">MKD</option>
                      <option value="MMK">MMK</option>
                      <option value="MNT">MNT</option>
                      <option value="MOP">MOP</option>
                      <option value="MRU">MRU</option>
                      <option value="MUR">MUR</option>
                      <option value="MVR">MVR</option>
                      <option value="MWK">MWK</option>
                      <option value="MXN">MXN</option>
                      <option value="MYR">MYR</option>
                      <option value="MZN">MZN</option>
                      <option value="NAD">NAD</option>
                      <option value="NGN">NGN</option>
                      <option value="NIO">NIO</option>
                      <option value="NOK">NOK</option>
                      <option value="NPR">NPR</option>
                      <option value="NZD">NZD</option>
                      <option value="OMR">OMR</option>
                      <option value="PAB">PAB</option>
                      <option value="PEN">PEN</option>
                      <option value="PGK">PGK</option>
                      <option value="PHP">PHP</option>
                      <option value="PKR">PKR</option>
                      <option value="PLN">PLN</option>
                      <option value="PYG">PYG</option>
                      <option value="QAR">QAR</option>
                      <option value="RON">RON</option>
                      <option value="RSD">RSD</option>
                      <option value="RUB">RUB</option>
                      <option value="RWF">RWF</option>
                      <option value="SAR">SAR</option>
                      <option value="SBD">SBD</option>
                      <option value="SCR">SCR</option>
                      <option value="SDG">SDG</option>
                      <option value="SEK">SEK</option>
                      <option value="SGD">SGD</option>
                      <option value="SHP">SHP</option>
                      <option value="SLL">SLL</option>
                      <option value="SOS">SOS</option>
                      <option value="SRD">SRD</option>
                      <option value="SSP">SSP</option>
                      <option value="STN">STN</option>
                      <option value="SYP">SYP</option>
                      <option value="SZL">SZL</option>
                      <option value="THB">THB</option>
                      <option value="TJS">TJS</option>
                      <option value="TMT">TMT</option>
                      <option value="TND">TND</option>
                      <option value="TOP">TOP</option>
                      <option value="TRY">TRY</option>
                      <option value="TTD">TTD</option>
                      <option value="TVD">TVD</option>
                      <option value="TWD">TWD</option>
                      <option value="TZS">TZS</option>
                      <option value="UAH">UAH</option>
                      <option value="UGX">UGX</option>
                      <option value="UYU">UYU</option>
                      <option value="UZS">UZS</option>
                      <option value="VES">VES</option>
                      <option value="VND">VND</option>
                      <option value="VUV">VUV</option>
                      <option value="WST">WST</option>
                      <option value="XAF">XAF</option>
                      <option value="XCD">XCD</option>
                      <option value="XDR">XDR</option>
                      <option value="XOF">XOF</option>
                      <option value="XPF">XPF</option>
                      <option value="XPF">YER</option>
                      <option value="XPF">ZAR</option>
                      <option value="XPF">ZMW</option>
                      <option value="XPF">ZWL</option>
                    </select>
                  </p>
                </div>
                <div>
                  <div className="flex flex-row justify-between">
                    <h4 className="mb-4 text-[18px] lg:text-[22px] leading-5 font-[500]">
                      {orderDetails?.title}
                    </h4>
                    <h2 className="mb-4 mr-4 text-[20px] md:text-[20px] lg:text-[24px] leading-3 font-[700]">
                      {(
                        orderDetails?.totalPrice *
                        currencySelector[SignySelector]
                      ).toFixed(2)}{" "}
                      {CurrencySign[SignySelector]}{" "}
                    </h2>
                  </div>
                  {orderDetails?.chossen?.map((item) =>
                    Object?.values(item)?.map((item) => (
                      <p
                        key={item?._id}
                        className="text-[12px] md:text-[18px] text-start  mb-2 font-bold"
                      >
                        {Object.entries(item.title).map(([key, value]) => (
                          <p key={key} className="font-bold">
                            {key}: {value}
                          </p>
                        ))}
                      </p>
                    ))
                  )}
                </div>
                <div className="border border-stone-300 mb-10"></div>
                <div className="flex flex-row justify-between mt-14">
                  <h4 className="mb-4 text-[20px] md:text-[22px] leading-3 font-[500] text-main-color ">
                    Total
                  </h4>
                  <h2 className="mb-4 mr-4 text-[20px] md:text-[26px] leading-3 font-[700] text-main-color">
                    {(
                      orderDetails?.totalPrice * currencySelector[SignySelector]
                    ).toFixed(2)}{" "}
                    {CurrencySign[SignySelector]}{" "}
                  </h2>
                </div>

                <div className="flex flex-col justify-start w-full mt-10 px-3">
                  <h2 className="text-lg font-normal">Shop with Confidence</h2>
                  <h4 className="text-base font-normal mt-2">
                    Your orders are safe and secure with us
                  </h4>
                  <ul className="mt-3">
                    <li className="text-base font-[300] mt-1 list-none">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-500 mr-2"
                      />
                      100% Money-Back Guarantee
                    </li>
                    <li className="text-base font-[300] mt-1 list-none">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-500 mr-2"
                      />
                      No Hassle Returns
                    </li>
                    <li className="text-base font-[300] mt-1 list-none">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-500 mr-2"
                      />
                      Secured Transactions
                    </li>
                    <li className="text-base font-[300] mt-1 list-none">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-500 mr-2"
                      />
                      30 days money back guarantee
                      <ul>
                        <li className="list-none text-sm ">
                          (we offer 30 days money back if you are unhappy with
                          our services)
                        </li>
                      </ul>
                    </li>
                    {/* Add more list items as needed */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {showConfirmModal && (
            <ConfirmModal
              onClose={handleModalClose}
              orderNumber={id}
              amount={orderDetails?.totalPrice}
            />
          )}
        </>
      )}
    </>
  );
}
