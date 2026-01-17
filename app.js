export default function handler(req, res) {
  const { category = "random", difficulty = "medium" } = req.query;

  const challenges = {
    web: {
      easy: {
        title: "Exposed Admin Panel",
        storyline:
          "A junior developer accidentally deployed an admin panel without authentication.",
        objectives: [
          "Identify the exposed endpoint",
          "Inspect the client-side code",
          "Extract the hidden credential"
        ],
        steps: [
          "View page source",
          "Search for hardcoded secrets",
          "Use credentials to authenticate"
        ],
        artifact: `
<!-- index.html -->
<script>
  const adminPassword = "admin123";
</script>
        `,
        flag: "CTF{hardcoded_secrets}",
        flag_format: "CTF{...}",
        points: 100,
        hints: [
          "Client-side code can leak secrets",
          "Search for suspicious variables"
        ],
        learning: {
          attack: "Hardcoded Credentials",
          explanation:
            "Secrets embedded in frontend code can be extracted by attackers.",
          mitigation: [
            "Never store secrets in frontend code",
            "Use environment variables",
            "Perform code reviews"
          ],
          mitre: ["T1552"]
        }
      },

      medium: {
        title: "JWT Misconfiguration",
        storyline:
          "An application uses JWTs but may not be validating them correctly.",
        objectives: [
          "Analyze the JWT",
          "Modify payload claims",
          "Bypass authorization"
        ],
        steps: [
          "Decode the JWT",
          "Change the role claim",
          "Re-sign or bypass verification"
        ],
        artifact: `
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJyb2xlIjoi
dXNlciIsInVzZXIiOiJndWVzdCJ9.
        `,
        flag: "CTF{jwt_none_alg}",
        flag_format: "CTF{...}",
        points: 250,
        hints: [
          "Check the algorithm field",
          "Is the signature actually verified?"
        ],
        learning: {
          attack: "JWT None Algorithm",
          explanation:
            "JWTs using 'none' algorithm can be modified without signature.",
          mitigation: [
            "Disallow none algorithm",
            "Enforce strong JWT validation"
          ],
          mitre: ["T1552"]
        }
      },

      hard: {
        title: "Blind SQL Injection",
        storyline:
          "A login endpoint behaves strangely when special characters are used.",
        objectives: [
          "Identify injection point",
          "Extract admin password",
          "Login as admin"
        ],
        steps: [
          "Test boolean conditions",
          "Infer database responses",
          "Extract sensitive data"
        ],
        artifact: `
POST /login
username=admin' AND 1=1--&password=test
        `,
        flag: "CTF{blind_sql_success}",
        flag_format: "CTF{...}",
        points: 500,
        hints: [
          "Boolean logic is key",
          "Observe response differences"
        ],
        learning: {
          attack: "SQL Injection",
          explanation:
            "Improper input sanitization allows attackers to manipulate SQL queries.",
          mitigation: [
            "Use prepared statements",
            "Input validation",
            "WAF deployment"
          ],
          mitre: ["T1190"]
        }
      }
    }
  };

  const selectedCategory =
    category === "random"
      ? Object.keys(challenges)[0]
      : category;

  const challenge =
    challenges[selectedCategory]?.[difficulty] ||
    challenges.web.medium;

  res.status(200).json({
    success: true,
    challenge
  });
}
