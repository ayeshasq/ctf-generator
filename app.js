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
        title: "Cookie Monster",
        story: "You've discovered a website that stores user roles in browser cookies. The admin panel is protected, but cookies can be modified...",
        description: "The website uses a cookie called 'isAdmin' set to 'false'. Your mission: modify this cookie to gain administrator access and capture the flag.",
        steps: ["Open browser Developer Tools (F12)", "Go to Application → Cookies tab", "Find cookie 'isAdmin' with value 'false'", "Change the value to 'true'", "Refresh the page", "The flag appears on the admin dashboard!"],
        flag: "CTF{c00k13_m0n5t3r_n0m}",
        points: 100,
        hints: ["Browser cookies can be modified using F12 Developer Tools", "Look in Application → Cookies section for 'isAdmin'", "Change cookie value from 'false' to 'true'"]
      },
      medium: {
        title: "SQL Injection Portal",
        story: "A login page doesn't sanitize user input properly. Time to test if it's vulnerable to SQL injection attacks...",
        description: "The login form checks credentials with SQL. Can you bypass authentication without a valid password?",
        steps: ["SQL query: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'", "In username field enter: admin' OR '1'='1", "Password: anything or leave empty", "Click Login", "Query becomes: username='admin' OR '1'='1' (always true!)", "You're logged in! Flag displays on welcome page"],
        flag: "CTF{5ql_1nj3ct10n_m4st3r}",
        points: 250,
        hints: ["SQL injection breaks out with quotes and adds SQL logic", "Try: admin' OR '1'='1 in username", "The OR '1'='1 makes condition always true"]
      },
      hard: {
        title: "XSS Treasure Hunt",
        story: "A comment section reflects user input without sanitization. Can you craft JavaScript that executes when the admin views it?",
        description: "Inject JavaScript to steal the admin's secret token hidden in a div with id 'admin-secret'.",
        steps: ["Find the comment input box", "The flag is in: <div id='admin-secret' style='display:none'>CTF{...}</div>", "Craft payload: <script>alert(document.getElementById('admin-secret').innerText)</script>", "Submit comment", "When rendered, your script executes!", "Alternative: <img src=x onerror='alert(document.getElementById(\"admin-secret\").innerText)'>"],
        flag: "CTF{xss_h4x0r_3l1t3}",
        points: 500,
        hints: ["XSS injects <script> tags or event handlers", "Try: <script>alert(document.getElementById('admin-secret').innerText)</script>", "If blocked, try: <img src=x onerror='alert(1)'>"]
      }
    },
    forensics: {
      easy: {
        title: "Hidden Message",
        story: "Intelligence intercepted an image file. It looks normal but steganography was used to hide data...",
        description: "An image contains a hidden message. Extract the secret data using forensics techniques.",
        steps: ["Try simple approach: strings vacation.png | grep CTF", "Install steghide: sudo apt-get install steghide", "Extract: steghide extract -sf vacation.png", "Try passwords: '', 'password', '1234'", "Alternative: zsteg vacation.png", "Hidden message contains the flag!"],
        flag: "CTF{st3g4n0gr4phy_b4s1cs}",
        points: 100,
        hints: ["Use 'strings' command: strings image.png", "Use steghide: steghide extract -sf vacation.png", "For PNG: try zsteg tool"]
      },
      medium: {
        title: "Memory Dump Detective",
        story: "A compromised server was shut down. You captured a memory dump before reboot. The attacker's commands are still in RAM...",
        description: "Analyze a Linux memory dump. The attacker executed commands that left traces.",
        steps: ["Install Volatility Framework", "Identify profile: volatility -f dump.raw imageinfo", "Check bash history: volatility -f dump.raw --profile=Linux linux_bash", "Look for suspicious commands", "Search for CTF: strings dump.raw | grep 'CTF{'", "Flag was in a curl or echo command"],
        flag: "CTF{m3m0ry_f0r3ns1cs_pr0}",
        points: 250,
        hints: ["Use Volatility with linux_bash plugin", "Command: volatility -f dump.raw --profile=Linux linux_bash", "Flag in attacker's command history"]
      },
      hard: {
        title: "Network PCAP Investigation",
        story: "Network traffic captured during an incident. The attacker exfiltrated data using DNS tunneling...",
        description: "Analyze packet capture to find data exfiltrated through DNS queries encoded in subdomain names.",
        steps: ["Open in Wireshark: wireshark capture.pcap", "Filter DNS: dns", "Notice long suspicious subdomains", "Example: ZG5zX3R1bm4z.attacker.com (Base64!)", "Extract queries: tshark -r file.pcap -Y dns -T fields -e dns.qry.name", "Decode Base64: echo 'encoded' | base64 -d", "Concatenate decoded chunks for full flag"],
        flag: "CTF{dns_tunn3l1ng_n1nj4}",
        points: 500,
        hints: ["Filter Wireshark for DNS traffic", "Subdomains are Base64 encoded", "Decode: echo 'string' | base64 -d"]
      }
    },
    crypto: {
      easy: {
        title: "Caesar's Secret",
        story: "An encrypted message uses Caesar cipher - one of the oldest encryption methods...",
        description: "Decrypt: FWI{fdhvdu_flskhu_lvq_w_hdvb}. Each letter shifted by fixed positions.",
        steps: ["Encrypted: FWI{fdhvdu_flskhu_lvq_w_hdvb}", "Caesar cipher shifts letters (0-25)", "Use online tool: dcode.fr/caesar-cipher", "Or try all 26 shifts manually", "With shift of 3 (ROT3): F→C, W→T, I→F", "FWI becomes CTF!", "Full flag revealed"],
        flag: "CTF{caesar_cipher_isn_t_easy}",
        points: 100,
        hints: ["Caesar shifts letters by fixed amount", "Use dcode.fr/caesar-cipher or CyberChef", "Shift is 3: F→C, W→T, I→F"]
      },
      medium: {
        title: "Base64 Layers",
        story: "Message encoded multiple times with Base64. Peel back the layers like an onion...",
        description: "Decode: VTFSSGVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ==",
        steps: ["Notice '==' padding = Base64", "Decode 1st: echo 'VTF...' | base64 -d", "Decode 2nd time on result", "Decode 3rd time", "Use CyberChef: apply 'From Base64' 3 times", "Flag appears!"],
        flag: "CTF{double_encoder_}",
        points: 250,
        hints: ["Decode Base64 multiple times", "Use: echo 'encoded' | base64 -d repeatedly", "Need to decode exactly 3 times"]
      },
      hard: {
        title: "RSA Weak Primes",
        story: "RSA encrypted message with a flaw - the prime numbers are too close together...",
        description: "Given: n=143, e=7, ciphertext=65. Factor and decrypt!",
        steps: ["Factor n=143: Try small primes", "143 = 11 × 13 (close primes!)", "φ(n) = (11-1)(13-1) = 120", "Find d where 7*d ≡ 1 (mod 120)", "d = 103 (using extended Euclidean)", "Decrypt: pow(65, 103, 143)", "Convert result to ASCII"],
        flag: "CTF{rsa_w34k_pr1m3s}",
        points: 500,
        hints: ["n=143 = 11 × 13", "φ(n) = 120, find d = inverse of 7 mod 120", "d = 103, decrypt: pow(65, 103, 143)"]
      }
    },
    network: {
      easy: {
        title: "Port Scanner Discovery",
        story: "Target system runs multiple services. One on an unusual port has exposed banner...",
        description: "Scan for open ports. Service on port 31337 reveals the flag in its banner.",
        steps: ["Scan all ports: nmap -p- target", "Unusual port found: 31337", "Scan with service detection: nmap -sV -p 31337 target", "Connect: nc target 31337", "Or: telnet target 31337", "Banner shows flag!"],
        flag: "CTF{p0rt_sc4nn1ng_101}",
        points: 100,
        hints: ["Use nmap: nmap -p- target", "Look for port 31337", "Connect: nc target 31337"]
      },
      medium: {
        title: "ARP Spoofing Investigation",
        story: "Network monitoring detected unusual ARP traffic. Someone's attempting man-in-the-middle...",
        description: "Analyze ARP packets. Find duplicate IP-to-MAC mappings indicating spoofing.",
        steps: ["Open Wireshark: wireshark arp.pcap", "Filter: arp", "Look for duplicate IP announcements", "Same IP, different MAC = spoofing!", "Use filter: arp.duplicate-address-detected", "Attacker MAC revealed", "Flag in packet comments"],
        flag: "CTF{arp_sp00f1ng_d3t3ct3d}",
        points: 250,
        hints: ["Filter for ARP, look for duplicate IPs", "Use: arp.duplicate-address-detected", "Compare timestamps of duplicate announcements"]
      },
      hard: {
        title: "HTTPS Decryption Challenge",
        story: "HTTPS traffic captured with server's private key. Decrypt the session...",
        description: "Decrypt TLS using private key. Flag in POST request body.",
        steps: ["Open Wireshark", "Edit → Preferences → Protocols → TLS", "Add RSA key: IP, Port 443, Protocol http, Key file", "Load PCAP", "Filter: http.request.method == POST", "Follow HTTP stream", "Flag in POST data!"],
        flag: "CTF{tls_d3crypt10n_m4st3r}",
        points: 500,
        hints: ["Configure TLS in Wireshark Preferences", "Add private key in TLS settings", "Filter: http.request.method == POST"]
      }
    },
    osint: {
      easy: {
        title: "Social Media Detective",
        story: "Target uses handle 'cyb3r_n00b_2024'. Recent post contains coordinates...",
        description: "Find user's social media posts with location coordinates.",
        steps: ["Search 'cyb3r_n00b_2024' on Twitter, Instagram, Reddit", "Look for recent posts (last 7 days)", "Find coordinates: 40.7128° N, 74.0060° W", "Use Google Maps to decode location", "Coordinates = New York City", "Flag in user bio or latest post"],
        flag: "CTF{s0c14l_m3d14_sl3uth}",
        points: 100,
        hints: ["Try Twitter, Instagram, Reddit, GitHub", "Look for posts with coordinates", "Use Google Maps for GPS coordinates"]
      },
      medium: {
        title: "Photo Metadata Investigation",
        story: "Suspect uploaded a photo. Metadata might reveal location and time...",
        description: "Extract EXIF metadata for GPS, camera details, timestamps.",
        steps: ["Download image", "Install exiftool", "Extract data: exiftool photo.jpg", "Look for GPS Position, DateTime", "Check UserComment field", "Comment may be Base64 encoded", "Decode: echo 'encoded' | base64 -d"],
        flag: "CTF{m3t4d4t4_n3v3r_l13s}",
        points: 250,
        hints: ["Use exiftool: exiftool image.jpg", "Check GPS and UserComment fields", "Comment might be Base64: echo 'data' | base64 -d"]
      },
      hard: {
        title: "Domain Infrastructure Recon",
        story: "Map complete infrastructure of suspicious-corp.example. Security is weak...",
        description: "Use subdomain enumeration, DNS, certificate transparency logs.",
        steps: ["Subdomain scan: subfinder -d target.com", "Certificate logs: crt.sh/?q=%.target.com", "DNS enumeration: dig target.com TXT", "TXT records: part1_CTF{dns", "Subdomain /robots.txt: part2_r3c0n", "Certificate CN: part3_3xp3rt_l3v3l}", "Combine all parts!"],
        flag: "CTF{dns_r3c0n_3xp3rt_l3v3l}",
        points: 500,
        hints: ["Use subfinder or amass for subdomains", "Check crt.sh for certificates", "Look at DNS TXT records: dig target.com TXT"]
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
      const cat = selectedCategory === 'random' 
        ? categories[Math.floor(Math.random() * 5) + 1].id 
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
    if (!flagInput.trim()) return;
    setAttempts(attempts + 1);
    setFlagStatus(flagInput.trim() === challenge.data.flag.trim() ? 'correct' : 'incorrect');
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
        React.createElement('div', { style: { fontSize: '60px', marginBottom: '10px' } }, '🛡️'),
        React.createElement('h1', { style: { fontSize: '48px', fontWeight: 'bold', marginBottom: '10px', background: 'linear-gradient(to right, #c084fc, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'AI CTF Challenge Generator'),
        React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db' } }, 'Generate unique hacking challenges in seconds')
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
          [0, 1, 2].map(function(i) {
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
          flagStatus === null ? React.createElement('div', { style: { maxWidth: '500px', margin: '0 auto' } },
            React.createElement('p', { style: { marginBottom: '15px' } }, 'Attempts: ' + attempts),
            React.createElement('input', {
              type: 'text',
              value: flagInput,
              onChange: function(e) { setFlagInput(e.target.value); },
              onKeyPress: function(e) { if (e.key === 'Enter') submit(); },
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
