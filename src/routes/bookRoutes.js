import express from "express";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
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

    // Upload the book cover image to Cloudinary
    const result = await cloudinary.uploader.upload(coverImg, {
      resource_type: "image",
      folder: "books",
    });

    const newBook = new Book({
      title,
      author,
      caption,
      category,
      coverImg: result.secure_url, // Use the secure URL from Cloudinary
      rating,
    });

    await newBook.save(); // Save the book to the database
    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books

router.get("/books", protectRoutes, async (req, res) => {
  try {
    const books = await Book.find(); // Use `Book` instead of `Books`
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
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete the book cover image from Cloudinary
    if (book.coverImg) {
      const publicId = book.coverImg.split("/").pop().split(".")[0]; // Extract public ID from URL
      await cloudinary.uploader.destroy(`books/${publicId}`);
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Save/Unsave a book

router.put("/saveBook/:id", protectRoutes, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book is already saved by the user
    if (user.saveBooks.includes(book._id)) {
      // Unsave the book
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { saveBooks: book._id },
      });
      res.status(200).json({ message: "Book unsaved successfully" });
    } else {
      // Save the book
      await User.findByIdAndUpdate(req.user._id, {
        $push: { saveBooks: book._id },
      });
      res.status(200).json({ message: "Book saved successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
