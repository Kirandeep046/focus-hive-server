import express from "express";
import { v2 as cloudinary } from "cloudinary";
import Note from "../Models/Note.js";
import Subject from "../Models/Subject.js";
import StudyContent from "../Models/StudyContent.js";
import upload from "../middleware/upload.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 📌 UPLOAD PDF
router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const { subjectId, chapterTitle, title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    let pdfUrl = `/uploads/${req.file.filename}`;

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "raw",
          folder: "focusHive_notes",
        });

        if (uploadResult?.secure_url) {
          pdfUrl = uploadResult.secure_url;
        }
      } catch (uploadError) {
        console.warn("Cloudinary upload failed, using local fallback:", uploadError.message);
      }
    }

    const note = await Note.create({
      subjectId,
      chapterTitle,
      title,
      pdfUrl,
      fileName: req.file.originalname,
    });

    res.json({
      message: "Note uploaded successfully",
      note,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 📌 GET NOTES BY SUBJECT NAME
router.get("/subject/:name", async (req, res) => {
  try {
    const subjectName = req.params.name;

    const subject = await Subject.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${subjectName}$`, "i") } },
        { subject: { $regex: new RegExp(`^${subjectName}$`, "i") } },
      ],
    });

    if (subject) {
      const notes = await Note.find({ subjectId: subject._id });
      const studyContent = await StudyContent.findOne({
        subject: { $regex: new RegExp(`^${subjectName}$`, "i") },
      });

      if (studyContent) {
        return res.json([...(studyContent.notes || []), ...notes]);
      }

      return res.json(notes);
    }

    const studyContent = await StudyContent.findOne({
      subject: { $regex: new RegExp(`^${subjectName}$`, "i") },
    });

    if (studyContent) {
      const notes = await Note.find({ subjectId: studyContent._id });
      return res.json([...(studyContent.notes || []), ...notes]);
    }

    return res.status(404).json({ message: "Subject not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET NOTES BY SUBJECT ID
router.get("/:subjectId", async (req, res) => {
  try {
    const { subjectId } = req.params;
    const notes = await Note.find({ subjectId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET CHAPTER NOTES BY SUBJECT NAME AND CHAPTER TITLE
router.get("/chapter/:subjectName/:chapterTitle", async (req, res) => {
  try {
    const { subjectName, chapterTitle } = req.params;
    const normalizedChapterTitle = chapterTitle.replace(/-/g, " ");

    const subject = await Subject.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${subjectName}$`, "i") } },
        { subject: { $regex: new RegExp(`^${subjectName}$`, "i") } },
      ],
    });

    let chapterData = null;
    if (subject && subject.chapters) {
      chapterData = subject.chapters.find(
        (ch) => ch.title.toLowerCase() === normalizedChapterTitle.toLowerCase()
      );
    }

    const notes = await Note.find({
      subjectId: subject ? subject._id : null,
      chapterTitle: { $regex: new RegExp(`^${normalizedChapterTitle}$`, "i") },
    });

    res.json({
      subject,
      chapter: chapterData,
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;