import stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET;
const stripeInstance = new stripe(stripeSecretKey);
//-------------------------------------------------------Stripe----------------------------------------------

const createPayment= async (req, res) => {
    const { amount,shippingInformation,customerId,orderId } = req.body;
    const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: amount,
        currency: "usd",
        automatic_payment_methods: {
        enabled: true,
    },
    shipping: {
      name: `${shippingInformation.firstName} ${shippingInformation.lastName}`,
      address: {
        line1: shippingInformation.address,
        city: shippingInformation.city,
        postal_code: shippingInformation.ZipCode,
        country: shippingInformation.country,
      },
    },
    metadata: {
      customer_id: customerId,
      orderId: orderId,
    },
  });
  res.send({ clientSecret: paymentIntent.client_secret });
};
//--------------------------------------------------Express checkout----------------------------------------------------
//  const createCheckoutPayment= async (req, res) => {
//   try {
//     const { paymentIntentId } = req.body;
//     // Retrieve the payment intent from Stripe
//     const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       // Payment was successful
//       // You can perform any additional actions here (e.g., update your database, send email confirmation, etc.)
//       res.status(200).json({ message: 'Payment succeeded' });
//     } else {
//       // Payment failed or has not succeeded yet
//       res.status(400).json({ message: 'Payment failed' });
//     }
//   } catch (error) {
//     console.error('Error confirming payment:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
//---------------------------------
export default createPayment;
