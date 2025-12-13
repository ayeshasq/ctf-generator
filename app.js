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
      title: "Cookie Monster",
      story: `🎭 THE SITUATION:
You're a security consultant hired by "SecureShop Inc" to test their new e-commerce website. During your initial reconnaissance, you notice something strange - the website uses cookies to determine if you're an admin or regular user.

🔍 THE DISCOVERY:
While browsing the site, you opened your browser's Developer Tools (you were just curious about the design) and noticed a cookie called 'isAdmin' set to 'false'. This is a major red flag! Authentication and authorization should NEVER be handled client-side where users can modify values.

🎯 YOUR MISSION:
The CEO wants you to prove this vulnerability is real. Your task: modify the cookie to gain admin access WITHOUT knowing any admin passwords. Once you access the admin panel, you'll find the flag that proves you successfully exploited this vulnerability.

💡 WHAT YOU NEED TO KNOW:
Cookies are small pieces of data stored in your browser. They're meant for things like "remember me" functionality or shopping carts. However, they're NOT secure for storing sensitive information like "is this person an admin?" because anyone can edit their own cookies.

This is a real vulnerability called "Insecure Direct Object Reference" (IDOR) and "Client-Side Security Controls." Major companies have been hacked this way!

🏁 SUCCESS LOOKS LIKE:
You'll know you succeeded when you see the admin dashboard with sensitive user data and the flag displayed at the top.`,
      
      description: "Exploit client-side authentication by modifying browser cookies to gain unauthorized admin access.",
      
      scenario: `📋 DETAILED SCENARIO:

COMPANY: SecureShop Inc (E-commerce platform)
YOUR ROLE: Penetration Tester (White Hat Hacker)
TARGET: https://secureshop.example.com/login

WHAT HAPPENED:
1. You registered a normal user account (username: test@test.com)
2. After logging in, you're browsing products
3. Out of curiosity, you press F12 (Developer Tools)
4. In the Application tab, you see cookies for this domain
5. One cookie catches your eye: 'isAdmin' = 'false'

THE VULNERABILITY:
The developers made a critical mistake: they're checking if you're an admin by looking at a COOKIE (which you control) instead of checking a database on their server (which they control).

REAL-WORLD IMPACT:
If this were a real site, you could:
- View all customer data (names, addresses, emails)
- Modify prices (make everything $0.01)
- Delete products or entire accounts
- Access financial reports
- Change other users' passwords

WHY THIS MATTERS:
In 2019, a major airline had this exact vulnerability. Hackers changed cookies to view other passengers' boarding passes and personal information. The company was fined millions.`,

      steps: [
        "🌐 STEP 1: Open the target website in your browser (Chrome, Firefox, or Edge)",
        "⌨️ STEP 2: Press F12 key (or right-click → Inspect) to open Developer Tools",
        "📁 STEP 3: Click the 'Application' tab (Chrome) or 'Storage' tab (Firefox)",
        "🍪 STEP 4: In the left sidebar, expand 'Cookies' and click on the website domain",
        "🔍 STEP 5: Look through the cookies list and find one named 'isAdmin'",
        "👁️ STEP 6: Notice the value is currently set to 'false'",
        "✏️ STEP 7: Double-click on 'false' to edit it, change it to 'true'",
        "🔄 STEP 8: Press Enter to save, then refresh the page (F5 or Ctrl+R)",
        "🎉 STEP 9: The page now thinks you're an admin! Look for the admin panel",
        "🚩 STEP 10: Navigate to the admin dashboard and capture the flag displayed at the top!"
      ],
      
      flag: "CTF{c00k13_m0n5t3r_n0m}",
      points: 100,
      
      hints: [
        "💡 HINT 1: Browser cookies are stored locally on YOUR computer, which means YOU have full control to view and modify them. This is why sensitive authentication data should NEVER be stored in cookies. Press F12 and look in Application → Cookies.",
        
        "💡 HINT 2: You're looking for a cookie specifically named 'isAdmin'. It's currently set to 'false' (meaning you're not an admin). In the cookies section, find this cookie and double-click the 'false' value to edit it.",
        
        "💡 HINT 3: Change the cookie value from 'false' to 'true' (without quotes), press Enter to save, then refresh the page (F5). The website will now read your cookie and think you're an admin because it trusts client-side data!"
      ],

      tools: "🛠️ Tools Needed: Any modern web browser (Chrome, Firefox, Edge) - No special software required!",
      
      realWorldExample: `🌍 REAL ATTACK EXAMPLE:

In 2018, British Airways suffered a massive data breach affecting 380,000 customers. While not exactly cookie manipulation, it was a client-side attack where attackers modified JavaScript to steal payment information.

SIMILAR VULNERABLE COMPANIES:
- 2020: A major US healthcare provider - Cookie manipulation allowed access to patient records
- 2019: European airline - Cookie tampering exposed boarding passes
- 2021: Government portal - Session cookies were predictable, allowing account takeover

LESSON: Never trust the client. Always validate permissions on the server side, not in cookies or JavaScript that users control.`,

      defenseGuide: `🛡️ HOW TO DEFEND AGAINST THIS:

FOR DEVELOPERS:
1. NEVER store sensitive auth data in cookies (use secure server-side sessions)
2. Use HttpOnly flag (prevents JavaScript access to cookies)
3. Use Secure flag (only transmit cookies over HTTPS)
4. Use SameSite flag (prevents CSRF attacks)
5. Always verify permissions on the server, not client

PROPER IMPLEMENTATION:
❌ BAD: if (cookie.isAdmin === 'true') { showAdminPanel(); }
✅ GOOD: Check database on server: SELECT role FROM users WHERE id = session.userId

THE GOLDEN RULE: The client is in enemy territory. Never trust user input or client-side data.`
    },

    medium: {
      title: "SQL Injection Portal",
      
      story: `🎭 THE SITUATION:
You're conducting a security audit for "DataCorp Solutions," a company that stores sensitive customer information. They've built a custom login portal for their employee management system. During your initial tests, you notice the login form doesn't properly validate user input.

🔍 THE DISCOVERY:
While trying to log in with a test account, you accidentally typed a single quote (') in the username field. The website crashed with a database error message: "SQL syntax error near..." This is a HUGE red flag - it means your input is being directly inserted into a SQL database query without any sanitization!

💣 THE VULNERABILITY:
This is called SQL Injection, one of the most dangerous web vulnerabilities (OWASP Top 10 #3). It allows attackers to inject malicious SQL code into queries, potentially reading, modifying, or deleting entire databases.

🎯 YOUR MISSION:
Prove this vulnerability by bypassing the authentication system WITHOUT knowing any valid passwords. Your goal is to log in as the admin user and retrieve the flag from their dashboard. You need to craft a SQL injection payload that makes the database query always return true.

💀 REAL-WORLD IMPACT:
In 2017, Equifax was breached via SQL injection, exposing personal data of 147 million people (names, Social Security numbers, birth dates, addresses). The company paid $700 million in settlements. This attack technique is still common today.

🏁 SUCCESS LOOKS LIKE:
You'll know you succeeded when you're logged in as "admin" without entering a password, and you see the admin dashboard with the flag displayed.`,

      description: "Exploit SQL injection vulnerability in a login form to bypass authentication and gain admin access.",

      scenario: `📋 DETAILED SCENARIO:

COMPANY: DataCorp Solutions (Employee Management System)
YOUR ROLE: Security Auditor
TARGET: https://datacorp.example.com/admin/login
DATABASE: MySQL (stores 10,000+ employee records)

THE TECHNICAL DETAILS:
Behind the scenes, when you submit the login form, the server runs this SQL query:

SELECT * FROM users WHERE username='[YOUR_INPUT]' AND password='[YOUR_INPUT]'

If this query returns any rows, you're logged in. If it returns nothing, login fails.

NORMAL LOGIN (Fails):
Username: test@example.com
Password: wrongpassword
Query: SELECT * FROM users WHERE username='test@example.com' AND password='wrongpassword'
Result: 0 rows → Access Denied ❌

THE EXPLOIT:
What if we could make the query ALWAYS return rows, regardless of the password?

INJECTION PAYLOAD:
Username: admin' OR '1'='1
Password: (anything or leave empty)

RESULTING QUERY:
SELECT * FROM users WHERE username='admin' OR '1'='1' AND password=''

WHAT HAPPENS:
1. The query looks for username='admin' OR '1'='1'
2. Since '1' always equals '1', the OR condition is ALWAYS TRUE
3. The query returns the admin user row
4. You're logged in as admin! 🎉

WHY IT WORKS:
The single quote (') breaks out of the SQL string
OR '1'='1' adds a condition that's always true
The rest of the query is ignored or commented out`,

      steps: [
        "🌐 STEP 1: Navigate to the login page at datacorp.example.com/admin/login",
        "👁️ STEP 2: Look at the form - it has two fields: username and password",
        "🧠 STEP 3: Understand the vulnerable query: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'",
        "💉 STEP 4: In the USERNAME field, enter: admin' OR '1'='1",
        "📝 STEP 5: In the PASSWORD field, enter anything (or leave it blank)",
        "🔍 STEP 6: Before clicking login, understand what will happen: The query becomes: WHERE username='admin' OR '1'='1' AND password=''",
        "💡 STEP 7: Since '1'='1' is always true, the OR condition bypasses the password check",
        "🖱️ STEP 8: Click the 'Login' button",
        "🎊 STEP 9: You should now be logged in as admin without knowing the real password!",
        "🚩 STEP 10: Navigate to the admin dashboard and locate the flag (usually in a welcome message or header)"
      ],

      flag: "CTF{5ql_1nj3ct10n_m4st3r}",
      points: 250,

      hints: [
        "💡 HINT 1: SQL injection works by 'breaking out' of the expected query structure using special characters like single quotes ('). The vulnerable query is: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'. Your goal is to make this query return true without knowing the password.",

        "💡 HINT 2: Try entering this EXACT payload in the username field: admin' OR '1'='1  (notice the single quote at the start and no closing quote - the SQL query will add that). The OR '1'='1' part creates a condition that's ALWAYS true, bypassing authentication. You can enter anything in the password field or leave it empty.",

        "💡 HINT 3: Here's what's happening behind the scenes: Your input transforms the query to: SELECT * FROM users WHERE username='admin' OR '1'='1' AND password=''. Since 1 always equals 1, the database returns the admin user, and you're logged in! Alternative payloads: ' OR '1'='1' --  or  admin'#  or  ' OR 1=1--"
      ],

      tools: "🛠️ Tools Needed: Web browser (for manual testing), Burp Suite (for advanced testing), sqlmap (automated SQL injection tool)",

      realWorldExample: `🌍 REAL ATTACK EXAMPLES:

1. EQUIFAX (2017) - $700M Settlement:
   • 147 million people affected
   • SQL injection in web application
   • Attackers stole names, SSN, birth dates, addresses
   • Company stock dropped 35%

2. HEARTLAND PAYMENT SYSTEMS (2008):
   • 130 million credit cards stolen
   • SQL injection gave access to payment systems
   • $140 million in fines and settlements

3. SONY PICTURES (2011):
   • 77 million PlayStation Network accounts
   • SQL injection in outdated web application
   • Network down for 23 days
   • $171 million in costs

4. TALKTAL (2015):
   • 157,000 customers affected  
   • "Basic" SQL injection attack (according to their CEO)
   • £77 million fine

WHY IT'S STILL COMMON:
Despite being well-known since the 1990s, SQL injection remains in the OWASP Top 10 because:
- Legacy code still in production
- Developers unaware of secure coding practices
- Rushed development timelines
- Poor code review processes`,

      defenseGuide: `🛡️ HOW TO DEFEND AGAINST SQL INJECTION:

1. PARAMETERIZED QUERIES (Prepared Statements) ✅
❌ BAD:  query = "SELECT * FROM users WHERE username='" + input + "'"
✅ GOOD: query = "SELECT * FROM users WHERE username=?"
         preparedStatement.setString(1, input)

2. INPUT VALIDATION:
- Whitelist allowed characters
- Reject special characters like ' " ; --
- Use regex to validate format

3. LEAST PRIVILEGE:
- Database user should only have necessary permissions
- Don't use 'root' or 'admin' accounts for web apps
- Read-only access where possible

4. WEB APPLICATION FIREWALL (WAF):
- CloudFlare, AWS WAF, ModSecurity
- Detects and blocks SQL injection attempts
- Defense in depth strategy

5. ERROR HANDLING:
- Never show database errors to users
- Log errors server-side only
- Generic error messages: "Login failed" (not "SQL syntax error")

6. ORM FRAMEWORKS:
- Django ORM, SQLAlchemy, Hibernate
- Automatically parameterize queries
- Still requires careful use!

CODE EXAMPLES:

PYTHON (Safe):
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))

PHP (Safe):
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);

JAVA (Safe):
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE username = ?");
ps.setString(1, username);

THE GOLDEN RULE: Never concatenate user input directly into SQL queries!`
    },

    hard: {
      title: "XSS Treasure Hunt",

      story: `🎭 THE SITUATION:
You're a bug bounty hunter investigating "SocialConnect," a popular social media platform with 2 million users. Your target: the comment section where users can post messages on each other's profiles. You've been specifically looking for Cross-Site Scripting (XSS) vulnerabilities - a type of attack where you can inject malicious JavaScript into a website.

🔍 THE DISCOVERY:
While testing the comment feature, you noticed something alarming: when you post a comment with HTML tags like <b>bold text</b>, the text actually appears BOLD on the page. This means the website is rendering your HTML without sanitizing it! If HTML works, maybe JavaScript works too...

You tried posting: <script>alert('XSS')</script>
And... an alert box appeared! 🚨 This is a CONFIRMED XSS vulnerability!

💣 THE VULNERABILITY:
This is called "Stored XSS" (also called Persistent XSS) - one of the most dangerous web vulnerabilities. Unlike reflected XSS (one-time), stored XSS saves your malicious code in the database. Every person who views the page will execute your JavaScript in THEIR browser.

🎯 YOUR MISSION:
The platform admin regularly checks all user comments for inappropriate content. Your goal is to craft a JavaScript payload that will execute when the admin views your comment. The payload should extract a secret flag stored in a hidden <div> on the admin's view of the page.

⚠️ THE CHALLENGE:
The developers have implemented some basic protections:
- The word "script" is blocked in some places
- Some JavaScript events are filtered
- But there are ways around these filters...

🏁 SUCCESS LOOKS LIKE:
When your payload executes in the admin's browser, it should display an alert() showing the contents of the hidden div with id="admin-secret". The flag is hidden there!`,

      description: "Exploit a stored XSS vulnerability in a comment system to execute JavaScript and extract hidden admin data.",

      scenario: `📋 DETAILED SCENARIO:

COMPANY: SocialConnect (Social Media Platform)
YOUR ROLE: Bug Bounty Hunter
TARGET: https://socialconnect.example.com/profile/comments
USERS AFFECTED: 2 million (if exploited maliciously)
BOUNTY REWARD: $5,000 for critical XSS

THE TECHNICAL BREAKDOWN:

WHAT IS XSS?
Cross-Site Scripting allows attackers to inject malicious JavaScript into trusted websites. When victims visit the page, the malicious code runs in THEIR browser with THEIR cookies and permissions.

THE VULNERABLE CODE (Server-Side):
// BAD - No sanitization!
comment = request.POST['comment']
save_to_database(comment)
display_on_page(comment)  // Renders HTML directly!

WHAT ATTACKERS CAN DO:
1. Steal session cookies → Account takeover
2. Redirect to phishing sites
3. Inject keyloggers
4. Modify page content
5. Steal sensitive data
6. Perform actions as the victim

YOUR SPECIFIC TARGET:
When the admin views comments, the page includes:
<div id="admin-secret" style="display:none">CTF{xss_h4x0r_3l1t3}</div>

This div is only present when an admin views the page (regular users don't see it).

THE ATTACK CHAIN:
1. You post a malicious comment with JavaScript
2. Comment is saved to database
3. Admin logs in to review comments
4. Your JavaScript executes in admin's browser
5. Your code accesses document.getElementById('admin-secret')
6. You extract the flag!

PAYLOAD EXAMPLES:

BASIC (If nothing is filtered):
<script>alert(document.getElementById('admin-secret').innerText)</script>

IF <script> IS BLOCKED:
<img src=x onerror='alert(document.getElementById("admin-secret").innerText)'>

IF QUOTES ARE FILTERED:
<img src=x onerror=alert(document.getElementById(String.fromCharCode(97,100,109,105,110,45,115,101,99,114,101,116)).innerText)>

ADVANCED (Bypass all filters):
<svg/onload=alert(document.getElementById('admin-secret').innerText)>`,

      steps: [
        "🌐 STEP 1: Navigate to the profile page and find the comment section",
        "🧪 STEP 2: First, test if HTML is rendered: Post <b>test</b> and see if it appears bold",
        "✅ STEP 3: If HTML works, XSS is likely possible! Now test basic JavaScript",
        "💉 STEP 4: Try the simplest XSS payload first: <script>alert('XSS Test')</script>",
        "🚫 STEP 5: If that's blocked (script tag filtered), try an alternative: <img src=x onerror='alert(1)'>",
        "📝 STEP 6: Once you confirm XSS works, craft the payload to access the hidden div",
        "🎯 STEP 7: Use this payload: <script>alert(document.getElementById('admin-secret').innerText)</script>",
        "📮 STEP 8: If <script> is filtered, use: <img src=x onerror='alert(document.getElementById(\"admin-secret\").innerText)'>",
        "🔄 STEP 9: Submit your comment (it will be saved to database)",
        "👑 STEP 10: When the admin views the page, your JavaScript executes and displays the flag!",
        "🚩 STEP 11: The alert box will show: CTF{xss_h4x0r_3l1t3}"
      ],

      flag: "CTF{xss_h4x0r_3l1t3}",
      points: 500,

      hints: [
        "💡 HINT 1: XSS works by injecting JavaScript into a webpage that executes in other users' browsers. Start simple: try posting <script>alert('test')</script> in the comment field. If that's blocked, the developers have some protection. Try alternative methods like <img src=x onerror='alert(1)'> which uses an HTML event handler instead of a script tag.",

        "💡 HINT 2: Your goal is to access document.getElementById('admin-secret').innerText - this reads the content of the hidden div that only appears for admins. Try this payload: <script>alert(document.getElementById('admin-secret').innerText)</script> If the <script> tag is filtered, use an img tag with onerror: <img src=x onerror='alert(document.getElementById(\"admin-secret\").innerText)'>",

        "💡 HINT 3: If both approaches are blocked, try these alternatives: <svg/onload=alert(document.getElementById('admin-secret').innerText)> or <body onload=alert(document.getElementById('admin-secret').innerText)> or <iframe src=javascript:alert(document.getElementById('admin-secret').innerText)>. One of these should bypass the filters! The key is that different HTML tags and events can execute JavaScript."
      ],

      tools: "🛠️ Tools Needed: Web browser, Burp Suite (for payload testing), XSS Hunter (for blind XSS), Browser DevTools (F12)",

      realWorldExample: `🌍 REAL XSS ATTACK EXAMPLES:

1. BRITISH AIRWAYS (2018) - $230M GDPR Fine:
   • XSS used to inject payment skimmer
   • 380,000 credit cards stolen
   • Attackers modified checkout page JavaScript
   • Largest GDPR fine at the time

2. EBAY (2014):
   • Stored XSS in product listings
   • Could steal user credentials
   • Affected millions of users
   • Took weeks to patch fully

3. TWEETDECK (2014):
   • Self-propagating XSS worm
   • Posted itself in tweets automatically
   • Spread to 80,000+ accounts in minutes
   • Twitter had to shut down TweetDeck temporarily

4. MYSPACE SAMY WORM (2005):
   • First major social media XSS worm
   • 1 million friend requests in 20 hours
   • Fastest spreading virus at the time
   • Creator pleaded guilty to computer crimes

5. FORTNITE (2019):
   • XSS in account authentication
   • Could hijack any Fortnite account
   • Access to payment information
   • Discovered by security researchers

WHY XSS IS DANGEROUS:
- Can steal session cookies → Account takeover
- Inject cryptocurrency miners
- Redirect to phishing pages
- Install keyloggers  
- Spread malware
- Deface websites
- Steal sensitive data`,

      defenseGuide: `🛡️ HOW TO DEFEND AGAINST XSS:

1. OUTPUT ENCODING (Most Important!) ✅
Encode ALL user input before displaying:
❌ BAD:  <div>${userComment}</div>
✅ GOOD: <div>${escapeHtml(userComment)}</div>

2. CONTENT SECURITY POLICY (CSP):
Add HTTP header:
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random123'

This tells browsers to only execute scripts from trusted sources.

3. INPUT VALIDATION:
- Whitelist allowed characters
- Reject <script>, <iframe>, javascript:
- Use libraries like DOMPurify

4. HttpOnly COOKIES:
Set-Cookie: sessionId=abc123; HttpOnly; Secure
// JavaScript cannot access HttpOnly cookies!

5. X-XSS-PROTECTION HEADER:
X-XSS-Protection: 1; mode=block

6. ESCAPE CONTEXTS:
Different contexts need different encoding:
- HTML: &lt; &gt; &amp;
- JavaScript: \\x3C \\x3E
- URL: %3C %3E
- CSS: \\3C \\3E

CODE EXAMPLES:

PYTHON (Django):
from django.utils.html import escape
safe_comment = escape(user_comment)

JAVASCRIPT (React):
// React automatically escapes!
<div>{userComment}</div>  // Safe!

PHP:
$safe = htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');

NODE.JS:
const escapeHtml = require('escape-html');
const safe = escapeHtml(userInput);

THE GOLDEN RULE: Never trust user input! Always encode before displaying, no matter where it came from.

DEFENSE IN DEPTH:
1. Input validation (filter bad input)
2. Output encoding (escape when displaying)
3. CSP headers (block inline scripts)
4. HttpOnly cookies (protect sessions)
5. Regular security audits
6. Web Application Firewall (WAF)`
    }
  },
  
  // Continue with other categories using same deep storyline structure...
  // I can provide the rest if you want!
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
