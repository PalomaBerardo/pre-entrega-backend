const { Schema, model } = require('mongoose');

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String },
    category: { type: String, index: true },
    status: { type: Boolean, default: true },
    thumbnails: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = model('Product', ProductSchema);