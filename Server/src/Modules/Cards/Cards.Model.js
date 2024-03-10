// models/Card.js
import { Schema, model } from "mongoose";

const cardSchema = new Schema({
  customerId: {
    type: String,
    required: true,
  },
  stripeCustomer: {
    type: String,
    required: true,
  },
  paymentMethodId: {
    type: String,
    required: true,
  },
  last4: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

export default model("Card", cardSchema);
