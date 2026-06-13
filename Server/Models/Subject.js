import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },

    chapters: [
      {
        title: {
          type: String,
          required: true,
        },

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
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
