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

  async function generate() {
    setLoading(true);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);

    try {
      // API call
      const params = new URLSearchParams();
      if (selectedCategory !== 'random') params.append('category', selectedCategory);
      if (difficulty) params.append('difficulty', difficulty);

      const res = await fetch(`/api/generate?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setChallenge(data.challenge);
      } else {
        alert("Failed to generate challenge");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching challenge");
    }

    setLoading(false);
  }

  function submit() {
    if (attempts >= MAX_ATTEMPTS || !challenge) return;

    const isCorrect = flagInput.trim() === challenge.flag.trim();
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

  if (challenge && !challenge.flag) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 text-white p-5 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center py-10">
          <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
            AI CTF Challenge Generator
          </h1>
          <p className="text-lg text-gray-300">
            Generate unique hacking challenges in seconds
          </p>
        </div>

        {!challenge ? (
          <div className="bg-gray-800/60 rounded-2xl p-10 border border-purple-700/30">
            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="mb-4 text-purple-300 font-bold">Category</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-4 rounded-xl font-bold text-white ${selectedCategory === c.id ? 'bg-gradient-to-r from-purple-700 to-pink-500 border-2 border-white' : 'bg-gray-700/50 border-2 border-gray-600'}`}
                  >
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <h3 className="mb-4 text-purple-300 font-bold">Difficulty</h3>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 p-4 rounded-xl font-bold text-white ${difficulty === d ? 'bg-gradient-to-r from-green-500 to-blue-500 border-2 border-white' : 'bg-gray-700/50 border-2 border-gray-600'}`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className={`w-full p-5 text-lg font-bold rounded-xl ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-700 to-pink-500'} `}
            >
              {loading ? '⏳ Generating...' : '🎲 Generate Challenge'}
            </button>
          </div>
        ) : (
          <div>
            {/* Challenge Display */}
            <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-700/30 mb-6">
              <h2 className="text-3xl font-bold mb-4">{challenge.title}</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1 bg-purple-700/40 rounded-full text-xs">{challenge.category.toUpperCase()}</span>
                <span className="px-4 py-1 bg-blue-700/30 rounded-full text-xs">{challenge.difficulty.toUpperCase()}</span>
                <span className="px-4 py-1 bg-yellow-700/30 rounded-full text-xs">⚡ {challenge.points} pts</span>
              </div>
              <div className="bg-black/50 p-5 rounded-lg mb-4">
  <h4 className="text-purple-300 font-bold mb-2">📖 Scenario</h4>
  <p>{challenge.storyline}</p>
</div>

<div className="bg-black/50 p-5 rounded-lg mb-4">
  <h4 className="text-blue-400 font-bold mb-2">🎯 Mission Objectives</h4>
  <ul className="list-disc list-inside">
    {challenge.objectives.map((obj, i) => (
      <li key={i}>{obj}</li>
    ))}
  </ul>
</div>

<div className="bg-black/50 p-5 rounded-lg">
  <h4 className="text-green-400 font-bold mb-2">✅ Success Criteria</h4>
  Submit the correct flag in format:
  <code className="ml-2 px-2 py-1 bg-black rounded">
    {challenge.flag_format}
  </code>
</div>


            {/* Steps */}
            <div className="bg-gray-800/60 p-8 rounded-2xl mb-6">
              <h3 className="text-blue-400 font-bold mb-4">📋 Step-by-Step Guide</h3>
              {challenge.steps.map((s,i) => (
                <div key={i} className="p-3 mb-2 bg-blue-900/10 rounded-lg border-l-4 border-blue-500 font-mono text-sm">
                  {i+1}. {s}
                </div>
              ))}
            </div>

            {/* Artifact */}
<div className="bg-gray-800/60 p-8 rounded-2xl mb-6 border-2 border-pink-600/30">
  <h3 className="text-pink-400 font-bold mb-4">📦 Artifact</h3>

  {/* Support multiple artifacts if challenge.artifact is array */}
  {Array.isArray(challenge.artifact) ? challenge.artifact.map((a, i) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
      <div key={i} className="mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full p-3 rounded-lg text-left font-bold ${expanded ? 'bg-pink-600/30' : 'bg-gray-700/50'} border-2 border-pink-500`}
        >
          {expanded ? '📂 ' : '📁 '} Artifact {i+1}
        </button>

        {expanded && (
          <div className="mt-2 relative">
            <pre className="bg-black/90 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words">
              {a}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(a);
                alert('Copied to clipboard!');
              }}
              className="absolute top-2 right-2 px-3 py-1 text-xs rounded-lg bg-purple-700 hover:bg-purple-600"
            >
              📋 Copy
            </button>
          </div>
        )}
      </div>
    )
  }) : (
    <div className="relative">
      <pre className="bg-black/90 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words">
        {challenge.artifact}
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(challenge.artifact);
          alert('Copied to clipboard!');
        }}
        className="absolute top-2 right-2 px-3 py-1 text-xs rounded-lg bg-purple-700 hover:bg-purple-600"
      >
        📋 Copy
      </button>
    </div>
  )}
</div>

            {/* Hints */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="bg-gray-800/60 p-8 rounded-2xl mb-6">
                <h3 className="text-purple-300 font-bold mb-4">💡 Hints</h3>
                {challenge.hints.map((hint,i) => {
                  const show = revealedHints.includes(i);
                  return (
                    <div key={i} className="mb-3">
                      <button
                        onClick={() => toggleHint(i)}
                        className={`w-full p-3 rounded-lg font-bold text-white ${show ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-gray-700/50 border-2 border-gray-600'}`}
                      >
                        {show ? '🔓 ' : '🔒 '}Hint {i+1}
                      </button>
                      {show && (
                        <div className="p-3 mt-2 bg-blue-900/20 rounded-lg text-sm">
                          {hint}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Flag Submission */}
            <div className="bg-gray-800/80 p-10 rounded-2xl text-center">
              <h3 className="text-2xl mb-6">🚩 Capture The Flag</h3>

              {attempts >= MAX_ATTEMPTS && (
                <p className="text-red-500 font-bold mb-3">🚫 Maximum attempts reached. Challenge locked.</p>
              )}

              {flagStatus === null && attempts < MAX_ATTEMPTS ? (
                <div className="max-w-md mx-auto">
                  <p className="mb-3 text-gray-300">Attempts left: {MAX_ATTEMPTS - attempts} / {MAX_ATTEMPTS}</p>
                  <input
                    type="text"
                    value={flagInput}
                    disabled={attempts >= MAX_ATTEMPTS}
                    onChange={e => setFlagInput(e.target.value)}
                    onKeyDown={e => { if(e.key==='Enter') submit() }}
                    placeholder="CTF{...}"
                    className="w-full p-3 rounded-lg border-2 border-purple-700/50 bg-black/70 text-white mb-4"
                  />
                  <button
                    onClick={submit}
                    disabled={!flagInput.trim()}
                    className={`w-full p-3 rounded-lg font-bold text-white ${flagInput.trim() ? 'bg-gradient-to-r from-purple-700 to-pink-500' : 'bg-gray-600 cursor-not-allowed'}`}
                  >
                    🚩 Submit
                  </button>
                </div>
              ) : flagStatus === 'correct' ? (
                <div>
                  <div className="text-6xl">✅</div>
                  <h4 className="text-3xl text-green-500 mb-3">Flag Captured!</h4>
                  <p className="mb-3">You solved it!</p>
                  <code className="p-3 bg-green-500/20 rounded-lg inline-block mb-3">{challenge.flag}</code>
                  <div className="text-2xl text-yellow-400 mb-6">+{challenge.points} Points</div>
                  <button onClick={reset} className="px-5 py-3 rounded-lg bg-gradient-to-r from-purple-700 to-pink-500 font-bold">🎲 New Challenge</button>
                </div>
              ) : (
                <div>
                  <div className="text-6xl">❌</div>
                  <h4 className="text-3xl text-red-500 mb-3">Incorrect</h4>
                  <p className="mb-3">Try again!</p>
                  <code className="p-3 bg-red-500/20 rounded-lg inline-block mb-3">{flagInput}</code>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => { setFlagStatus(null); setFlagInput(''); }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-pink-500 font-bold">🔄 Try Again</button>
                    {attempts < MAX_ATTEMPTS && <button onClick={reset} className="px-4 py-2 rounded-lg border-2 border-gray-600 text-white font-bold">↩️ Back to Menu</button>}
                  </div>
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
