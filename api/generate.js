export default function handler(req, res) {
  const difficulty = req.query.difficulty || "easy";

  const challenges = {
    easy: {
      title: "Web Login Bypass",
      storyline: "Suspicious login attempts detected.",
      mission: "Identify how the attacker bypassed authentication.",
      artifact: {
        content: "POST /login\nusername=admin' OR '1'='1&password=x",
      },
      flag: "CTF{sql_injection}",
      points: 100,
      hints: ["Look at the SQL logic", "What does OR '1'='1' do?"],
      learning: {
        explanation:
          "SQL injection allows attackers to manipulate backend queries.",
        mitre: ["T1190"],
      },
    },

    medium: {
      title: "Exposed JWT Token",
      storyline: "A leaked token was found in logs.",
      mission: "Decode and analyze the JWT.",
      artifact: {
        content:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4ifQ.signature",
      },
      flag: "CTF{jwt_misconfig}",
      points: 250,
      hints: ["Base64 decode", "Check alg field"],
      learning: {
        explanation:
          "Improper JWT validation can allow privilege escalation.",
        mitre: ["T1552"],
      },
    },

    hard: {
      title: "Memory Dump Analysis",
      storyline: "A system memory image was captured.",
      mission: "Extract sensitive strings from memory.",
      artifact: {
        content: "strings memdump.raw | grep CTF",
      },
      flag: "CTF{memory_leak}",
      points: 500,
      hints: ["Use strings", "Search for secrets"],
      learning: {
        explanation:
          "Memory forensics can reveal credentials and secrets.",
        mitre: ["T1003"],
      },
    },
  };

  res.status(200).json({
    success: true,
    challenge: challenges[difficulty],
  });
}
