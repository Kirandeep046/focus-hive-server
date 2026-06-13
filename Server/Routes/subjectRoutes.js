import express from "express";
import Subject from "../Models/Subject.js";
import StudyContent from "../Models/StudyContent.js";

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const createSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
const getSubjectTitle = (subject) => subject.name || subject.subject || "";

router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    const studyContents = await StudyContent.find().sort({ createdAt: -1 });
    res.json([...subjects, ...studyContents]);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch subjects", error });
  }
});

router.get("/name/:name", async (req, res) => {
  try {
    const subjectParam = req.params.name;
    let exactSubject = await Subject.findOne({
      $or: [
        { name: new RegExp(`^${escapeRegex(subjectParam)}$`, "i") },
        { subject: new RegExp(`^${escapeRegex(subjectParam)}$`, "i") },
      ],
    });

    if (!exactSubject) {
      exactSubject = await StudyContent.findOne({
        subject: new RegExp(`^${escapeRegex(subjectParam)}$`, "i"),
      });
    }

    if (exactSubject) {
      res.json(exactSubject);
      return;
    }

    const subjects = [
      ...(await Subject.find()),
      ...(await StudyContent.find()),
    ];
    const subject = subjects.find(
      (item) => createSlug(getSubjectTitle(item)) === createSlug(subjectParam)
    );

    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch subject", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.body.name?.trim() || req.body.subject?.trim();

    if (!name) {
      res.status(400).json({ message: "Subject name is required" });
      return;
    }

    const subject = await Subject.create({ name, subject: name.toLowerCase() });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: "Unable to add subject", error });
  }
});

export default router;
