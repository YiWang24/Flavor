const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const ReviewSchema = new Schema({
    content: String,
    rating: Number,
    date: { type: Date, default: Date.now },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
MenuSchema.virtual("formattedDate").get(function () {
    return this.date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  });
module.exports = mongoose.model("Review", ReviewSchema);

