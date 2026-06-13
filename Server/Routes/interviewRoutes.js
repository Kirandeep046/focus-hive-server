import express from "express";

const router = express.Router();

const interviewData = {
  technical: {
    React: {
      easy: [
        { q: "What is React?", a: "React is a JavaScript library for building user interfaces with reusable components." },
        { q: "What is JSX?", a: "JSX is a syntax extension for JavaScript that looks like HTML and is used in React components." },
        { q: "How does React use component props?", a: "Props are inputs passed from parent to child components that allow dynamic content and configuration." },
        { q: "What is state in React?", a: "State is local component data that can change over time and cause the UI to re-render." },
      ],
      medium: [
        { q: "What are React hooks?", a: "Hooks are functions like useState and useEffect that let functional components manage state and side effects." },
        { q: "Explain the useEffect hook.", a: "useEffect runs side effects after render and can depend on values to re-run or clean up." },
        { q: "What is the virtual DOM?", a: "The virtual DOM is a lightweight JavaScript representation of the UI that React compares to the real DOM for efficient updates." },
        { q: "How do you pass data between components in React?", a: "You can pass data through props or use context for deeply nested child components." },
      ],
      hard: [
        { q: "Explain React reconciliation.", a: "Reconciliation is React’s process of comparing the previous and new virtual DOM trees to determine the smallest set of changes." },
        { q: "What is the difference between controlled and uncontrolled components?", a: "Controlled components store form state in React state, while uncontrolled components use native DOM state." },
        { q: "How does React memoization improve performance?", a: "React.memo and useMemo prevent unnecessary re-renders by caching values or component outputs." },
      ],
    },
    JavaScript: {
      easy: [
        { q: "What is JavaScript?", a: "JavaScript is a programming language used to build interactive features in web applications." },
        { q: "What is the difference between let and const?", a: "let allows reassignment while const creates a constant reference that cannot be reassigned." },
        { q: "What is a callback function?", a: "A callback is a function passed into another function to run after an operation completes." },
        { q: "What are template literals?", a: "Template literals use backticks and allow embedded expressions with ${ } syntax." },
      ],
      medium: [
        { q: "What is hoisting?", a: "Hoisting is JavaScript’s behavior of moving declarations to the top of their scope before execution." },
        { q: "Explain closures.", a: "Closures occur when a function retains access to variables from its outer scope even after that outer function finishes." },
        { q: "What are promises?", a: "Promises represent asynchronous operations and can be pending, fulfilled, or rejected." },
        { q: "What is event bubbling?", a: "Event bubbling is when an event propagates from a child element up through its parent elements." },
      ],
      hard: [
        { q: "How does the event loop work?", a: "The event loop processes the call stack and message queue to handle async callbacks in JavaScript." },
        { q: "What is async/await?", a: "async/await syntax makes promise-based asynchronous code easier to read and write." },
        { q: "Explain prototypal inheritance.", a: "Objects can inherit properties from their prototype chain in JavaScript." },
        { q: "What is the difference between == and ===?", a: "== compares values with coercion, while === compares both value and type exactly." },
      ],
    },
    NodeJS: {
      easy: [
        { q: "What is Node.js?", a: "Node.js is a runtime that lets you run JavaScript on the server using Chrome’s V8 engine." },
        { q: "What is npm?", a: "npm is the Node package manager used to install and manage dependencies." },
        { q: "What is Express?", a: "Express is a lightweight Node.js framework for building web servers and APIs." },
        { q: "How do you read environment variables in Node?", a: "Use process.env.VARIABLE_NAME to access environment variables." },
      ],
      medium: [
        { q: "How do you handle asynchronous code in Node.js?", a: "You can use callbacks, promises, or async/await to handle async operations." },
        { q: "What is middleware in Express?", a: "Middleware is a function that runs before routes and can modify requests, responses, or control flow." },
        { q: "What is CORS?", a: "CORS controls which domains can access your API from the browser." },
        { q: "How do you serve static files in Express?", a: "Use express.static() to serve files from a directory." },
      ],
      hard: [
        { q: "What is clustering in Node.js?", a: "Clustering allows you to run multiple Node worker processes to use all CPU cores." },
        { q: "How do streams work in Node?", a: "Streams handle large data by processing it in chunks instead of loading it all at once." },
        { q: "What is event-driven architecture?", a: "Node.js apps often use events and listeners to react to asynchronous events." },
      ],
    },
    SQL: {
      easy: [
        { q: "What is SQL?", a: "SQL is a language used to query and manage relational databases." },
        { q: "What does SELECT do?", a: "SELECT retrieves rows from a database table." },
        { q: "What is a JOIN?", a: "JOIN combines rows from two or more tables based on related columns." },
        { q: "What is a primary key?", a: "A primary key uniquely identifies each record in a table." },
      ],
      medium: [
        { q: "What is normalization?", a: "Normalization organizes database tables to reduce duplication and improve integrity." },
        { q: "How do GROUP BY and HAVING differ?", a: "GROUP BY groups rows; HAVING filters groups after aggregation." },
        { q: "What is an index?", a: "An index speeds up database queries by creating a lookup structure." },
        { q: "What is a foreign key?", a: "A foreign key links a row in one table to a row in another table." },
      ],
      hard: [
        { q: "What is ACID in databases?", a: "ACID stands for Atomicity, Consistency, Isolation, Durability." },
        { q: "What is a database transaction?", a: "A transaction is a unit of work that must fully succeed or fail." },
        { q: "Explain an execution plan.", a: "An execution plan shows how the database engine runs a query." },
      ],
    },
    "System Design": {
      easy: [
        { q: "What is scalability?", a: "Scalability is the ability of a system to grow and handle more load." },
        { q: "What is load balancing?", a: "Load balancing distributes traffic across multiple servers." },
        { q: "What is caching?", a: "Caching stores frequently used data for faster access." },
      ],
      medium: [
        { q: "What is a database shard?", a: "Sharding splits data into smaller pieces across multiple databases." },
        { q: "What is eventual consistency?", a: "Eventual consistency means data will become consistent over time." },
        { q: "How do microservices differ from monoliths?", a: "Microservices are separate services, while monoliths are one large deployable app." },
      ],
      hard: [
        { q: "How do you design a URL shortener?", a: "Use a unique key, store the original URL, and redirect requests efficiently." },
        { q: "How would you design a chat application?", a: "Use WebSockets or polling, a message store, and authentication for real-time messaging." },
      ],
    },
  },
  hr: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want to work with us?",
    "Describe a challenging situation you handled.",
    "How do you handle feedback?",
    "Where do you see yourself in 5 years?",
    "Tell us about a time you worked in a team.",
    "How do you manage tight deadlines?",
    "Why are you leaving your current role?",
    "What motivates you at work?",
  ],
  cheatSheet: [
    "React: useState, useEffect, props, component lifecycle, hooks, virtual DOM.",
    "JavaScript: closures, promises, async/await, event loop, scope, hoisting.",
    "Node.js: event-driven I/O, middleware, Express routing, environment variables.",
    "SQL: SELECT, JOIN, GROUP BY, indexes, transactions, normalization.",
    "System Design: scalability, load balancing, caching, database sharding.",
    "HR: prepare a strong introduction, speak in STAR format, show growth mindset.",
    "Mock interview tip: speak clearly, structure answers, and provide examples.",
    "Keep answers concise and align them with the job role and company goals.",
  ],
};

router.get("/", (req, res) => {
  res.json({ success: true, data: interviewData });
});

export default router;
