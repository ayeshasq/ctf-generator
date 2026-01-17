export default function handler(req, res) {
  const categories = ["web", "forensics", "crypto", "network", "osint"];
  const difficulties = ["easy", "medium", "hard"];

  const category =
    req.query.category && req.query.category !== "random"
      ? req.query.category
      : categories[Math.floor(Math.random() * categories.length)];

  const difficulty =
    req.query.difficulty || difficulties[Math.floor(Math.random() * difficulties.length)];

  const pointsMap = {
    easy: 100,
    medium: 250,
    hard: 500
  };

  /* -----------------------------
     REALISTIC ARTIFACT GENERATOR
     ----------------------------- */
  function getArtifacts(category, difficulty) {
    if (category === "forensics") {
      if (difficulty === "easy") {
        return [
          {
            name: "login.log",
            content: `Jan 10 10:21:44 sshd[1223]: Failed password for admin
Jan 10 10:21:48 sshd[1223]: Failed password for admin
Jan 10 10:21:55 sshd[1223]: Accepted password for admin`
          },
          {
            name: "notes.txt",
            content: "Admin complained about slow login this morning."
          }
        ];
      }

      if (difficulty === "medium") {
        return [
          {
            name: "memory.dmp",
            content: "Process dump shows string: password=Winter2024!"
          },
          {
            name: "users.txt",
            content: "admin\nbackup\nservice"
          }
        ];
      }

      return [
        {
          name: "disk_image.img",
          content: "Deleted file found: flag_backup.txt"
        },
        {
          name: "flag_backup.txt",
          content: "CTF{forensics_hidden_artifact}"
        }
      ];
    }

    if (category === "network") {
      return [
        {
          name: "traffic.pcap",
          content: "HTTP POST /login username=admin password=admin123"
        },
        {
          name: "readme.txt",
          content: "Captured traffic from internal gateway"
        }
      ];
    }

    if (category === "web") {
      return [
        {
          name: "index.html",
          content: "<!-- TODO remove debug flag --> <!-- CTF{web_debug_leak} -->"
        },
        {
          name: "app.js",
          content: "console.log('Debug enabled')"
        }
      ];
    }

    if (category === "crypto") {
      return [
        {
          name: "cipher.txt",
          content: "U0dWc2JHOGdWMjl5YkdRPQ=="
        },
        {
          name: "hint.txt",
          content: "Looks like Base64"
        }
      ];
    }

    if (category === "osint") {
      return [
        {
          name: "tweet.txt",
          content: "Excited for NYC trip! Hotel name hidden in bio."
        },
        {
          name: "profile.txt",
          content: "Bio: Security | NYC | 🏨"
        }
      ];
    }

    return [
      {
        name: "artifact.txt",
        content: "Generic artifact"
      }
    ];
  }

  /* -----------------------------
     LEARNING SUMMARY PER CATEGORY
     ----------------------------- */
  function getLearning(category) {
    const map = {
      forensics: {
        attack: "Credential Brute Force",
        explanation:
          "Repeated failed logins followed by success indicate brute force activity.",
        mitigation: [
          "Enable MFA",
          "Account lockout policies",
          "Monitor authentication logs"
        ],
        mitre: ["T1110"]
      },
      network: {
        attack: "Cleartext Credential Exposure",
        explanation:
          "Credentials transmitted without encryption were captured via packet sniffing.",
        mitigation: [
          "Use HTTPS",
          "Encrypt internal traffic",
          "Monitor PCAP logs"
        ],
        mitre: ["T1040"]
      },
      web: {
        attack: "Information Disclosure",
        explanation:
          "Sensitive information leaked through comments and debug output.",
        mitigation: [
          "Remove debug code",
          "Perform code reviews",
          "Use security headers"
        ],
        mitre: ["T1592"]
      },
      crypto: {
        attack: "Weak Encoding",
        explanation:
          "Base64 encoding was mistaken for encryption.",
        mitigation: [
          "Use real encryption",
          "Educate developers",
          "Protect secrets"
        ],
        mitre: ["T1140"]
      },
      osint: {
        attack: "Open-Source Intelligence Gathering",
        explanation:
          "Publicly available data revealed sensitive information.",
        mitigation: [
          "Limit public exposure",
          "Educate employees",
          "Review social media presence"
        ],
        mitre: ["T1593"]
      }
    };

    return map[category];
  }

  /* -----------------------------
     CHALLENGE OBJECT
     ----------------------------- */
  const artifacts = getArtifacts(category, difficulty);
  const learning = getLearning(category);

  const challenge = {
    title: `${category.toUpperCase()} – ${difficulty.toUpperCase()} Challenge`,
    category,
    difficulty,
    points: pointsMap[difficulty],
    storyline:
      "Your SOC detected suspicious activity. Investigate the provided artifacts and capture the flag.",
    objectives: [
      "Analyze provided artifacts",
      "Identify attacker technique",
      "Capture the correct flag"
    ],
    steps: [
      "Review the artifacts",
      "Correlate suspicious activity",
      "Extract the flag"
    ],
    artifact: artifacts,
    hints: [
      "Start with the most obvious file",
      "Look for patterns attackers often leave behind"
    ],
    flag_format: "CTF{...}",
    flag: artifacts.find(a => a.content.includes("CTF{"))?.content.match(/CTF\{.*?\}/)?.[0]
      || `CTF{${category}_${difficulty}_flag}`,
    learning
  };

  res.status(200).json({ success: true, challenge });
}
