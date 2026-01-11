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
        title: "The Intern's Mistake",
        difficulty: "Easy",
        points: 100,
        category: "Web Exploitation",
        storyline: "It's 2:47 AM when your phone buzzes. Sarah, the lead developer at NovaTech, sounds panicked: 'We just fired an intern who had admin access. He deployed something to staging before he left—I don't know what.' You remote into their staging server and immediately notice something off. The application's authentication looks... client-side. Your mission begins now: this intern either made a rookie mistake or left a backdoor. Either way, you need to find it before the CEO's morning review at 8 AM.",
        mission: "Investigate the staging environment's authentication system. The intern had admin privileges—find out what he left behind and capture the evidence before the morning shift arrives.",
        steps: [
          "Examine the HTTP response from the staging server",
          "Identify how user roles are being validated",
          "Look for debug comments or hardcoded admin logic",
          "Extract the flag proving privileged access was compromised"
        ],
        artifact: `HTTP/1.1 200 OK
Set-Cookie: role=user

<!-- DEBUG: admin access flag stored when role=admin -->
<!-- FLAG: CTF{client_side_trust_is_dangerous} -->`,
        flag: "CTF{client_side_trust_is_dangerous}",
        source: "Inspired by OWASP WebGoat & TryHackMe Web Fundamentals"
      },
      medium: {
        title: "The Forgotten Debug File",
        difficulty: "Medium",
        points: 250,
        category: "Web Exploitation",
        storyline: "You're a security consultant hired by FinanceHub after they detected unusual admin activity on their production servers. The company swears no one has admin credentials except the CTO—who's been on vacation in Iceland for two weeks. Your forensic timeline shows the breach started exactly when a junior developer, Marcus, pushed a 'minor UI update' to production. The git commit message reads: 'Quick fix for dashboard buttons.' But something doesn't add up. You download the production JavaScript files and start your investigation. Hidden in 47,000 lines of minified code, you find a file that shouldn't be there: 'frontend-config.js'. It wasn't minified. It has comments. And it references an API endpoint that doesn't appear in any documentation.",
        mission: "Analyze the suspicious JavaScript configuration file. Identify what Marcus accidentally exposed and prove how an attacker gained admin access while the CTO was offline.",
        steps: [
          "Open and carefully review the frontend-config.js file",
          "Look for references to admin functionality or internal APIs",
          "Identify any exposed authentication tokens or credentials",
          "Find the hidden endpoint and extract the flag from the simulated response"
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
          "Even if a feature is disabled in the UI, the code might still exist",
          "Debug tokens in production are a critical security flaw",
          "JavaScript files are always readable by anyone with a browser"
        ],
        source: "Inspired by TryHackMe Web Enumeration & OWASP Top 10"
      },
      hard: {
        title: "Legacy Login Nightmare",
        difficulty: "Hard",
        points: 500,
        category: "Web Exploitation",
        storyline: "The year is 2026, but the authentication system you're staring at was written in 2009. MediCorp's patient portal—handling records for 2 million people—still runs on 'the old codebase' that nobody wants to touch. Three hours ago, an anonymous tip came through the bug bounty program: 'You can log in as admin without knowing the password. Session ID 0000.' That's all they said. Your heart races. If this is real, every patient record is exposed. The legal team is already drafting breach notifications. The board wants answers. You have one hour before the incident goes public. The legacy authentication code sits in front of you, written by a developer who left the company 12 years ago. Time to find the flaw.",
        mission: "Audit the legacy authentication logic. Find the critical vulnerability that allows password bypass and obtain proof of admin access. Lives depend on your findings.",
        steps: [
          "Analyze the session validation code carefully",
          "Identify the logical flaw in the authentication check",
          "Understand why session ID '0000' grants admin access",
          "Extract the flag proving complete authentication bypass"
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
        title: "The Vanishing Sysadmin",
        difficulty: "Easy",
        points: 150,
        category: "Forensics",
        storyline: "DataCore's headquarters went dark at 3:17 AM. When security arrived, the server room door was open, three machines were powered off, and Tom—the night sysadmin—was gone. His badge hasn't been scanned since midnight. His phone goes straight to voicemail. The executive team fears the worst: insider threat, data theft, maybe even something darker. The police are on their way, but the CTO calls you first. 'We need to know what happened before the lawyers get involved.' You boot up Tom's workstation and find something strange—the authentication logs have been deleted. Or have they? A fragment remains in /var/log/auth.log.backup. Maybe Tom wasn't as careful as he thought.",
        mission: "Analyze the recovered log fragment from Tom's last session. Reconstruct what happened between midnight and 3:17 AM. Find evidence of what Tom did—and extract the flag he thought he'd hidden forever.",
        steps: [
          "Review the authentication log timestamps carefully",
          "Identify which user accounts were accessed and when",
          "Look for suspicious login patterns or unusual user activity",
          "Find the flag embedded in the log data"
        ],
        artifact: `Mar 18 02:13:55 sshd[2219]: Failed password for root
Mar 18 02:14:02 sshd[2219]: Accepted password for backup_user
# FLAG embedded in comment
# CTF{logs_never_lie}`,
        flag: "CTF{logs_never_lie}",
        source: "Inspired by Linux auth.log analysis (DFIR training)"
      },
      medium: {
        title: "Memory Lane",
        difficulty: "Medium",
        points: 300,
        category: "Forensics",
        storyline: "FBI Case #47821: The ransomware group 'DarkVeil' hit a children's hospital last night, encrypting patient records and demanding $2M in Bitcoin. The attackers were in the network for 14 minutes before the sysadmin pulled the power—a desperate move that might have saved them. You're part of the cyber forensics unit, and you have exactly one asset: a volatile memory dump captured in those final seconds before shutdown. Somewhere in those 16GB of RAM is the attacker's mistake. They had to authenticate. They had to type passwords. Memory never forgets. The hospital's board is in emergency session. Insurance won't pay without proof of breach. Parents are calling, terrified. You load the memory dump and start extracting strings. Somewhere in this digital haystack is the needle that will identify who did this.",
        mission: "Analyze the volatile memory dump from the compromised server. Find the attacker's credentials left behind in RAM. Extract the flag that proves exactly what they accessed.",
        steps: [
          "Search through the extracted memory strings methodically",
          "Look for process names related to authentication or remote access",
          "Identify username and password artifacts in memory",
          "Locate and extract the flag marker"
        ],
        artifact: `process=ssh
user=admin
password=Winter2024!
FLAG=CTF{memory_never_forgets}`,
        flag: "CTF{memory_never_forgets}",
        source: "Inspired by Volatility memory forensics labs"
      },
      hard: {
        title: "The Midnight Deletion",
        difficulty: "Hard",
        points: 500,
        category: "Forensics",
        storyline: "It's day 47 of the internal investigation at TechVault Industries. Someone has been stealing source code—millions of dollars worth of proprietary AI algorithms—and selling it to competitors. The FBI is involved. Careers are ending. Three suspects remain: the CTO, a senior engineer, and the head of security. Last night, someone made a move. At 2:34 AM, logs show massive file deletion activity from an unknown workstation. The attacker used secure deletion tools, cleared system logs, even zeroed out the bash history. They thought they were invisible. But they forgot about the EXT4 journal. Your supervisor hands you a disk image: 'This is our last shot. The executive board meets in 6 hours. If we can't prove who did this, they're shutting down the whole investigation.' You mount the filesystem and start carving through deleted inodes. The digital ghosts tell their story if you know how to listen.",
        mission: "Perform advanced filesystem forensics on the EXT4 journal. Recover deleted file remnants that prove who stole the source code. Extract the flag from the hidden cache.",
        steps: [
          "Examine the deleted inode metadata carefully",
          "Correlate file deletion timestamps with the attack window",
          "Reconstruct the path to the hidden cache directory",
          "Extract the flag from the recovered file content"
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
        title: "The Rookie's Cipher",
        difficulty: "Easy",
        points: 100,
        category: "Cryptography",
        storyline: "You're training a new batch of junior analysts at CyberDefense Inc. During a routine security audit, one of the trainees—Alex, fresh out of college—proudly announces: 'I encrypted all the sensitive test data before uploading it to the shared drive. Nobody can read it now!' You ask what encryption method they used. Alex grins: 'Caesar cipher with a random shift. Super secure!' Your heart sinks. You pull up the file and see the 'encrypted' message sitting there. This is going to be a teaching moment. But first, you need to decrypt it to show Alex exactly why ancient Roman military ciphers don't belong in modern security.",
        mission: "Decrypt Alex's 'encrypted' message to demonstrate why Caesar ciphers are not secure. Show the rookie what real security looks like by capturing the flag.",
        steps: [
          "Identify that this is a simple Caesar cipher",
          "Apply the shift value provided in the hint",
          "Decrypt the message character by character",
          "Read the plaintext flag and prepare your security lecture"
        ],
        artifact: `Encrypted: FWG{vlpsoh_flskhu}
Hint: Shift by 3`,
        flag: "CTF{simple_cipher}",
        source: "Inspired by classical cryptography exercises"
      },
      medium: {
        title: "The Developer Who Didn't Know",
        difficulty: "Medium",
        points: 250,
        category: "Cryptography",
        storyline: "CloudStore, a startup with 50,000 users, just filed for their Series B funding. During the due diligence security audit, you discover something that makes your blood run cold. The lead developer, Jamie, stored API keys for the payment processor in the database. When you ask about encryption, Jamie smiles confidently: 'Oh yeah, totally encrypted. I used Base64.' Your face must give it away because Jamie's smile fades. 'That... that is encryption, right?' You close your eyes. Base64 is encoding, not encryption. Every API key, every secret, every credential is sitting in that database as readable as plain text—just wearing a thin disguise. The investors are signing papers tomorrow. If this leaks, the deal is dead. You need to prove how bad this is.",
        mission: "Decode the 'encrypted' API credentials to show Jamie the difference between encoding and encryption. Extract the flag and save the company before the investors find out.",
        steps: [
          "Recognize that Base64 is encoding, not encryption",
          "Use any Base64 decoder to reverse the transformation",
          "Extract the plaintext value",
          "Capture the flag and document this critical vulnerability"
        ],
        artifact: `Q1RGe2VuY29kaW5nX2lzX25vdF9lbmNyeXB0aW9ufQ==`,
        flag: "CTF{encoding_is_not_encryption}",
        source: "Inspired by real-world data exposure cases"
      },
      hard: {
        title: "The MD5 Museum",
        difficulty: "Hard",
        points: 500,
        category: "Cryptography",
        storyline: "You're called in to consult on the biggest healthcare breach of 2026. HealthFirst Database Systems—storing medical records for 12 million patients—was compromised. The attackers downloaded the entire user table: 400,000 doctor accounts, complete with password hashes. The CTO insists they're safe: 'We use MD5 hashing. Nobody can crack that.' You physically bite your tongue to avoid laughing. MD5 has been broken since 2004. These 'hashes' are basically plaintext with extra steps. The FBI wants proof of concept. You need to demonstrate that you can crack these hashes in minutes, not years. They hand you a sample hash from the leaked database. 'Show us,' the lead investigator says. You pull up your laptop. This will take about 30 seconds.",
        mission: "Demonstrate the catastrophic weakness of MD5 hashing by cracking the sample password hash. Prove that HealthFirst's security was an illusion and recover the plaintext flag.",
        steps: [
          "Identify this as an MD5 hash (32 hexadecimal characters)",
          "Understand that MD5 is cryptographically broken",
          "Use rainbow tables or hash lookup to reverse it",
          "Recover the plaintext password—which is the flag"
        ],
        artifact: `MD5: 5f4dcc3b5aa765d61d8327deb882cf99
FLAG is plaintext value`,
        flag: "CTF{password}",
        source: "Inspired by hash cracking labs (TryHackMe / HTB)"
      }
    },
    network: {
      easy: {
        title: "The Unencrypted Confession",
        difficulty: "Easy",
        points: 100,
        category: "Network Analysis",
        storyline: "It's your first week as a network security analyst at GlobalTech Corp. During a routine network monitoring session, your IDS starts lighting up red. Someone on the internal network is accessing admin panels they shouldn't have access to. Your supervisor hands you a packet capture: '15 minutes ago. Figure out who and how.' You load the PCAP into Wireshark, expecting encrypted HTTPS traffic that will take hours to decrypt. But what you see makes you do a double take. HTTP. Plain HTTP. In 2026. Someone is sending admin credentials across the corporate network in clear text. You can literally read the username and password like you're reading a book. Either this is a test, or someone at GlobalTech is having a very bad day.",
        mission: "Analyze the packet capture to identify the unencrypted credentials. Extract the flag from the clear-text HTTP traffic and report who is violating security protocol.",
        steps: [
          "Open the packet capture and filter for HTTP traffic",
          "Follow the TCP stream to see the complete request",
          "Look for Authorization headers or credentials",
          "Decode the Base64 Basic auth and extract the flag"
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
        title: "The DNS Smuggler",
        difficulty: "Medium",
        points: 300,
        category: "Network Analysis",
        storyline: "Axiom Financial's CISO is losing sleep. They've locked down everything: firewall rules tighter than Fort Knox, DLP monitoring every outbound connection, USB ports disabled, even the coffee machine is on a separate VLAN. Yet somehow, for the past three weeks, confidential merger documents have been appearing on competitor websites hours after internal meetings. The FBI cyber division suspects an insider, but they can't figure out how data is leaving the building. Every HTTPS connection is inspected. Every email is scanned. Nothing. You're brought in as a last resort. 'Find the leak or we're all getting fired,' the CISO says. You start analyzing network logs and notice something odd: thousands of DNS queries to weird subdomains, all pointing to an attacker-controlled domain. Your pulse quickens. DNS tunneling. The oldest trick in the book. They're hiding data in DNS queries—the one protocol that's allowed through every firewall without inspection.",
        mission: "Analyze the suspicious DNS query patterns. Decode the exfiltrated data hidden in the subdomains. Prove how the attacker is smuggling secrets and capture the flag.",
        steps: [
          "Examine the DNS query subdomains carefully",
          "Recognize that the subdomains contain hexadecimal data",
          "Concatenate all subdomain prefixes in chronological order",
          "Convert from hex to ASCII to reveal the message"
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
          "DNS queries can carry more than just domain lookups",
          "Hexadecimal encoding is commonly used for data exfiltration",
          "The order of queries matters—reconstruct them chronologically"
        ],
        source: "Inspired by network forensics and DNS tunneling techniques"
      },
      hard: {
        title: "The Certificate Imposter",
        difficulty: "Hard",
        points: 500,
        category: "Network Analysis",
        storyline: "Emergency call at 4 AM. You're the lead incident responder for a Fortune 500 company. The night SOC team detected something impossible: TLS-encrypted traffic from the CEO's laptop shows two different certificate chains for the same domain. One is legitimate. One isn't. Someone is performing an active man-in-the-middle attack on the executive network. Right now. The CEO is currently logged into the company's banking portal, authorizing a $50M wire transfer. You have minutes—maybe seconds—before the attacker intercepts those credentials and empties the corporate account. The SOC team hands you the private key they extracted from the rogue certificate and a capture of the encrypted session. 'Can you decrypt this?' they ask, panic in their voices. 'We need to know what the attacker saw.' You load the files. The clock is ticking.",
        mission: "Use the captured private key to decrypt the TLS session. Determine exactly what data the attacker intercepted during the MITM attack. Extract the flag proving the breach.",
        steps: [
          "Load the private key into your analysis tool",
          "Decrypt the TLS session using the master secret",
          "Extract the application layer data from the encrypted stream",
          "Find the flag in the decrypted HTTP payload"
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
        title: "The Vacation Disaster",
        difficulty: "Easy",
        points: 100,
        category: "OSINT",
        storyline: "Jessica from HR just got hacked. Her email, her bank account, even her smart home—all compromised. The attacker knew her childhood pet's name, her mother's maiden name, her first school. 'How did they know all my security questions?' she asks, terrified. You pull up her social media. Jessica has 4,200 followers and posts constantly. Last week, she posted vacation photos with geotags enabled. Yesterday, she shared a #ThrowbackThursday to elementary school with her teacher's name visible. Three days ago, a 'What's your hacker name?' quiz where she entered her pet's name. You don't have the heart to tell her yet—she handed every answer to an attacker on a silver platter. But first, you need to prove how easy it was.",
        mission: "Investigate Jessica's public social media post. Extract the metadata and information that an attacker could weaponize. Find the flag hidden in the image data.",
        steps: [
          "Read the social media post and image description",
          "Examine the image EXIF metadata carefully",
          "Look for embedded comments or GPS coordinates",
          "Extract the flag from the metadata"
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
        title: "The Digital Breadcrumb Trail",
        difficulty: "Medium",
        points: 250,
        category: "OSINT",
        storyline: "Anonymous tip received at 6:43 PM: 'Check out cyber_analyst_2024. They're not who they claim to be.' The message came through your company's security hotline. No name. No callback number. But it's enough to start digging. cyber_analyst_2024 has been applying for senior security positions at defense contractors—jobs requiring Top Secret clearance. The resume is impressive: 10 years of experience, CISSP certified, former government work. But something feels off. You start with the basics: search the username. Within minutes, you find the same handle across GitHub, Twitter, Reddit, and LinkedIn. Same person? Or identity theft? Each profile tells a slightly different story. The GitHub account is two months old. The Twitter account claims to have 'worked in cybersecurity since 2014' but the account was created in 2023. The Reddit posts discuss being a student. Someone is lying. You need to figure out who—and what they're hiding.",
        mission: "Track cyber_analyst_2024 across multiple platforms. Cross-reference the profiles to find inconsistencies. Locate the flag hidden in one of their public profiles.",
        steps: [
          "Search for the username across major platforms",
          "Compare profile information for contradictions",
          "Look for flags in bio sections or profile descriptions",
          "Determine which profile reveals the truth"
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
          "People often reveal more than they intend on social media",
          "Check bio sections—they're frequently overlooked",
          "Username reuse makes OSINT investigations much easier"
        ],
        source: "Inspired by Bellingcat OSINT methodology"
      },
      hard: {
        title: "The Deleted Evidence",
        difficulty: "Hard",
        points: 500,
        category: "OSINT",
        storyline: "The lawsuit has been going on for eight months. MegaCorp is suing StartupX for stealing trade secrets. StartupX's defense is simple: 'We developed everything independently. We never had access to MegaCorp's internal documents.' But MegaCorp's legal team has a hunch. Two years ago, StartupX's CTO—then a junior engineer at MegaCorp—posted something on the company blog about a new feature. The blog post is gone now. Deleted. Scrubbed. StartupX claims it never existed. But you know better. The internet never forgets. You fire up the Wayback Machine and start searching for archived versions of the blog. The current site shows nothing. But if you can find that archived post—if you can prove the CTO had detailed knowledge of MegaCorp's proprietary systems before leaving—this case is over. $50M in damages hangs in the balance. You type in the URL and hit search.",
        mission: "Use internet archives to recover the deleted blog post. Find proof that StartupX had access to confidential information. Extract the flag from the archived content.",
        steps: [
          "Check the current website to see what's been removed",
          "Use the Wayback Machine to view historical snapshots",
          "Compare archived versions to find deleted pages",
          "Extract the flag from the recovered deleted content"
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
              fontFamily
