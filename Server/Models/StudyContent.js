import mongoose from "mongoose";

const studyContentSchema = new mongoose.Schema({
  subject: String,
  chapters: [
    {
      title: String,
      sections: {
        introduction: {
          type: String,
          default: "",
        },
        concept: {
          type: String,
          default: "",
        },
        pyq: {
          type: String,
          default: "",
        },
      },
    },
  ],
  notes: [
    {
      title: String,
      content: String,
    },
  ],
  formulas: [String],
  pyqs: [
    {
      year: String,
      question: String,
    },
  ],
});

export default mongoose.model("StudyContent", studyContentSchema);
