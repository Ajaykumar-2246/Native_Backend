import express from "express";
import { Book } from "../models/bookModel.js";
import { protectRoutes } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Create a new book
router.post("/create", protectRoutes, async (req, res) => {
  try {
    const { title, author, caption, category, coverImg, rating } = req.body;
    if (!title || !author || !caption || !category || !coverImg || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    const allowedCategories = [
      "Fiction",
      "Non-Fiction",
      "Science",
      "History",
      "Fantasy",
      "Biography",
      "Other",
    ];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const result = await cloudinary.uploader.upload(coverImg, {
      resource_type: "image",
      folder: "books",
    });

    const newBook = new Book({
      userId: req.user._id,
      title,
      author,
      caption,
      category,
      coverImg: result.secure_url,
      rating,
    });

    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user books
router.get("/userbooks", protectRoutes, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a book
router.delete("/delete/:id", protectRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }

    const publicId = book.coverImg.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`books/${publicId}`);

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
