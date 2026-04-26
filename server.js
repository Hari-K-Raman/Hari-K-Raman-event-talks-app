const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample Talk Data
const talksData = [
  {
    title: "The Future of Web Development with AI",
    speakers: ["Dr. Evelyn Reed"],
    categories: ["AI", "Web Development", "Frontend"],
    duration: 60,
    description: "Explore how artificial intelligence is shaping the next generation of web applications, from intelligent UIs to automated code generation."
  },
  {
    title: "Deep Dive into Microservices Architecture",
    speakers: ["Dr. Evelyn Reed", "Mr. Alex Chen"],
    categories: ["Backend", "Architecture", "Cloud"],
    duration: 60,
    description: "An in-depth look at designing, deploying, and scaling microservices. Best practices and common pitfalls."
  },
  {
    title: "Lunch Break",
    speakers: [],
    categories: ["Break"],
    duration: 60,
    description: "Enjoy a complimentary lunch and network with fellow attendees."
  },
  {
    title: "Mastering React Hooks for State Management",
    speakers: ["Ms. Jordan Lee"],
    categories: ["Frontend", "React", "JavaScript"],
    duration: 60,
    description: "Unlock the full potential of React Hooks to manage complex application states efficiently and elegantly."
  },
  {
    title: "Cybersecurity Essentials for Developers",
    speakers: ["Mr. Alex Chen"],
    categories: ["Security", "Development", "Best Practices"],
    duration: 60,
    description: "Learn critical cybersecurity practices and common vulnerabilities to build more secure software from the ground up."
  },
  {
    title: "Leveraging Serverless Functions in the Cloud",
    speakers: ["Dr. Anya Sharma"],
    categories: ["Cloud", "Serverless", "Backend"],
    duration: 60,
    description: "Discover the power of serverless computing with practical examples and use cases across major cloud providers."
  },
  {
    title: "Data Visualization with D3.js and Beyond",
    speakers: ["Dr. Evelyn Reed", "Ms. Jordan Lee"],
    categories: ["Data Science", "Frontend", "JavaScript"],
    duration: 60,
    description: "Transform complex data into compelling visual stories using D3.js and other modern visualization libraries."
  },
  {
    title: "Effective DevOps Strategies for Modern Teams",
    speakers: ["Dr. Anya Sharma"],
    categories: ["DevOps", "Automation", "Cloud"],
    duration: 60,
    description: "Implement robust DevOps pipelines and foster a culture of continuous integration and delivery within your team."
  }
];

// API endpoint for talks
app.get('/api/talks', (req, res) => {
  const category = req.query.category;
  if (category) {
    const filteredTalks = talksData.filter(talk =>
      talk.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
    );
    res.json(filteredTalks);
  } else {
    res.json(talksData);
  }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for any other requests - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
