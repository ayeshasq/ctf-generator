const { useState } = React;

function CTFGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [difficulty, setDifficulty] = useState('medium');
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const categories = [
    { id: 'random', name: 'Random', emoji: '🎲' },
    { id: 'web', name: 'Web Exploitation', emoji: '🕷️' },
    { id: 'forensics', name: 'Forensics', emoji: '🔍' },
    { id: 'crypto', name: 'Cryptography', emoji: '🔐' },
    { id: 'network', name: 'Network Analysis', emoji: '🌐' },
    { id: 'osint', name: 'OSINT', emoji: '🧠' }
  ];

  // Pre-made challenges for each category
  const sampleChallenges = {
    web: {
      easy: {
        title: "Cookie Monster",
        storyline: "A web application stores sensitive data in cookies without proper protection. An attacker could potentially view or modify these cookies to gain unauthorized access.",
        description: "You've found a website that uses cookies to track user sessions. The admin cookie is set to 'false'. Can you figure out how to become an admin? Inspect the cookies and modify them to gain access.",
        flag: "CTF{c00k13_m0n5t3r_n0m_n0m}",
        points: 100,
        hints: ["Check your browser's developer tools", "Look at the Application/Storage tab", "Try changing the admin cookie value to 'true'"]
      },
      medium: {
        title: "SQL Injection Portal",
        storyline: "A login form doesn't properly sanitize user input, making it vulnerable to SQL injection attacks. The database contains sensitive information that shouldn't be accessible.",
        description: "This login page has a SQL injection vulnerability. Try to bypass the authentication without valid credentials. The username field is vulnerable. Hint: Think about how SQL queries work with OR statements.",
        flag: "CTF{5ql_1nj3ct10n_m4st3r}",
        points: 250,
        hints: ["Try entering: admin' OR '1'='1", "The query checks: SELECT * FROM users WHERE username='[input]' AND password='[input]'", "Use SQL comments (--) to ignore the rest of the query"]
      },
      hard: {
        title: "XSS Nightmare",
        storyline: "A comment section reflects user input without sanitization. An attacker discovered they can inject malicious JavaScript that executes in other users' browsers, potentially stealing session tokens.",
        description: "Find and exploit the XSS vulnerability in the comment system. You need to inject a script that will execute when the admin views the comments. The flag is stored in a hidden div with id 'secret-flag'.",
        flag: "CTF{xss_h4x0r_3l1t3}",
        points: 500,
        hints: ["Try: <script>alert(document.getElementById('secret-flag').innerHTML)</script>", "Look for input fields that display your input back to you", "Use JavaScript to access DOM elements"]
      }
    },
    forensics: {
      easy: {
        title: "Hidden Message",
        storyline: "A suspicious image file was found on a compromised system. Initial analysis shows nothing unusual, but intelligence suggests there's hidden data embedded within.",
        description: "You've intercepted an image file that appears normal but contains a hidden message. Use steganography techniques to extract the secret. The message is hidden in the least significant bits of the RGB values.",
        flag: "CTF{st3g4n0gr4phy_b4s1cs}",
        points: 100,
        hints: ["Use a tool like 'steghide' or 'zsteg'", "Try: strings image.png | grep CTF", "LSB (Least Significant Bit) steganography was used"]
      },
      medium: {
        title: "Memory Dump Analysis",
        storyline: "A memory dump was taken from a compromised server. The attacker's malicious process was running but terminated before full analysis. Key evidence remains in RAM.",
        description: "Analyze the memory dump file to find the attacker's command history. The flag was part of a command executed by the attacker. Look for bash history or command line arguments in the dump.",
        flag: "CTF{m3m0ry_f0r3ns1cs_pr0}",
        points: 250,
        hints: ["Use Volatility framework for memory analysis", "Try the 'linux_bash' or 'cmdline' plugin", "Search for strings containing 'CTF{' in the dump"]
      },
      hard: {
        title: "PCAP Investigation",
        storyline: "Network traffic was captured during a security incident. The attacker exfiltrated data, but it's hidden within what appears to be normal traffic. Deep packet inspection reveals the truth.",
        description: "Analyze this network capture file. The attacker used DNS tunneling to exfiltrate data. Extract the flag from the DNS queries. The data is base64 encoded in the subdomain names.",
        flag: "CTF{dns_tunn3l1ng_n1nj4}",
        points: 500,
        hints: ["Filter for DNS queries in Wireshark", "Look at the subdomain names - they look suspicious", "Extract and decode the base64 strings from subdomains"]
      }
    },
    crypto: {
      easy: {
        title: "Caesar's Secret",
        storyline: "An ancient cipher method was used to protect a message. Julius Caesar himself would be proud, though modern cryptographers would laugh at its simplicity.",
        description: "Decrypt this message: 'FWI{fdhvdu_flskhu_lvq_w_hdvb}'. It uses a simple substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.",
        flag: "CTF{caesar_cipher_isn_t_easy}",
        points: 100,
        hints: ["This is a Caesar cipher", "Try shifting the letters back by 3 positions", "F->C, W->T, I->F"]
      },
      medium: {
        title: "Base64 Maze",
        storyline: "A message was encoded multiple times using Base64. The attacker thought layering encodings would make it unbreakable. They were wrong.",
        description: "Decode this message that has been Base64 encoded multiple times: 'VTFSUmVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ=='. Keep decoding until you find the flag.",
        flag: "CTF{double_encoder_}",
        points: 250,
        hints: ["Decode from Base64 multiple times", "You need to decode 3 times total", "Use CyberChef or an online Base64 decoder"]
      },
      hard: {
        title: "RSA Weakness",
        storyline: "A custom RSA implementation was found with a critical flaw - the two prime numbers used are too close together. This makes factoring the modulus much easier than intended.",
        description: "You've intercepted an RSA encrypted message. The public key has n=143 and e=7. The primes are close together. Factor n, find d, and decrypt: c=65. The decrypted number corresponds to ASCII values of the flag.",
        flag: "CTF{rsa_w34k_pr1m3s}",
        points: 500,
        hints: ["n = 143 = 11 * 13 (close primes)", "Find φ(n) = (11-1)(13-1) = 120", "Find d where e*d ≡ 1 (mod 120), so d=103"]
      }
    },
    network: {
      easy: {
        title: "Port Scanner",
        storyline: "A simple port scan revealed an unusual service running on a non-standard port. The service banner contains the flag, just waiting to be discovered.",
        description: "Scan the target system for open ports. One service is running on port 31337 and its banner contains the flag. Use netcat or telnet to connect and read the banner.",
        flag: "CTF{p0rt_sc4nn1ng_101}",
        points: 100,
        hints: ["Use nmap to scan: nmap -p- target", "Connect to port 31337: nc target 31337", "The flag appears in the service banner"]
      },
      medium: {
        title: "ARP Spoofing Detected",
        storyline: "Network monitoring detected suspicious ARP traffic. An attacker is attempting a man-in-the-middle attack. The ARP packets contain evidence of their identity.",
        description: "Analyze the network capture for ARP spoofing activity. The attacker's MAC address is disguised in the spoofed packets. Extract the flag hidden in the ARP payload comments.",
        flag: "CTF{arp_sp00f1ng_d3t3ct3d}",
        points: 250,
        hints: ["Look for duplicate IP addresses with different MAC addresses", "Filter Wireshark with: arp.duplicate-address-detected", "Check the padding/comment fields in ARP packets"]
      },
      hard: {
        title: "TLS Decryption",
        storyline: "HTTPS traffic was captured along with the server's private key. The encrypted session contains sensitive data that must be recovered and analyzed.",
        description: "Decrypt the TLS traffic using the provided server private key. The flag was transmitted in an HTTP POST request body. Use Wireshark's TLS decryption feature with the key file.",
        flag: "CTF{tls_d3crypt10n_m4st3r}",
        points: 500,
        hints: ["Load the private key in Wireshark: Edit → Preferences → Protocols → TLS", "Add the RSA keys list with IP, port, protocol, and key file", "Filter for http.request.method == POST"]
      }
    },
    osint: {
      easy: {
        title: "Social Media Trail",
        storyline: "A target posted something interesting on social media. Their username is 'cyb3r_n00b_2024'. A recent post contains coordinates to a secret location.",
        description: "Search for the user 'cyb3r_n00b_2024' across social media platforms. Find their most recent post about a 'secret meeting location'. The coordinates in the post translate to the flag.",
        flag: "CTF{s0c14l_m3d14_sl3uth}",
        points: 100,
        hints: ["Try Twitter/X, Instagram, Reddit", "Look for posts from the last 7 days", "Coordinates: 40.7128° N, 74.0060° W = New York"]
      },
      medium: {
        title: "Metadata Mystery",
        storyline: "A suspicious photo was uploaded online. The image itself seems innocent, but the metadata tells a different story about where it was really taken.",
        description: "Download the image from [URL]. Extract the EXIF metadata to find GPS coordinates, camera model, and timestamp. The flag is hidden in a custom EXIF comment field.",
        flag: "CTF{m3t4d4t4_n3v3r_l13s}",
        points: 250,
        hints: ["Use exiftool: exiftool image.jpg", "Look at GPS coordinates and custom comment fields", "The comment field contains base64 encoded data"]
      },
      hard: {
        title: "Domain Reconnaissance",
        storyline: "Investigate the domain 'suspicious-corp.example'. The company's infrastructure reveals poor security practices. Subdomains, DNS records, and certificate transparency logs hold the keys.",
        description: "Perform full reconnaissance on the target domain. Find hidden subdomains, check certificate transparency logs, and analyze DNS records. The flag is split across three different sources that must be combined.",
        flag: "CTF{dns_r3c0n_3xp3rt_l3v3l}",
        points: 500,
        hints: ["Use subfinder, amass, or crt.sh for subdomain enumeration", "Check certificate transparency: crt.sh/?q=suspicious-corp.example", "Combine findings from DNS TXT records + CT logs + subdomain names"]
      }
    }
  };

  function generateChallenge() {
    setLoading(true);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);

    // Simulate API delay
    setTimeout(function() {
      const categoryType = selectedCategory === 'random' 
        ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id 
        : selectedCategory;

      const challengeData = sampleChallenges[categoryType][difficulty];
      
      setChallenge({
        category: categoryType,
        difficulty: difficulty,
        data: challengeData,
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    }, 1500); // 1.5 second delay to simulate API call
  }

  function submitFlag() {
    if (!flagInput.trim()) return;
    
    setAttempts(attempts + 1);
    
    if (flagInput.trim() === challenge.data.flag.trim()) {
      setFlagStatus('correct');
    } else {
      setFlagStatus('incorrect');
    }
  }

  function resetChallenge() {
    setChallenge(null);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
  }

  function showHint(hintIndex) {
    alert('Hint ' + (hintIndex + 1) + ': ' + challenge.data.hints[hintIndex]);
  }

  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a0b2e, #6b21a8, #1a0b2e)',
      color: 'white',
      padding: '20px'
    }
  },
    React.createElement('div', { style: { maxWidth: '1200px', margin: '0 auto' } },
      
      React.createElement('div', { style: { textAlign: 'center', marginBottom: '40px', paddingTop: '40px' } },
        React.createElement('div', { style: { fontSize: '60px', marginBottom: '20px' } }, '🛡️'),
        React.createElement('h1', { 
          style: { 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            background: 'linear-gradient(to right, #c084fc, #ec4899, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }
        }, 'AI CTF Challenge Generator'),
        React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db' } }, 
          'Generate unique hacking challenges in 30 seconds'
        )
      ),

      !challenge && React.createElement('div', {
        style: {
          background: 'rgba(31, 41, 55, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          padding: '40px',
          marginBottom: '30px',
          border: '1px solid rgba(168, 85, 247, 0.2)'
        }
      },
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' } },
          
          React.createElement('div', null,
            React.createElement('label', { style: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' } },
              'Challenge Category'
            ),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' } },
              categories.map(function(cat) {
                return React.createElement('button', {
                  key: cat.id,
                  onClick: function() { setSelectedCategory(cat.id); },
                  style: {
                    padding: '20px',
                    borderRadius: '12px',
                    border: selectedCategory === cat.id ? '2px solid white' : '2px solid #4b5563',
                    background: selectedCategory === cat.id ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(55, 65, 81, 0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '12px',
                    fontWeight: '500'
                  }
                },
                  React.createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, cat.emoji),
                  cat.name
                );
              })
            )
          ),

          React.createElement('div', null,
            React.createElement('label', { style: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' } },
              'Difficulty Level'
            ),
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              ['easy', 'medium', 'hard'].map(function(level) {
                return React.createElement('button', {
                  key: level,
                  onClick: function() { setDifficulty(level); },
                  style: {
                    padding: '16px',
                    borderRadius: '12px',
                    border: difficulty === level ? '2px solid white' : '2px solid #4b5563',
                    background: difficulty === level ? 'linear-gradient(to right, #10b981, #3b82f6)' : 'rgba(55, 65, 81, 0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }
                },
                  React.createElement('span', null, level),
                  React.createElement('span', { style: { fontSize: '14px' } },
                    level === 'easy' ? '100 pts' : level === 'medium' ? '250 pts' : '500 pts'
                  )
                );
              })
            )
          )
        ),

        React.createElement('button', {
          onClick: generateChallenge,
          disabled: loading,
          style: {
            width: '100%',
            marginTop: '32px',
            padding: '20px',
            background: loading ? 'linear-gradient(to right, #4b5563, #6b7280)' : 'linear-gradient(to right, #9333ea, #ec4899)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }
        },
          loading ? '⏳ Generating Challenge...' : '🎲 Generate ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + ' Challenge'
        )
      ),

      challenge && React.createElement('div', null,
        React.createElement('div', {
          style: {
            background: 'rgba(147, 51, 234, 0.2)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '30px',
            marginBottom: '30px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }
        },
          React.createElement('div', { style: { marginBottom: '20px' } },
            React.createElement('h2', { style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' } },
              challenge.data.title
            ),
            React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
              React.createElement('span', { 
                style: { 
                  fontSize: '12px', 
                  padding: '6px 12px', 
                  background: 'rgba(168, 85, 247, 0.3)', 
                  borderRadius: '20px' 
                }
              }, challenge.category.toUpperCase()),
              React.createElement('span', { 
                style: { 
                  fontSize: '12px', 
                  padding: '6px 12px', 
                  background: 'rgba(59, 130, 246, 0.3)', 
                  borderRadius: '20px' 
                }
              }, challenge.difficulty.toUpperCase()),
              React.createElement('span', { 
                style: { 
                  fontSize: '12px', 
                  padding: '6px 12px', 
                  background: 'rgba(234, 179, 8, 0.3)', 
                  borderRadius: '20px' 
                }
              }, '⚡ ' + challenge.data.points + ' pts')
            )
          ),

          React.createElement('div', {
            style: {
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '15px'
            }
          },
            React.createElement('p', { style: { color: '#d1d5db', fontStyle: 'italic' } }, challenge.data.storyline)
          ),

          React.createElement('div', {
            style: {
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '12px',
              padding: '16px'
            }
          },
            React.createElement('p', { style: { color: '#e5e7eb', lineHeight: '1.6' } }, challenge.data.description)
          )
        ),

        React.createElement('div', {
          style: {
            background: 'rgba(31, 41, 55, 0.6)',
            borderRadius: '24px',
            padding: '30px',
            marginBottom: '30px',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }
        },
          React.createElement('h3', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#c084fc' } }, '💡 Hints'),
          React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
            [0, 1, 2].map(function(index) {
              return React.createElement('button', {
                key: index,
                onClick: function() { showHint(index); },
                style: {
                  padding: '12px 20px',
                  background: 'rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.5)',
                  borderRadius: '12px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s'
                }
              }, '🔓 Unlock Hint ' + (index + 1));
            })
          )
        ),

        React.createElement('div', {
          style: {
            background: 'rgba(31, 41, 55, 0.8)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '40px',
            border: '2px solid rgba(168, 85, 247, 0.3)',
            textAlign: 'center'
          }
        },
          React.createElement('h3', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' } },
            '🚩 Capture The Flag'
          ),

          flagStatus === null ? React.createElement('div', { style: { maxWidth: '500px', margin: '0 auto' } },
            React.createElement('p', { style: { color: '#d1d5db', marginBottom: '20px' } },
              'Attempts: ' + attempts
            ),
            React.createElement('input', {
              type: 'text',
              value: flagInput,
              onChange: function(e) { setFlagInput(e.target.value); },
              onKeyPress: function(e) { if (e.key === 'Enter') submitFlag(); },
              placeholder: 'Enter flag (e.g., CTF{...})',
              style: {
                width: '100%',
                padding: '16px 24px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '2px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '12px',
                fontSize: '16px',
                color: 'white',
                marginBottom: '16px',
                outline: 'none'
              }
            }),
            React.createElement('button', {
              onClick: submitFlag,
              disabled: !flagInput.trim(),
              style: {
                width: '100%',
                padding: '16px',
                background: flagInput.trim() ? 'linear-gradient(to right, #9333ea, #ec4899)' : '#4b5563',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: flagInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s'
              }
            }, '🚩 Submit Flag')
          ) : flagStatus === 'correct' ? React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '80px', marginBottom: '20px' } }, '✅'),
            React.createElement('h4', { style: { fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' } },
              'Flag Captured!'
            ),
            React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db', marginBottom: '16px' } },
              "Congratulations! You've solved the challenge!"
            ),
            React.createElement('div', {
              style: {
                display: 'inline-block',
                padding: '12px 24px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                borderRadius: '12px',
                marginBottom: '16px'
              }
            },
              React.createElement('code', { style: { color: '#6ee7b7', fontFamily: 'monospace' } }, challenge.data.flag)
            ),
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '24px' } },
              '+' + challenge.data.points + ' Points'
            ),
            React.createElement('button', {
              onClick: resetChallenge,
              style: {
                padding: '12px 24px',
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }
            }, 'Try New Challenge')
          ) : React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '80px', marginBottom: '20px' } }, '❌'),
            React.createElement('h4', { style: { fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' } },
              'Incorrect Flag'
            ),
            React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db', marginBottom: '16px' } },
              "That's not quite right. Try again!"
            ),
            React.createElement('div', {
              style: {
                display: 'inline-block',
                padding: '12px 24px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '12px',
                marginBottom: '24px'
              }
            },
              React.createElement('code', { style: { color: '#fca5a5', fontFamily: 'monospace' } }, flagInput)
            ),
            React.createElement('br'),
            React.createElement('button', {
              onClick: function() {
                setFlagStatus(null);
                setFlagInput('');
              },
              style: {
                padding: '12px 32px',
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s'
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
