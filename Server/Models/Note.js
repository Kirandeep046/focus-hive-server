import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    chapterTitle: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);