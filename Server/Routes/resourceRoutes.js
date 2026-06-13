import express from "express";

const router = express.Router();

const resources = [
  {
    keywords: ["react", "hooks", "usestate", "useeffect"],
    notes: [
      {
        title: "React Hooks Notes",
        content: "https://react.dev/reference/react/hooks",
      },
      {
        title: "useState Reference",
        content: "https://react.dev/reference/react/useState",
      },
      {
        title: "useEffect Reference",
        content: "https://react.dev/reference/react/useEffect",
      },
    ],
  },
  {
    keywords: ["math", "algebra", "calculus"],
    notes: [
      {
        title: "Algebra Notes",
        content: "https://www.khanacademy.org/math/algebra",
      },
      {
        title: "Calculus Notes",
        content: "https://www.khanacademy.org/math/calculus-1",
      },
    ],
  },
  {
    keywords: ["aptitude", "practice", "questions"],
    notes: [
      {
        title: "Aptitude Practice Notes",
        content: "https://www.indiabix.com/aptitude/questions-and-answers/",
      },
    ],
  },
  {
    keywords: ["pomodoro", "focus"],
    notes: [
      {
        title: "Pomodoro Study Resource",
        content: "https://www.youtube.com/results?search_query=pomodoro+study+with+me",
      },
    ],
  },
];

router.get("/:topic", (req, res) => {
  const topic = req.params.topic.toLowerCase();

  const match = resources.find((resource) =>
    resource.keywords.some((keyword) => topic.includes(keyword))
  );

  if (!match) {
    res.status(404).json({
      success: false,
      message: "Notes not found",
    });
    return;
  }

  res.json({
    success: true,
    notes: match.notes,
  });
});

export default router;
