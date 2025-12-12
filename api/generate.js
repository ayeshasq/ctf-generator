export default function handler(req, res) {
  const categories = ["web", "crypto", "forensics", "osint", "network"];
  const difficulties = ["easy", "medium", "hard"];

  const category =
    categories[Math.floor(Math.random() * categories.length)];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  const points =
    difficulty === "easy" ? 100 :
    difficulty === "hard" ? 500 : 250;

  const challenge = {
    category,
    difficulty,
    title: `${category.toUpperCase()} Challenge`,
    storyline: "A suspicious system behavior has been detected.",
    description:
      "Analyze the provided data and identify the vulnerability to capture the flag.",
    flag: `CTF{${category}_${difficulty}_123}`,
    points,
    hints: [
      "Look closely at the data flow",
      "Think like an attacker"
    ]
  };

  res.status(200).json({
    success: true,
    challenge
  });
}
