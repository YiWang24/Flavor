const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const MenuSchema = new Schema(
  {
    title: String,
    description: String,
    date: { type: Date, default: Date.now },
    type: {
      type: Schema.Types.ObjectId,
      ref: "Type",
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true },
  opts
);

MenuSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
});

MenuSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    console.log("delete");
    // await Review.deleteMany({
    //   _id: {
    //     $in: doc.reviews,
    //   },
    // });
      await Image.deleteMany({
        _id: {
          $in: doc.images,
        },
      });
  }
});

module.exports = mongoose.model("Menu", MenuSchema);
