const { useState } = React;


function CTFGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [difficulty, setDifficulty] = useState('medium');
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [revealedHints, setRevealedHints] = useState([]);
  
  const MAX_ATTEMPTS = 3;

  const categories = [
    { id: 'random', name: 'Random', emoji: '🎲' },
    { id: 'web', name: 'Web Exploitation', emoji: '🕷️' },
    { id: 'forensics', name: 'Forensics', emoji: '🔍' },
    { id: 'crypto', name: 'Cryptography', emoji: '🔐' },
    { id: 'network', name: 'Network Analysis', emoji: '🌐' },
    { id: 'osint', name: 'OSINT', emoji: '🧠' }
  ];

  const challenges = {
    web: {
      easy: {
        title: "Cookie Trail",
        difficulty: "Easy",
        points: 100,
        category: "Web Exploitation",
        storyline: "You are a junior security analyst reviewing a staging web application. During testing, developers often leave insecure client-side logic behind. Your task is to inspect how user roles are handled by the application and determine whether trust is placed on the browser.",
        mission: "Identify how user privileges are determined and retrieve the hidden admin flag.",
        steps: [
          "Inspect the provided HTTP response",
          "Look for client-side role indicators",
          "Modify values mentally to understand privilege escalation"
        ],
        artifact: `HTTP/1.1 200 OK
Set-Cookie: role=user

<!-- DEBUG: admin access flag stored when role=admin -->
<!-- FLAG: CTF{client_side_trust_is_dangerous} -->`,
        flag: "CTF{client_side_trust_is_dangerous}",
        source: "Inspired by OWASP WebGoat & TryHackMe Web Fundamentals"
      },
      medium: {
        title: "Hidden Endpoint",
        difficulty: "Medium",
        points: 250,
        category: "Web Exploitation",
        storyline: "A frontend developer accidentally pushed a debug JavaScript file into production. While the UI does not expose any admin features, the application logic still contains references to internal APIs. Attackers often inspect JavaScript files to discover hidden endpoints and sensitive tokens.",
        mission: "You are provided with a leaked JavaScript configuration file. Your task is to analyze it, identify the undocumented admin endpoint, and extract the admin flag from the simulated API response.",
        steps: [
          "Open and review the provided JavaScript file",
          "Identify configuration variables related to admin functionality",
          "Locate the hidden API endpoint and token",
          "Read the simulated API response to retrieve the flag"
        ],
        artifact: `📄 File Provided: frontend-config.js

// Loaded by the browser on page load
const config = {
  apiBase: "/api/v2",
  environment: "production",
  debugMode: true,
  features: {
    userDashboard: true,
    adminPanel: false
  },
  // ⚠️ DEBUG — SHOULD NOT BE EXPOSED
  adminApi: "/api/v2/internal/admin",
  adminToken: "admin_debug_token_45892"
};

/* Simulated request:
GET /api/v2/internal/admin?token=admin_debug_token_45892

Simulated response:
{
  "status": "success",
  "flag": "CTF{hidden_endpoints_leak_through_js}"
}
*/`,
        flag: "CTF{hidden_endpoints_leak_through_js}",
        hints: [
          "JavaScript files are always visible to users",
          "Search for debug comments or disabled features",
          "Sensitive endpoints should never exist in frontend code"
        ],
        source: "Inspired by TryHackMe Web Enumeration & OWASP Top 10"
      },
      hard: {
        title: "Broken Authentication",
        difficulty: "Hard",
        points: 500,
        category: "Web Exploitation",
        storyline: "A legacy authentication system uses predictable session handling. Attackers may be able to bypass authentication entirely. You are tasked with reviewing server-side logic excerpts.",
        mission: "Determine how authentication is bypassed and recover the admin flag.",
        steps: [
          "Analyze session validation logic",
          "Identify flawed assumptions",
          "Extract the privileged response"
        ],
        artifact: `if (session.user == "admin" || session.id == "0000") {
  grantAccess();
}
// FLAG served on access
// FLAG: CTF{logic_flaws_break_auth}`,
        flag: "CTF{logic_flaws_break_auth}",
        source: "Inspired by OWASP Top 10 – Broken Authentication"
      }
    },
    forensics: {
      easy: {
        title: "Log Leftovers",
        difficulty: "Easy",
        points: 150,
        category: "Forensics",
        storyline: "A system administrator claims logs were deleted after suspicious activity. However, not all traces are easily erased. You are given a recovered authentication log fragment.",
        mission: "Identify suspicious login activity and extract the embedded flag.",
        steps: [
          "Review timestamps",
          "Identify unusual user activity",
          "Locate hidden artifacts"
        ],
        artifact: `Mar 18 02:13:55 sshd[2219]: Failed password for root
Mar 18 02:14:02 sshd[2219]: Accepted password for backup_user
# FLAG embedded in comment
# CTF{logs_never_lie}`,
        flag: "CTF{logs_never_lie}",
        source: "Inspired by Linux auth.log analysis (DFIR training)"
      },
      medium: {
        title: "Memory Remnants",
        difficulty: "Medium",
        points: 300,
        category: "Forensics",
        storyline: "A volatile memory snapshot was captured before a compromised system shut down. Attackers often leave credentials behind in memory. Your task is to analyze extracted memory strings.",
        mission: "Recover sensitive data left in memory.",
        steps: [
          "Analyze memory strings",
          "Look for credential artifacts",
          "Extract the flag"
        ],
        artifact: `process=ssh
user=admin
password=Winter2024!
FLAG=CTF{memory_never_forgets}`,
        flag: "CTF{memory_never_forgets}",
        source: "Inspired by Volatility memory forensics labs"
      },
      hard: {
        title: "Disk After Dark",
        difficulty: "Hard",
        points: 500,
        category: "Forensics",
        storyline: "Attackers attempted to cover their tracks by deleting files and clearing logs. However, forensic artifacts remain in file system metadata. You are analyzing recovered EXT4 journal fragments.",
        mission: "Reconstruct attacker activity using deleted file remnants.",
        steps: [
          "Analyze deleted inode entries",
          "Correlate timestamps",
          "Recover hidden file contents"
        ],
        artifact: `inode: 8842 (deleted)
path: /tmp/.cache/.hidden
content: CTF{trusted_dfir_practice}`,
        flag: "CTF{trusted_dfir_practice}",
        source: "Inspired by SANS DFIR EXT4 recovery techniques"
      }
    },
    crypto: {
      easy: {
        title: "Simple Shift",
        difficulty: "Easy",
        points: 100,
        category: "Cryptography",
        storyline: "An intern encrypted a message using a basic Caesar cipher. They assumed no one would notice. You intercepted the encrypted message.",
        mission: "Decrypt the message to retrieve the flag.",
        steps: [
          "Identify the cipher type",
          "Shift letters accordingly",
          "Read the decrypted flag"
        ],
        artifact: `Encrypted: FWG{vlpsoh_flskhu}
Hint: Shift by 3`,
        flag: "CTF{simple_cipher}",
        source: "Inspired by classical cryptography exercises"
      },
      medium: {
        title: "Base64 Confusion",
        difficulty: "Medium",
        points: 250,
        category: "Cryptography",
        storyline: "A developer assumed encoding equals encryption. A sensitive value was encoded before storage. You retrieved the encoded string.",
        mission: "Decode the value and retrieve the flag.",
        steps: [
          "Recognize encoding format",
          "Decode safely",
          "Extract flag"
        ],
        artifact: `Q1RGe2VuY29kaW5nX2lzX25vdF9lbmNyeXB0aW9ufQ==`,
        flag: "CTF{encoding_is_not_encryption}",
        source: "Inspired by real-world data exposure cases"
      },
      hard: {
        title: "Weak Hash Storage",
        difficulty: "Hard",
        points: 500,
        category: "Cryptography",
        storyline: "A system stored sensitive data using unsalted MD5 hashes. Attackers can easily reverse weak hashes. You are provided with a leaked hash.",
        mission: "Identify the plaintext value behind the hash.",
        steps: [
          "Recognize hash type",
          "Understand weaknesses",
          "Recover original value"
        ],
        artifact: `MD5: 5f4dcc3b5aa765d61d8327deb882cf99
FLAG is plaintext value`,
        flag: "CTF{password}",
        source: "Inspired by hash cracking labs (TryHackMe / HTB)"
      }
    },
    network: {
      easy: {
        title: "Packet Inspection",
        difficulty: "Easy",
        points: 100,
        category: "Network Analysis",
        storyline: "A network administrator suspects unauthorized access. You have been provided with a packet capture containing suspicious traffic. Basic protocol analysis reveals clear-text credentials.",
        mission: "Analyze the packet capture and extract the flag from unencrypted traffic.",
        steps: [
          "Review the packet capture data",
          "Identify clear-text protocols",
          "Extract credentials from the traffic"
        ],
        artifact: `TCP Stream Follow:
GET /admin HTTP/1.1
Host: internal.corp.com
Authorization: Basic Q1RGe3BhY2tldHNfZG9udF9saWV9

Decoded Authorization:
CTF{packets_dont_lie}`,
        flag: "CTF{packets_dont_lie}",
        source: "Inspired by Wireshark analysis labs"
      },
      medium: {
        title: "DNS Exfiltration",
        difficulty: "Medium",
        points: 300,
        category: "Network Analysis",
        storyline: "An attacker is using DNS queries to exfiltrate data from a compromised network. DNS tunneling is a common technique that bypasses traditional firewalls. You must decode the exfiltrated data.",
        mission: "Analyze DNS query patterns and reconstruct the exfiltrated message.",
        steps: [
          "Examine DNS query subdomain patterns",
          "Identify the encoding scheme",
          "Reconstruct and decode the message"
        ],
        artifact: `DNS Queries Captured:
64746e73.exfil.attacker.com
5f74756e.exfil.attacker.com
6e656c73.exfil.attacker.com
5f776f72.exfil.attacker.com
6b7d0000.exfil.attacker.com

Hex decoded concatenation:
CTF{dns_tunnels_work}`,
        flag: "CTF{dns_tunnels_work}",
        hints: [
          "DNS subdomains contain hex-encoded data",
          "Concatenate the subdomains in order",
          "Convert from hexadecimal to ASCII"
        ],
        source: "Inspired by network forensics and DNS tunneling techniques"
      },
      hard: {
        title: "TLS Interception",
        difficulty: "Hard",
        points: 500,
        category: "Network Analysis",
        storyline: "A man-in-the-middle attack has been detected on the corporate network. The attacker intercepted TLS traffic using a rogue certificate. You have the private key and encrypted session data.",
        mission: "Decrypt the TLS session and recover the transmitted flag.",
        steps: [
          "Load the private key",
          "Decrypt the TLS session master secret",
          "Extract the application data containing the flag"
        ],
        artifact: `TLS Session Data:
Cipher Suite: TLS_RSA_WITH_AES_128_CBC_SHA
Encrypted Application Data: [truncated]

Decrypted Payload:
POST /api/secret HTTP/1.1
flag=CTF{mitm_breaks_encryption}`,
        flag: "CTF{mitm_breaks_encryption}",
        source: "Inspired by SSL/TLS decryption labs"
      }
    },
    osint: {
      easy: {
        title: "Social Media Footprint",
        difficulty: "Easy",
        points: 100,
        category: "OSINT",
        storyline: "A target posted sensitive information on social media without realizing it. OSINT practitioners often find security answers, locations, and other data in public posts.",
        mission: "Review the social media post and extract the hidden flag from metadata.",
        steps: [
          "Read the social media post carefully",
          "Look for metadata or embedded information",
          "Extract the flag"
        ],
        artifact: `@target_user posted 2 hours ago:
"Just got back from vacation! 🏖️"

Image EXIF data:
GPS: 40.7128° N, 74.0060° W
Camera: iPhone 12
Comment: CTF{metadata_tells_all}`,
        flag: "CTF{metadata_tells_all}",
        source: "Inspired by OSINT framework exercises"
      },
      medium: {
        title: "Username Enumeration",
        difficulty: "Medium",
        points: 250,
        category: "OSINT",
        storyline: "A user reuses the same username across multiple platforms. By correlating information from different sources, you can build a complete profile and discover sensitive data.",
        mission: "Track the user across platforms and find the flag in their digital footprint.",
        steps: [
          "Search for the username on multiple platforms",
          "Cross-reference information between profiles",
          "Locate the flag in one of the accounts"
        ],
        artifact: `Username: cyber_analyst_2024

GitHub: cyber_analyst_2024
- Bio: "Security researcher"
- Public repos: 12

Twitter: @cyber_analyst_2024
- Bio: "CTF player | Flag: CTF{reused_usernames_expose_you}"

Reddit: u/cyber_analyst_2024
- Karma: 1,247`,
        flag: "CTF{reused_usernames_expose_you}",
        hints: [
          "Check each platform's bio and profile information",
          "Usernames often link back to the same person",
          "Twitter bios sometimes contain sensitive data"
        ],
        source: "Inspired by Bellingcat OSINT methodology"
      },
      hard: {
        title: "Wayback Investigation",
        difficulty: "Hard",
        points: 500,
        category: "OSINT",
        storyline: "A company removed sensitive information from their website, but the internet never forgets. The Wayback Machine archives historical versions of websites. You must find what was deleted.",
        mission: "Use archived web data to recover the removed flag.",
        steps: [
          "Review the current website state",
          "Check archived snapshots for differences",
          "Find the deleted page containing the flag"
        ],
        artifact: `Current site (2024-01-10):
example.com/about
"We are a secure company."

Wayback Machine (2023-06-15):
example.com/about
"We are a secure company."
example.com/internal-notes (deleted)
"Development flag: CTF{archives_remember_everything}"`,
        flag: "CTF{archives_remember_everything}",
        source: "Inspired by web archaeology and OSINT investigations"
      }
    }
  };

  function generate() {
    setLoading(true);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);

    setTimeout(() => {
      const nonRandomCategories = categories.filter(c => c.id !== 'random');
      const cat = selectedCategory === 'random' 
        ? nonRandomCategories[Math.floor(Math.random() * nonRandomCategories.length)].id 
        : selectedCategory;

      setChallenge({
        category: cat,
        difficulty: difficulty,
        data: challenges[cat][difficulty]
      });
      setLoading(false);
    }, 1500);
  }

  function submit() {
    if (attempts >= MAX_ATTEMPTS) return;
    if (!challenge) return;

    const isCorrect = flagInput.trim() === challenge.data.flag.trim();
    setAttempts(prev => prev + 1);
    setFlagStatus(isCorrect ? 'correct' : 'incorrect');
  }

  function reset() {
    setChallenge(null);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);
  }

  function toggleHint(i) {
    if (revealedHints.includes(i)) {
      setRevealedHints(revealedHints.filter(x => x !== i));
    } else {
      setRevealedHints([...revealedHints, i]);
    }
  }

  if (challenge && !challenge.data) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0b2e 0%, #6b21a8 50%, #1a0b2e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{
              marginBottom: '20px',
              filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))',
              display: 'inline-block'
            }}
          >
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#6b21a8', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M60 10 L100 25 L100 60 Q100 90 60 110 Q20 90 20 60 L20 25 Z"
              fill="url(#shieldGradient)"
              stroke="#ec4899"
              strokeWidth="3"
            />
            <rect x="45" y="55" width="30" height="25" rx="3" fill="#1a0b2e" />
            <path
              d="M50 55 L50 45 Q50 35 60 35 Q70 35 70 45 L70 55"
              fill="none"
              stroke="#1a0b2e"
              strokeWidth="4"
            />
            <text
              x="35"
              y="75"
              fill="#c084fc"
              fontSize="24"
              fontWeight="bold"
              fontFamily="monospace"
            >
              &lt;/
            </text>
            <text
              x="70"
              y="75"
              fill="#c084fc"
              fontSize="24"
              fontWeight="bold"
              fontFamily="monospace"
            >
              &gt;
            </text>
          </svg>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(to right, #c084fc, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI CTF Challenge Generator
          </h1>
          <p style={{ fontSize: '20px', color: '#d1d5db' }}>
            Generate unique hacking challenges in seconds
          </p>
        </div>

        {!challenge ? (
          <div style={{
            background: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', color: '#c084fc' }}>Category</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    style={{
                      padding: '15px',
                      borderRadius: '10px',
                      border: selectedCategory === c.id ? '2px solid white' : '2px solid #4b5563',
                      background: selectedCategory === c.id 
                        ? 'linear-gradient(to right, #a855f7, #ec4899)' 
                        : 'rgba(55, 65, 81, 0.5)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '15px', color: '#c084fc' }}>Difficulty</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      borderRadius: '10px',
                      border: difficulty === d ? '2px solid white' : '2px solid #4b5563',
                      background: difficulty === d 
                        ? 'linear-gradient(to right, #10b981, #3b82f6)' 
                        : 'rgba(55, 65, 81, 0.5)',
                      color: 'white',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontWeight: 'bold'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '10px',
                border: 'none',
                background: loading 
                  ? '#4b5563' 
                  : 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Generating...' : '🎲 Generate Challenge'}
            </button>
          </div>
        ) : (
          <div>
            {/* Challenge Header */}
            <div style={{
              background: 'rgba(147, 51, 234, 0.2)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '20px',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>
                {challenge.data.title}
              </h2>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '5px 15px',
                  background: 'rgba(168, 85, 247, 0.3)',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {challenge.category.toUpperCase()}
                </span>
                <span style={{
                  padding: '5px 15px',
                  background: 'rgba(59, 130, 246, 0.3)',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {challenge.difficulty.toUpperCase()}
                </span>
                <span style={{
                  padding: '5px 15px',
                  background: 'rgba(234, 179, 8, 0.3)',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  ⚡ {challenge.data.points} pts
                </span>
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <strong>📖 Story: </strong>
                {challenge.data.storyline}
              </div>
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '15px',
                borderRadius: '10px'
              }}>
                <strong>🎯 Mission: </strong>
                {challenge.data.mission}
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#3b82f6' }}>
                📋 Step-by-Step Guide
              </h3>
              {challenge.data.steps.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    borderLeft: '3px solid #3b82f6',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}
                >
                  {i + 1}. {s}
                </div>
              ))}
            </div>

            {/* Artifact Display */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '20px',
              border: '2px solid rgba(236, 72, 153, 0.4)'
            }}>
              <h3 style={{
                marginBottom: '15px',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                📦 Challenge Artifact
                <span style={{
                  fontSize: '12px',
                  padding: '4px 12px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  borderRadius: '12px',
                  fontWeight: 'normal'
                }}>
                  Analyze this carefully
                </span>
              </h3>
              <div style={{
                background: '#1a1a1a',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#10b981',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {challenge.data.artifact}
              </div>
            </div>

            {/* Hints Section */}
            {challenge.data.hints && challenge.data.hints.length > 0 && (
              <div style={{
                background: 'rgba(31, 41, 55, 0.6)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '20px'
              }}>
                <h3 style={{ marginBottom: '15px', color: '#c084fc' }}>
                  💡 Hints
                </h3>
                {challenge.data.hints.map((hint, i) => {
                  const show = revealedHints.includes(i);
                  return (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      <button
                        onClick={() => toggleHint(i)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: show ? '2px solid #3b82f6' : '2px solid #4b5563',
                          background: show 
                            ? 'rgba(59, 130, 246, 0.2)' 
                            : 'rgba(55, 65, 81, 0.5)',
                          color: 'white',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: 'bold'
                        }}
                      >
                        {show ? '🔓 ' : '🔒 '}Hint {i + 1}
                      </button>
                      {show && (
                        <div style={{
                          padding: '12px',
                          marginTop: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}>
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Source Attribution */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.6)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '20px',
              borderLeft: '4px solid #fbbf24'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📚
                <strong>Source: </strong>
                <span style={{ color: '#d1d5db' }}>
                  {challenge.data.source}
                </span>
              </div>
            </div>

            {/* Flag Submission Section */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>
                🚩 Capture The Flag
              </h3>

              {attempts >= MAX_ATTEMPTS && (
                <p style={{
                  color: '#ef4444',
                  marginBottom: '15px',
                  fontWeight: 'bold'
                }}>
                  🚫 Maximum attempts reached. Challenge locked.
                </p>
              )}

              {flagStatus === null && attempts < MAX_ATTEMPTS ? (
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <p style={{
                    marginBottom: '15px',
                    color: attempts >= MAX_ATTEMPTS ? '#ef4444' : '#d1d5db'
                  }}>
                    Attempts left: {MAX_ATTEMPTS - attempts} / {MAX_ATTEMPTS}
                  </p>
                  <input
                    type="text"
                    value={flagInput}
                    disabled={attempts >= MAX_ATTEMPTS}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submit();
                    }}
                    placeholder="CTF{...}"
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '16px',
                      marginBottom: '15px'
                    }}
                  />
                  <button
                    onClick={submit}
                    disabled={!flagInput.trim()}
                    style={{
                      width: '100%',
                      padding: '15px',
                      borderRadius: '10px',
                      border: 'none',
                      background: flagInput.trim() 
                        ? 'linear-gradient(to right, #9333ea, #ec4899)' 
                        : '#4b5563',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: flagInput.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    🚩 Submit
                  </button>
                </div>
              ) : flagStatus === 'correct' ? (
                <div>
                  <div style={{ fontSize: '80px' }}>✅</div>
                  <h4 style={{
                    fontSize: '32px',
                    color: '#10b981',
                    marginBottom: '10px'
                  }}>
                    Flag Captured!
                  </h4>
                  <p style={{ fontSize: '18px', marginBottom: '15px' }}>
                    You solved it!
                  </p>
                  <code style={{
                    padding: '10px 20px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginBottom: '15px'
                  }}>
                    {challenge.data.flag}
                  </code>
                  <div style={{
                    fontSize: '24px',
                    color: '#fbbf24',
                    marginBottom: '20px'
                  }}>
                    +{challenge.data.points} Points
                  </div>
                  <button
                    onClick={reset}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🎲 New Challenge
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '80px' }}>❌</div>
                  <h4 style={{
                    fontSize: '32px',
                    color: '#ef4444',
                    marginBottom: '10px'
                  }}>
                    Incorrect
                  </h4>
                  <p style={{ marginBottom: '15px' }}>Try again!</p>
                  <code style={{
                    padding: '10px 20px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginBottom: '20px'
                  }}>
                    {flagInput}
                  </code>
                  <br />
                  <button
                    onClick={() => {
                      setFlagStatus(null);
                      setFlagInput('');
                    }}
                    style={{
                      padding: '12px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                  >
                    🔄 Try Again
                  </button>
                  {attempts < MAX_ATTEMPTS && (
                    <button
                      onClick={reset}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: '2px solid #4b5563',
                        background: 'transparent',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      ↩️ Back to Menu
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(CTFGenerator));
