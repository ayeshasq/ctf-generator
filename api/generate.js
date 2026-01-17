export default function handler(req, res) {
  const categories = ["web", "crypto", "forensics", "osint", "network"];
  const difficulties = ["easy", "medium", "hard"];

  const category =
    req.query.category || categories[Math.floor(Math.random() * categories.length)];
  const difficulty =
    req.query.difficulty || difficulties[Math.floor(Math.random() * difficulties.length)];

  const points =
    difficulty === "easy" ? 100 :
    difficulty === "hard" ? 500 : 250;

  // Example artifacts for demo
  const artifacts = [
    { name: "login.log", content: "Failed login attempts detected on user admin" },
    { name: "memory.dmp", content: "Simulated memory dump content" },
    { name: "config.txt", content: "Sample configuration file" }
  ];

  const challenge = {
    category,
    difficulty,
    title: `${category.toUpperCase()} Challenge`,
    storyline: "A suspicious system behavior has been detected.",
    description: "Analyze the provided artifacts and capture the flag.",
    flag: `CTF{${category}_${difficulty}_123}`,
    points,
    hints: [
      "Look closely at the data flow",
      "Think like an attacker"
    ],
    artifact: artifacts,
    steps: [
      "Examine the artifacts",
      "Identify vulnerabilities",
      "Capture the flag"
    ],
    objectives: ["Analyze the scenario and capture the flag"],
    flag_format: "CTF{...}",
    learning: {
      attack: "Credential Brute Force",
      explanation: "Multiple failed login attempts followed by a success indicate brute forcing.",
      mitigation: ["Enable MFA", "Apply account lockout policies", "Monitor authentication logs"],
      mitre: ["T1110"]
    }
  };

  res.status(200).json({ success: true, challenge });
}
