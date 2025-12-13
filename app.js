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
      storyline: `
You are a junior security analyst reviewing a staging web application.
During testing, developers often leave insecure client-side logic behind.

Your task is to inspect how user roles are handled by the application
and determine whether trust is placed on the browser.
      `,
      mission: `
Identify how user privileges are determined and retrieve the hidden admin flag.
      `,
      steps: [
        "Inspect the provided HTTP response",
        "Look for client-side role indicators",
        "Modify values mentally to understand privilege escalation"
      ],
      artifact: `
HTTP/1.1 200 OK
Set-Cookie: role=user

<!-- DEBUG: admin access flag stored when role=admin -->
<!-- FLAG: CTF{client_side_trust_is_dangerous} -->
      `,
      flag: "CTF{client_side_trust_is_dangerous}",
      source: "Inspired by OWASP WebGoat & TryHackMe Web Fundamentals"
    },

    medium: {
      title: "Hidden Endpoint",
      difficulty: "Medium",
      points: 250,
      category: "Web Exploitation",
      storyline: `
An internal admin panel was accidentally deployed to production.
While the main UI hides it, traces remain in client-side JavaScript.

Your job is to analyze application logic leaks.
      `,
      mission: `
Find the undocumented endpoint and extract the admin token.
      `,
      steps: [
        "Review the JavaScript configuration object",
        "Identify unused API routes",
        "Extract sensitive credentials"
      ],
      artifact: `
const config = {
  apiBase: "/api/v1",
  debug: true,
  adminPanel: "/api/v1/admin?token=supersecret123"
}

// FLAG returned when token is valid
// FLAG: CTF{js_leaks_are_real}
      `,
      flag: "CTF{js_leaks_are_real}",
      source: "Inspired by real-world JS exposure incidents & TryHackMe"
    },

    hard: {
      title: "Broken Authentication",
      difficulty: "Hard",
      points: 500,
      category: "Web Exploitation",
      storyline: `
A legacy authentication system uses predictable session handling.
Attackers may be able to bypass authentication entirely.

You are tasked with reviewing server-side logic excerpts.
      `,
      mission: `
Determine how authentication is bypassed and recover the admin flag.
      `,
      steps: [
        "Analyze session validation logic",
        "Identify flawed assumptions",
        "Extract the privileged response"
      ],
      artifact: `
if (session.user == "admin" || session.id == "0000") {
  grantAccess();
}

// FLAG served on access
// FLAG: CTF{logic_flaws_break_auth}
      `,
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
      storyline: `
A system administrator claims logs were deleted after suspicious activity.
However, not all traces are easily erased.

You are given a recovered authentication log fragment.
      `,
      mission: `
Identify suspicious login activity and extract the embedded flag.
      `,
      steps: [
        "Review timestamps",
        "Identify unusual user activity",
        "Locate hidden artifacts"
      ],
      artifact: `
Mar 18 02:13:55 sshd[2219]: Failed password for root
Mar 18 02:14:02 sshd[2219]: Accepted password for backup_user
# FLAG embedded in comment
# CTF{logs_never_lie}
      `,
      flag: "CTF{logs_never_lie}",
      source: "Inspired by Linux auth.log analysis (DFIR training)"
    },

    medium: {
      title: "Memory Remnants",
      difficulty: "Medium",
      points: 300,
      category: "Forensics",
      storyline: `
A volatile memory snapshot was captured before a compromised system shut down.
Attackers often leave credentials behind in memory.

Your task is to analyze extracted memory strings.
      `,
      mission: `
Recover sensitive data left in memory.
      `,
      steps: [
        "Analyze memory strings",
        "Look for credential artifacts",
        "Extract the flag"
      ],
      artifact: `
process=ssh
user=admin
password=Winter2024!
FLAG=CTF{memory_never_forgets}
      `,
      flag: "CTF{memory_never_forgets}",
      source: "Inspired by Volatility memory forensics labs"
    },

    hard: {
      title: "Disk After Dark",
      difficulty: "Hard",
      points: 500,
      category: "Forensics",
      storyline: `
Attackers attempted to cover their tracks by deleting files and clearing logs.
However, forensic artifacts remain in file system metadata.

You are analyzing recovered EXT4 journal fragments.
      `,
      mission: `
Reconstruct attacker activity using deleted file remnants.
      `,
      steps: [
        "Analyze deleted inode entries",
        "Correlate timestamps",
        "Recover hidden file contents"
      ],
      artifact: `
inode: 8842 (deleted)
path: /tmp/.cache/.hidden
content:
CTF{trusted_dfir_practice}
      `,
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
      storyline: `
An intern encrypted a message using a basic Caesar cipher.
They assumed no one would notice.

You intercepted the encrypted message.
      `,
      mission: `
Decrypt the message to retrieve the flag.
      `,
      steps: [
        "Identify the cipher type",
        "Shift letters accordingly",
        "Read the decrypted flag"
      ],
      artifact: `
Encrypted: FWG{vlpsoh_flskhu}
Hint: Shift by 3
      `,
      flag: "CTF{simple_cipher}",
      source: "Inspired by classical cryptography exercises"
    },

    medium: {
      title: "Base64 Confusion",
      difficulty: "Medium",
      points: 250,
      category: "Cryptography",
      storyline: `
A developer assumed encoding equals encryption.
A sensitive value was encoded before storage.

You retrieved the encoded string.
      `,
      mission: `
Decode the value and retrieve the flag.
      `,
      steps: [
        "Recognize encoding format",
        "Decode safely",
        "Extract flag"
      ],
      artifact: `
Q1RGe2VuY29kaW5nX2lzX25vdF9lbmNyeXB0aW9ufQ==
      `,
      flag: "CTF{encoding_is_not_encryption}",
      source: "Inspired by real-world data exposure cases"
    },

    hard: {
      title: "Weak Hash Storage",
      difficulty: "Hard",
      points: 500,
      category: "Cryptography",
      storyline: `
A system stored sensitive data using unsalted MD5 hashes.
Attackers can easily reverse weak hashes.

You are provided with a leaked hash.
      `,
      mission: `
Identify the plaintext value behind the hash.
      `,
      steps: [
        "Recognize hash type",
        "Understand weaknesses",
        "Recover original value"
      ],
      artifact: `
MD5: 5f4dcc3b5aa765d61d8327deb882cf99
FLAG is plaintext value
      `,
      flag: "CTF{password}",
      source: "Inspired by hash cracking labs (TryHackMe / HTB)"
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
            challenge.data.storyline
          ),
          React.createElement('div', { style: { background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px' } },
            React.createElement('strong', null, '🎯 Mission: '),
            challenge.data.mission

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
          (challenge.data.hints || []).map(function(_, i) {
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
