import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
    },
    caption: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      required: [true, "Book cover image is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
