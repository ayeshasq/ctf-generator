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

  const generateChallenge = async () => {
    setLoading(true);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);

    const categoryType = selectedCategory === 'random' 
      ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id 
      : selectedCategory;

    const prompts = {
      web: `Create a unique ${difficulty} difficulty web exploitation CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence engaging storyline",
  "description": "Detailed challenge description explaining the scenario and what to find",
  "flag": "CTF{something_unique}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"]
}`,
      
      forensics: `Create a unique ${difficulty} difficulty forensics CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence compelling storyline",
  "description": "Detailed scenario description",
  "flag": "CTF{something_unique}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"]
}`,
      
      crypto: `Create a unique ${difficulty} difficulty cryptography CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence intriguing storyline",
  "description": "Detailed problem description",
  "encrypted_message": "The encrypted text",
  "flag": "CTF{something_unique}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"]
}`,
      
      network: `Create a unique ${difficulty} difficulty network analysis CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence realistic storyline",
  "description": "Detailed description of network traffic scenario",
  "flag": "CTF{something_unique}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"]
}`,
      
      osint: `Create a unique ${difficulty} difficulty OSINT CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence investigative storyline",
  "description": "Detailed mission description",
  "flag": "CTF{something_unique}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"]
}`
    };

    const points = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 250 : 500;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: prompts[categoryType]
          }]
        })
      });

      const data = await response.json();
      let content = data.content[0].text.trim();
      
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsedChallenge = JSON.parse(content);
      parsedChallenge.points = points;
      
      setChallenge({
        category: categoryType,
        difficulty: difficulty,
        data: parsedChallenge,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating challenge:', error);
      alert('Failed to generate challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitFlag = () => {
    if (!flagInput.trim()) return;
    
    setAttempts(prev => prev + 1);
    
    if (flagInput.trim() === challenge.data.flag.trim()) {
      setFlagStatus('correct');
    } else {
      setFlagStatus('incorrect');
    }
  };

  const resetChallenge = () => {
    setChallenge(null);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1a0b2e, #6b21a8, #1a0b2e)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', paddingTop: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛡️</div>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '10px',
            background: 'linear-gradient(to right, #c084fc, #ec4899, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI CTF Challenge Generator
          </h1>
          <p style={{ fontSize: '20px', color: '#d1d5db' }}>
            Generate unique hacking challenges in 30 seconds
          </p>
        </div>

        {/* Configuration Panel */}
        {!challenge && (
          <div style={{
            background: 'rgba(31, 41, 55, 0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid rgba(168, 85, 247, 0.2)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              
              {/* Categories */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' }}>
                  Challenge Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: selectedCategory === cat.id ? '2px solid white' : '2px solid #4b5563',
                        background: selectedCategory === cat.id ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(55, 65, 81, 0.5)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{cat.emoji}</div>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' }}>
                  Difficulty Level
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      style={{
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
                      }}
                    >
                      <span>{level}</span>
                      <span style={{ fontSize: '14px' }}>
                        {level === 'easy' ? '100 pts' : level === 'medium' ? '250 pts' : '500 pts'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateChallenge}
              disabled={loading}
              style={{
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
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid white',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Generating Challenge...
                </>
              ) : (
                <>
                  {categories.find(c => c.id === selectedCategory)?.emoji || '🎲'}
                  Generate {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge
                </>
              )}
            </button>
          </div>
        )}

        {/* Challenge Display */}
        {challenge && (
          <div>
            <div style={{
              background: 'rgba(147, 51, 234, 0.2)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
                  {challenge.data.title}
                </h2>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '6px 12px', 
                    background: 'rgba(168, 85, 247, 0.3)', 
                    borderRadius: '20px' 
                  }}>
                    {challenge.category.toUpperCase()}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '6px 12px', 
                    background: 'rgba(59, 130, 246, 0.3)', 
                    borderRadius: '20px' 
                  }}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '6px 12px', 
                    background: 'rgba(234, 179, 8, 0.3)', 
                    borderRadius: '20px' 
                  }}>
                    ⚡ {challenge.data.points} pts
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '15px'
              }}>
                <p style={{ color: '#d1d5db', fontStyle: 'italic' }}>{challenge.data.storyline}</p>
              </div>

              <div style={{
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <p style={{ color: '#e5e7eb', lineHeight: '1.6' }}>{challenge.data.description}</p>
              </div>
            </div>

            {/* Flag Submission */}
            <div style={{
              background: 'rgba(31, 41, 55, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '24px',
              padding: '40px',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
                🚩 Capture The Flag
              </h3>

              {flagStatus === null ? (
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                  <p style={{ color: '#d1d5db', marginBottom: '20px' }}>
                    Attempts: {attempts}
                  </p>
                  <input
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitFlag()}
                    placeholder="Enter flag (e.g., CTF{...})"
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '2px solid rgba(168, 85, 247, 0.5)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      color: 'white',
                      marginBottom: '16px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={submitFlag}
                    disabled={!flagInput.trim()}
                    style={{
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
                    }}
                  >
                    🚩 Submit Flag
                  </button>
                </div>
              ) : flagStatus === 'correct' ? (
                <div>
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
                  <h4 style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>
                    Flag Captured!
                  </h4>
                  <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '16px' }}>
                    Congratulations! You've solved the challenge!
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <code style={{ color: '#6ee7b7', fontFamily: 'monospace' }}>{challenge.data.flag}</code>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '24px' }}>
                    +{challenge.data.points} Points
                  </div>
                  <button
                    onClick={resetChallenge}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Try New Challenge
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '80px', marginBottom: '20px' }}>❌</div>
                  <h4 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' }}>
                    Incorrect Flag
                  </h4>
                  <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '16px' }}>
                    That's not quite right. Try again!
                  </p>
                  <div style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <code style={{ color: '#fca5a5', fontFamily: 'monospace' }}>{flagInput}</code>
                  </div>
                  <br />
                  <button
                    onClick={() => {
                      setFlagStatus(null);
                      setFlagInput('');
                    }}
                    style={{
                      padding: '12px 32px',
                      background: 'linear-gradient(to right, #9333ea, #ec4899)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(CTFGenerator));
