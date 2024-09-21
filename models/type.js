const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const TypeSchema = new Schema(
  {
    typeCode: { type: String, required: true, unique: true },
    typeName: {
      type: String,
      enum: [
        "Chinese Cuisine",
        "Western Cuisine",
        "Italian Cuisine",
        "Japanese Cuisine",
        "Mexican Cuisine",
        "Indian Cuisine",
        "Thai Cuisine",
        "French Cuisine",
        "Korean Cuisine",
      ],
      required: true,
      unique: true,
    },
    description: String,
    date: { type: Date, default: Date.now },
    author: String,
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
  },
  opts
);

TypeSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
});

module.exports = mongoose.model("Type", TypeSchema);
