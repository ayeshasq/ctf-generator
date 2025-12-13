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

  /* ===================== WEB ===================== */
  web: {
    easy: {
      title: "Cookie Kingdom",
      story: `
You are auditing a beginner web application hosted at:
https://web-lab.local/cookie-kingdom

The developer stored authorization logic on the client side.
This is a common rookie mistake seen in early-stage startups.
`,
      description: `
Access the admin dashboard by manipulating client-side cookies.
`,
      steps: [
        "Visit: https://web-lab.local/cookie-kingdom",
        "Open browser Developer Tools (F12)",
        "Navigate to Application → Cookies",
        "Locate cookie named 'role'",
        "Change its value from 'user' to 'admin'",
        "Refresh the page",
        "Admin panel reveals the flag"
      ],
      flag: "CTF{cl13nt_s1d3_4uth_f41l}",
      points: 100,
      hints: [
        "Authorization should never rely on cookies alone",
        "Cookies can be modified in DevTools",
        "Try values like admin, true, 1"
      ]
    },

    medium: {
      title: "Login Bypass",
      story: `
A legacy PHP login portal is still live at:
https://web-lab.local/login-bypass

Input validation is weak and SQL queries are constructed unsafely.
`,
      description: `
Bypass authentication using SQL injection and access the admin dashboard.
`,
      steps: [
        "Visit: https://web-lab.local/login-bypass",
        "Enter username: admin' OR '1'='1",
        "Enter any password",
        "Submit the form",
        "Login succeeds without valid credentials",
        "Flag appears on dashboard"
      ],
      flag: "CTF{sql_1nj3ct10n_w0rks}",
      points: 250,
      hints: [
        "The SQL query uses raw user input",
        "OR '1'='1' always evaluates true",
        "Try injecting in username field"
      ]
    },

    hard: {
      title: "Stored XSS Breach",
      story: `
An internal employee feedback portal reflects comments to administrators:
https://web-lab.local/feedback

Admin reviews all comments daily from a privileged account.
`,
      description: `
Inject a stored XSS payload that executes in the admin’s browser.
`,
      steps: [
        "Visit: https://web-lab.local/feedback",
        "Submit a comment containing JavaScript payload",
        "Payload executes when admin views it",
        "Steal hidden token from DOM element id='secret'",
        "Token reveals the flag"
      ],
      flag: "CTF{st0r3d_xss_c0mpr0m1s3}",
      points: 500,
      hints: [
        "Stored XSS executes later",
        "Try <script> or image onerror payloads",
        "Inspect DOM for hidden elements"
      ]
    }
  },

  /* ===================== FORENSICS ===================== */
  forensics: {
    easy: {
      title: "Hidden in Plain Sight",
      story: `
An image was posted to a forum and quickly deleted.
Investigators recovered the image file:
hidden_message.png
`,
      description: `
Extract hidden text embedded inside the image.
`,
      steps: [
        "Download: hidden_message.png",
        "Run: strings hidden_message.png",
        "Search output for CTF{",
        "Alternatively use steghide or zsteg",
        "Extract the hidden message"
      ],
      flag: "CTF{st3g0_1s_3v3rywh3r3}",
      points: 100,
      hints: [
        "Start with simple tools like strings",
        "PNG files often hide data",
        "Look for readable ASCII"
      ]
    },

    medium: {
      title: "Memory Remnants",
      story: `
A compromised Linux server was captured before shutdown.
Memory image recovered:
memory_dump.raw
`,
      description: `
Analyze volatile memory to find attacker commands.
`,
      steps: [
        "Download: memory_dump.raw",
        "Install Volatility Framework",
        "Run: volatility imageinfo",
        "Use linux_bash plugin",
        "Locate command containing flag"
      ],
      flag: "CTF{m3m0ry_n3v3r_f0rg3ts}",
      points: 250,
      hints: [
        "Attackers often leave traces in RAM",
        "Bash history persists in memory",
        "Search for echo or curl commands"
      ]
    },

    hard: {
      title: "Disk After Dark",
      story: `
Attackers wiped logs after breaching a Linux server.
A full disk image was preserved:
disk_after_dark.img
`,
      description: `
Recover deleted log files from disk image and extract attacker activity.
`,
      steps: [
        "Download: disk_after_dark.img",
        "Identify file system using fsstat",
        "List deleted files with fls",
        "Recover deleted log file using icat",
        "Search recovered file for flag"
      ],
      flag: "CTF{d1sk_f0r3ns1cs_pr0}",
      points: 500,
      hints: [
        "Deleted files still have inodes",
        "Use fls -d to list deleted files",
        "icat extracts file content"
      ]
    }
  },

  /* ===================== CRYPTO ===================== */
  crypto: {
    easy: {
      title: "Caesar’s Message",
      story: `
A message intercepted from an old system:
FWH{fdhvdu_flskhu}
`,
      description: `
Decrypt the Caesar cipher.
`,
      steps: [
        "Identify Caesar cipher",
        "Try ROT shifts (0–25)",
        "ROT3 reveals readable text",
        "Decode full message",
        "Recover flag"
      ],
      flag: "CTF{caesar_cipher}",
      points: 100,
      hints: [
        "Classic substitution cipher",
        "ROT3 is common",
        "Use CyberChef or dcode.fr"
      ]
    },

    medium: {
      title: "Encoded Layers",
      story: `
Message captured from malware traffic:
VjFSS1RtVkZNVnBYVmxKc1UwZDRjRmx0ZEV0U2JGcHpXVmQ0
`,
      description: `
Decode layered Base64 encoding.
`,
      steps: [
        "Identify Base64 encoding",
        "Decode multiple times",
        "Use CyberChef",
        "Stop when readable text appears",
        "Extract flag"
      ],
      flag: "CTF{b45364_l4y3rs}",
      points: 250,
      hints: [
        "Look for padding",
        "Multiple decodes required",
        "CyberChef helps"
      ]
    },

    hard: {
      title: "Broken RSA",
      story: `
RSA parameters leaked from insecure system.
Small primes were used.
`,
      description: `
Factor RSA modulus and decrypt message.
`,
      steps: [
        "Given n=143, e=7",
        "Factor n into primes",
        "Calculate φ(n)",
        "Compute private key d",
        "Decrypt ciphertext",
        "Convert number to ASCII"
      ],
      flag: "CTF{rsa_w34k_pr1m3s}",
      points: 500,
      hints: [
        "143 = 11 × 13",
        "Weak primes break RSA",
        "Use modular inverse"
      ]
    }
  },

  /* ===================== NETWORK ===================== */
  network: {
    easy: {
      title: "Open Port",
      story: `
A target server is running unknown services.
`,
      description: `
Identify exposed service banner.
`,
      steps: [
        "Run: nmap -p- target",
        "Find open port 31337",
        "Connect using nc",
        "Read service banner",
        "Capture flag"
      ],
      flag: "CTF{p0rt_sc4nn1ng}",
      points: 100,
      hints: [
        "Scan all ports",
        "Use netcat",
        "Banner grabbing reveals secrets"
      ]
    },

    medium: {
      title: "Suspicious Traffic",
      story: `
Captured network traffic during attack:
traffic.pcap
`,
      description: `
Analyze DNS traffic for exfiltration.
`,
      steps: [
        "Open traffic.pcap in Wireshark",
        "Filter DNS packets",
        "Extract long subdomains",
        "Base64 decode values",
        "Reconstruct flag"
      ],
      flag: "CTF{dns_exf1ltr4t10n}",
      points: 250,
      hints: [
        "DNS tunneling uses subdomains",
        "Base64 encoding common",
        "Wireshark filters help"
      ]
    },

    hard: {
      title: "TLS Decryption",
      story: `
Encrypted traffic captured with private key provided.
`,
      description: `
Decrypt HTTPS session and extract sensitive data.
`,
      steps: [
        "Open PCAP in Wireshark",
        "Configure TLS private key",
        "Reload capture",
        "Filter HTTP traffic",
        "Extract POST body",
        "Find flag"
      ],
      flag: "CTF{tls_d3crypt3d}",
      points: 500,
      hints: [
        "Wireshark TLS settings",
        "Private key enables decryption",
        "Follow TCP stream"
      ]
    }
  },

  /* ===================== OSINT ===================== */
  osint: {
    easy: {
      title: "Social Clues",
      story: `
Target username: cyber_analyst_92
`,
      description: `
Identify public posts revealing location.
`,
      steps: [
        "Search username on Twitter / Instagram",
        "Find recent geo-tagged post",
        "Decode coordinates",
        "Flag hidden in bio"
      ],
      flag: "CTF{0s1nt_b4s1cs}",
      points: 100,
      hints: [
        "People overshare online",
        "Check bios and captions",
        "Use Google Maps"
      ]
    },

    medium: {
      title: "Metadata Never Lies",
      story: `
Image recovered from cloud storage:
vacation.jpg
`,
      description: `
Extract EXIF metadata to locate suspect.
`,
      steps: [
        "Download vacation.jpg",
        "Run: exiftool vacation.jpg",
        "Locate GPS coordinates",
        "Decode hidden comment",
        "Extract flag"
      ],
      flag: "CTF{m3t4d4t4_l34ks}",
      points: 250,
      hints: [
        "EXIF stores GPS",
        "UserComment often abused",
        "Exiftool is powerful"
      ]
    },

    hard: {
      title: "Infrastructure Mapping",
      story: `
Investigate suspicious domain: shady-corp.example
`,
      description: `
Map subdomains and certificates to reconstruct flag.
`,
      steps: [
        "Search crt.sh for certificates",
        "Enumerate subdomains",
        "Inspect TXT DNS records",
        "Collect flag fragments",
        "Combine fragments"
      ],
      flag: "CTF{0s1nt_3xp3rt}",
      points: 500,
      hints: [
        "Certificate transparency logs",
        "DNS TXT records",
        "Subdomain enumeration"
      ]
    }
  }
};


  function generate() {
    setLoading(true);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);

    setTimeout(function() {
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

  const isCorrect =
    flagInput.trim() === challenge.data.flag.trim();

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
      setRevealedHints(revealedHints.filter(function(x) { return x !== i; }));
    } else {
      setRevealedHints(revealedHints.concat([i]));
    }
  }
if (challenge && !challenge.data) return null;

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a0b2e 0%, #6b21a8 50%, #1a0b2e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }
  },
    React.createElement('div', { style: { maxWidth: '1200px', margin: '0 auto' } },
      
      React.createElement('div', { style: { textAlign: 'center', padding: '40px 0' } },
  // Custom SVG Logo
  React.createElement('svg', {
    width: '120',
    height: '120',
    viewBox: '0 0 120 120',
    style: { 
      marginBottom: '20px',
      filter: 'drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))',
      display: 'inline-block'
    }
  },
    // Gradient definition
    React.createElement('defs', null,
      React.createElement('linearGradient', {
        id: 'shieldGradient',
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%'
      },
        React.createElement('stop', { 
          offset: '0%', 
          style: { stopColor: '#a855f7', stopOpacity: 1 } 
        }),
        React.createElement('stop', { 
          offset: '50%', 
          style: { stopColor: '#ec4899', stopOpacity: 1 } 
        }),
        React.createElement('stop', { 
          offset: '100%', 
          style: { stopColor: '#6b21a8', stopOpacity: 1 } 
        })
      )
    ),
    // Shield outline
    React.createElement('path', {
      d: 'M60 10 L100 25 L100 60 Q100 90 60 110 Q20 90 20 60 L20 25 Z',
      fill: 'url(#shieldGradient)',
      stroke: '#ec4899',
      strokeWidth: '3'
    }),
    // Lock body
    React.createElement('rect', {
      x: '45',
      y: '55',
      width: '30',
      height: '25',
      rx: '3',
      fill: '#1a0b2e'
    }),
    // Lock shackle
    React.createElement('path', {
      d: 'M50 55 L50 45 Q50 35 60 35 Q70 35 70 45 L70 55',
      fill: 'none',
      stroke: '#1a0b2e',
      strokeWidth: '4'
    }),
    // Code bracket left
    React.createElement('text', {
      x: '35',
      y: '75',
      fill: '#c084fc',
      fontSize: '24',
      fontWeight: 'bold',
      fontFamily: 'monospace'
    }, '</'),
    // Code bracket right
    React.createElement('text', {
      x: '70',
      y: '75',
      fill: '#c084fc',
      fontSize: '24',
      fontWeight: 'bold',
      fontFamily: 'monospace'
    }, '>')
  ),
  
  React.createElement('h1', { 
    style: { 
      fontSize: '48px', 
      fontWeight: 'bold', 
      marginBottom: '10px', 
      background: 'linear-gradient(to right, #c084fc, #ec4899)', 
      WebkitBackgroundClip: 'text', 
      WebkitTextFillColor: 'transparent' 
    } 
  }, 'AI CTF Challenge Generator'),
  React.createElement('p', { 
    style: { 
      fontSize: '20px', 
      color: '#d1d5db' 
    } 
  }, 'Generate unique hacking challenges in seconds')
),

      !challenge ? React.createElement('div', {
        style: {
          background: 'rgba(31, 41, 55, 0.6)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }
      },
        React.createElement('div', { style: { marginBottom: '30px' } },
          React.createElement('h3', { style: { marginBottom: '15px', color: '#c084fc' } }, 'Category'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' } },
            categories.map(function(c) {
              return React.createElement('button', {
                key: c.id,
                onClick: function() { setSelectedCategory(c.id); },
                style: {
                  padding: '15px',
                  borderRadius: '10px',
                  border: selectedCategory === c.id ? '2px solid white' : '2px solid #4b5563',
                  background: selectedCategory === c.id ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(55, 65, 81, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '24px'
                }
              }, c.emoji + ' ' + c.name);
            })
          )
        ),
        React.createElement('div', { style: { marginBottom: '30px' } },
          React.createElement('h3', { style: { marginBottom: '15px', color: '#c084fc' } }, 'Difficulty'),
          React.createElement('div', { style: { display: 'flex', gap: '10px' } },
            ['easy', 'medium', 'hard'].map(function(d) {
              return React.createElement('button', {
                key: d,
                onClick: function() { setDifficulty(d); },
                style: {
                  flex: 1,
                  padding: '15px',
                  borderRadius: '10px',
                  border: difficulty === d ? '2px solid white' : '2px solid #4b5563',
                  background: difficulty === d ? 'linear-gradient(to right, #10b981, #3b82f6)' : 'rgba(55, 65, 81, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontWeight: 'bold'
                }
              }, d);
            })
          )
        ),
        React.createElement('button', {
          onClick: generate,
          disabled: loading,
          style: {
            width: '100%',
            padding: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '10px',
            border: 'none',
            background: loading ? '#4b5563' : 'linear-gradient(to right, #9333ea, #ec4899)',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }
        }, loading ? '⏳ Generating...' : '🎲 Generate Challenge')
      ) : React.createElement('div', null,
        React.createElement('div', { style: { background: 'rgba(147, 51, 234, 0.2)', borderRadius: '20px', padding: '30px', marginBottom: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' } },
          React.createElement('h2', { style: { fontSize: '32px', marginBottom: '15px' } }, challenge.data.title),
          React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '20px' } },
            React.createElement('span', { style: { padding: '5px 15px', background: 'rgba(168, 85, 247, 0.3)', borderRadius: '20px', fontSize: '12px' } }, challenge.category.toUpperCase()),
            React.createElement('span', { style: { padding: '5px 15px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '20px', fontSize: '12px' } }, challenge.difficulty.toUpperCase()),
            React.createElement('span', { style: { padding: '5px 15px', background: 'rgba(234, 179, 8, 0.3)', borderRadius: '20px', fontSize: '12px' } }, '⚡ ' + challenge.data.points + ' pts')
          ),
          React.createElement('div', { style: { background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px', marginBottom: '15px' } },
            React.createElement('strong', null, '📖 Story: '),
            challenge.data.story
          ),
          React.createElement('div', { style: { background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px' } },
            React.createElement('strong', null, '🎯 Mission: '),
            challenge.data.description
          )
        ),

        React.createElement('div', { style: { background: 'rgba(31, 41, 55, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '20px' } },
          React.createElement('h3', { style: { marginBottom: '15px', color: '#3b82f6' } }, '📋 Step-by-Step Guide'),
          challenge.data.steps.map(function(s, i) {
            return React.createElement('div', {
              key: i,
              style: {
                padding: '12px',
                marginBottom: '10px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                borderLeft: '3px solid #3b82f6',
                fontFamily: 'monospace',
                fontSize: '14px'
              }
            }, s);
          })
        ),

        React.createElement('div', { style: { background: 'rgba(31, 41, 55, 0.6)', borderRadius: '20px', padding: '30px', marginBottom: '20px' } },
          React.createElement('h3', { style: { marginBottom: '15px', color: '#c084fc' } }, '💡 Hints'),
          challenge.data.hints.map(function(_, i) {
            const show = revealedHints.includes(i);
            return React.createElement('div', { key: i, style: { marginBottom: '10px' } },
              React.createElement('button', {
                onClick: function() { toggleHint(i); },
                style: {
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: show ? '2px solid #3b82f6' : '2px solid #4b5563',
                  background: show ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }
              }, (show ? '🔓 ' : '🔒 ') + 'Hint ' + (i + 1)),
              show && React.createElement('div', { style: { padding: '12px', marginTop: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '14px' } }, challenge.data.hints[i])
            );
          })
        ),

        React.createElement('div', { style: { background: 'rgba(31, 41, 55, 0.8)', borderRadius: '20px', padding: '40px', textAlign: 'center' } },
          React.createElement('h3', { style: { fontSize: '28px', marginBottom: '20px' } }, '🚩 Capture The Flag'),
                            attempts >= MAX_ATTEMPTS &&
  React.createElement(
    'p',
    {
      style: {
        color: '#ef4444',
        marginBottom: '15px',
        fontWeight: 'bold'
      }
    },
    '🚫 Maximum attempts reached. Challenge locked.'
  ),

flagStatus === null && attempts < MAX_ATTEMPTS
  ? React.createElement('div', { style: { maxWidth: '500px', margin: '0 auto' } },

          React.createElement(
  'p',
  { style: { marginBottom: '15px', color: attempts >= MAX_ATTEMPTS ? '#ef4444' : '#d1d5db' } },
  'Attempts left: ' + (MAX_ATTEMPTS - attempts) + ' / ' + MAX_ATTEMPTS
),

            React.createElement('input', {
              type: 'text',
              value: flagInput,
              disabled: attempts >= MAX_ATTEMPTS,
              onChange: function(e) { setFlagInput(e.target.value); },
            onKeyDown: function(e) {
  if (e.key === 'Enter') submit();
},
              placeholder: 'CTF{...}',
              style: {
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid rgba(168, 85, 247, 0.5)',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                fontSize: '16px',
                marginBottom: '15px'
              }
            }),
            React.createElement('button', {
              onClick: submit,
              disabled: !flagInput.trim(),
              style: {
                width: '100%',
                padding: '15px',
                borderRadius: '10px',
                border: 'none',
                background: flagInput.trim() ? 'linear-gradient(to right, #9333ea, #ec4899)' : '#4b5563',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: flagInput.trim() ? 'pointer' : 'not-allowed'
              }
            }, '🚩 Submit')
          ) : flagStatus === 'correct' ? React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '80px' } }, '✅'),
            React.createElement('h4', { style: { fontSize: '32px', color: '#10b981', marginBottom: '10px' } }, 'Flag Captured!'),
            React.createElement('p', { style: { fontSize: '18px', marginBottom: '15px' } }, 'You solved it!'),
            React.createElement('code', { style: { padding: '10px 20px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'inline-block', marginBottom: '15px' } }, challenge.data.flag),
            React.createElement('div', { style: { fontSize: '24px', color: '#fbbf24', marginBottom: '20px' } }, '+' + challenge.data.points + ' Points'),
            React.createElement('button', {
              onClick: reset,
              style: {
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, 'New Challenge')
          ) : React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '80px' } }, '❌'),
            React.createElement('h4', { style: { fontSize: '32px', color: '#ef4444', marginBottom: '10px' } }, 'Incorrect'),
            React.createElement('p', { style: { marginBottom: '15px' } }, 'Try again!'),
            React.createElement('code', { style: { padding: '10px 20px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', display: 'inline-block', marginBottom: '20px' } }, flagInput),
            React.createElement('br'),
            React.createElement('button', {
              onClick: function() { setFlagStatus(null); setFlagInput(''); },
              style: {
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }
            }, 'Try Again')
          )
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(CTFGenerator));
