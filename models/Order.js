import { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postal_code: String,
    street_address: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  },
);

export const Order = models.Order || model('Order', OrderSchema);
