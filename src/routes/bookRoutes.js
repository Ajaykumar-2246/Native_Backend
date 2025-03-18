import express from "express";
import { Book } from "../models/bookModel.js";
import { protectRoutes } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Create a new book
router.post("/create", protectRoutes, async (req, res) => {
  try {
    const { title, author, caption, coverImg, rating } = req.body;

    // Validate required fields
    if (!title || !author || !caption || !coverImg || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate rating range
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(coverImg, {
      resource_type: "image",
      folder: "books",
    });

    // Create new book
    const newBook = new Book({
      userId: req.user._id,
      title,
      author,
      caption,
      coverImg: result.secure_url,
      rating,
    });

    // Save the book to the database
    await newBook.save();
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user books
router.get("/userbooks", protectRoutes, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id });
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a book
router.delete("/delete/:id", protectRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    // Check if the book exists
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check if the user is authorized to delete the book
    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this book" });
    }

    // Delete the image from Cloudinary
    const publicId = book.coverImg.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`books/${publicId}`);

    // Delete the book from the database
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
