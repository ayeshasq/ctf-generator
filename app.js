// api/generate.js
const challenges = {
  web: {
    easy: { ... }, // copy the "web.easy" object from your app.js
    medium: { ... }, // copy "web.medium"
    hard: { ... }
  },
  forensics: { easy: {...}, medium: {...}, hard: {...} },
  crypto: { easy: {...}, medium: {...}, hard: {...} },
  network: { easy: {...}, medium: {...}, hard: {...} },
  osint: { easy: {...}, medium: {...}, hard: {...} }
};

export default function handler(req, res) {
  const { category, difficulty } = req.query;

  // choose random if not specified
  const catList = Object.keys(challenges);
  const cat = category && challenges[category] ? category : catList[Math.floor(Math.random() * catList.length)];

  const diffList = ["easy", "medium", "hard"];
  const diff = difficulty && diffList.includes(difficulty) ? difficulty : diffList[Math.floor(Math.random() * diffList.length)];

  const challenge = challenges[cat][diff];

  res.status(200).json({
    success: true,
    challenge: {
      category: cat,
      difficulty: diff,
      ...challenge
    }
  });
}
