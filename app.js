import React, { useState } from 'react';
import { Shield, Brain, Bug, Network, Eye, Download, Copy, Check, Sparkles, Lock, FileText, Zap, Flag, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function CTFGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [difficulty, setDifficulty] = useState('medium');
  const [copied, setCopied] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [flagStatus, setFlagStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(0);
  const [solving, setSolving] = useState(false);

  const categories = [
    { id: 'random', name: 'Random', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
    { id: 'web', name: 'Web Exploitation', icon: Bug, color: 'from-blue-500 to-cyan-500' },
    { id: 'forensics', name: 'Forensics', icon: Eye, color: 'from-green-500 to-emerald-500' },
    { id: 'crypto', name: 'Cryptography', icon: Lock, color: 'from-yellow-500 to-orange-500' },
    { id: 'network', name: 'Network Analysis', icon: Network, color: 'from-red-500 to-pink-500' },
    { id: 'osint', name: 'OSINT', icon: Brain, color: 'from-indigo-500 to-purple-500' }
  ];

  const generateChallenge = async () => {
    setLoading(true);
    setCopied(false);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setShowHint(0);

    const categoryType = selectedCategory === 'random' 
      ? categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id 
      : selectedCategory;

    const prompts = {
      web: `Create a unique ${difficulty} difficulty web exploitation CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence engaging storyline",
  "description": "Detailed challenge description explaining the scenario and what to find",
  "vulnerability": "Type of vulnerability",
  "flag": "CTF{...}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"],
  "files": "Description of files/code needed",
  "solution_steps": ["step1", "step2", "step3"]
}`,
      
      forensics: `Create a unique ${difficulty} difficulty forensics CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence compelling storyline",
  "description": "Detailed scenario description",
  "type": "Type of forensics",
  "flag": "CTF{...}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"],
  "files": "Description of files to analyze",
  "solution_steps": ["step1", "step2", "step3"]
}`,
      
      crypto: `Create a unique ${difficulty} difficulty cryptography CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence intriguing storyline",
  "description": "Detailed problem description",
  "cipher_type": "Type of cipher",
  "encrypted_message": "The encrypted text",
  "flag": "CTF{...}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"],
  "solution_steps": ["step1", "step2", "step3"]
}`,
      
      network: `Create a unique ${difficulty} difficulty network analysis CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence realistic storyline",
  "description": "Detailed description of network traffic scenario",
  "scenario": "Network scenario type",
  "flag": "CTF{...}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"],
  "files": "Description of network capture",
  "solution_steps": ["step1", "step2", "step3"]
}`,
      
      osint: `Create a unique ${difficulty} difficulty OSINT CTF challenge. Return ONLY a JSON object with this EXACT structure (no markdown, no extra text):
{
  "title": "Challenge title",
  "storyline": "2-3 sentence investigative storyline",
  "description": "Detailed mission description",
  "target": "What to investigate",
  "flag": "CTF{...}",
  "points": 100,
  "hints": ["hint1", "hint2", "hint3"],
  "starting_info": "Initial clues",
  "solution_steps": ["step1", "step2", "step3"]
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
    
    setSolving(true);
    setAttempts(prev => prev + 1);
    
    setTimeout(() => {
      if (flagInput.trim() === challenge.data.flag.trim()) {
        setFlagStatus('correct');
      } else {
        setFlagStatus('incorrect');
      }
      setSolving(false);
    }, 800);
  };

  const resetChallenge = () => {
    setChallenge(null);
    setFlagInput('');
    setFlagStatus(null);
    setAttempts(0);
    setShowHint(0);
  };

  const copyToClipboard = () => {
    if (challenge) {
      navigator.clipboard.writeText(JSON.stringify(challenge.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadChallenge = () => {
    if (challenge) {
      const blob = new Blob([JSON.stringify(challenge.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ctf-${challenge.category}-${challenge.difficulty}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const CategoryIcon = categories.find(c => c.id === selectedCategory)?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-purple-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            AI CTF Challenge Generator
          </h1>
          <p className="text-xl text-gray-300">Generate unique hacking challenges in 30 seconds</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>Powered by Claude Sonnet 4</span>
          </div>
        </div>

        {!challenge && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-purple-500/20">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  Challenge Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedCategory === cat.id
                            ? `bg-gradient-to-r ${cat.color} border-white shadow-lg scale-105`
                            : 'bg-gray-700/50 border-gray-600 hover:border-purple-400'
                        }`}
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">{cat.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3 text-purple-300">
                  Difficulty Level
                </label>
                <div className="space-y-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 border-white shadow-lg'
                          : 'bg-gray-700/50 border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold capitalize">{level}</span>
                        <span className="text-sm">
                          {level === 'easy' ? '100 pts' : level === 'medium' ? '250 pts' : '500 pts'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateChallenge}
              disabled={loading}
              className="w-full mt-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Challenge...
                </>
              ) : (
                <>
                  <CategoryIcon className="w-6 h-6" />
                  Generate {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Challenge
                </>
              )}
            </button>
          </div>
        )}

        {challenge && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      categories.find(c => c.id === challenge.category)?.color || 'from-purple-500 to-pink-500'
                    }`}>
                      {React.createElement(categories.find(c => c.id === challenge.category)?.icon || Sparkles, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{challenge.data.title}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm px-3 py-1 bg-purple-500/30 rounded-full">
                          {challenge.category.toUpperCase()}
                        </span>
                        <span className="text-sm px-3 py-1 bg-blue-500/30 rounded-full">
                          {challenge.difficulty.toUpperCase()}
                        </span>
                        <span className="text-sm px-3 py-1 bg-yellow-500/30 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {challenge.data.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-purple-600/50 hover:bg-purple-600 rounded-lg transition-all"
                    title="Copy challenge"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={downloadChallenge}
                    className="p-2 bg-pink-600/50 hover:bg-pink-600 rounded-lg transition-all"
                    title="Download challenge"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 mb-3">
                <p className="text-gray-300 italic">{challenge.data.storyline}</p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4">
                <p className="text-gray-200 leading-relaxed">{challenge.data.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Challenge Files/Info
                </h3>
                <div className="bg-gray-900/70 rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {challenge.data.files || challenge.data.starting_info || challenge.data.encrypted_message || 'Check the description above'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Your Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-900/70 rounded-lg p-3">
                    <span className="text-gray-400">Attempts:</span>
                    <span className="font-bold text-xl">{attempts}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-900/70 rounded-lg p-3">
                    <span className="text-gray-400">Hints Used:</span>
                    <span className="font-bold text-xl">{showHint}/3</span>
                  </div>
                  {flagStatus === 'correct' && (
                    <div className="flex justify-between items-center bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                      <span className="text-green-400">Points Earned:</span>
                      <span className="font-bold text-xl text-green-400">+{challenge.data.points}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Hints
              </h3>
              <div className="space-y-3">
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    {showHint > index ? (
                      <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 animate-fadeIn">
                        <p className="text-blue-300">
                          <span className="font-bold">Hint {index + 1}:</span> {challenge.data.hints[index]}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowHint(index + 1)}
                        disabled={showHint !== index}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          showHint === index
                            ? 'bg-gray-700/50 border-purple-500 hover:bg-gray-700 cursor-pointer'
                            : 'bg-gray-900/30 border-gray-700 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <span className="font-semibold">🔒 Unlock Hint {index + 1}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/30 backdrop-blur-lg rounded-2xl p-8 border-2 border-purple-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Flag className="w-8 h-8 text-pink-400" />
                <h3 className="font-bold text-2xl">Capture The Flag</h3>
              </div>

              {flagStatus === null ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && submitFlag()}
                      placeholder="Enter flag (e.g., CTF{...})"
                      disabled={solving}
                      className="w-full px-6 py-4 bg-gray-900/70 border-2 border-purple-500/50 rounded-xl text-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all placeholder-gray-500"
                    />
                    {solving && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader className="w-6 h-6 animate-spin text-purple-400" />
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={submitFlag}
                    disabled={!flagInput.trim() || solving}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {solving ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Flag className="w-5 h-5" />
                        Submit Flag
                      </>
                    )}
                  </button>
                </div>
              ) : flagStatus === 'correct' ? (
                <div className="text-center space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full border-4 border-green-500 mb-4">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-green-400 mb-2">🎉 Flag Captured!</h4>
                    <p className="text-xl text-gray-300">Congratulations! You've solved the challenge!</p>
                    <div className="mt-4 inline-block px-6 py-3 bg-green-500/20 border border-green-500/50 rounded-xl">
                      <p className="text-green-300 font-mono">{challenge.data.flag}</p>
                    </div>
                    <div className="mt-4 text-2xl font-bold text-yellow-400">
                      +{challenge.data.points} Points
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={resetChallenge}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition-all"
                    >
                      Try New Challenge
                    </button>
                    <button
                      onClick={() => setFlagStatus(null)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                    >
                      View Solution
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 animate-fadeIn">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full border-4 border-red-500 mb-4">
                    <XCircle className="w-12 h-12 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-red-400 mb-2">❌ Incorrect Flag</h4>
                    <p className="text-xl text-gray-300">That's not quite right. Try again!</p>
                    <div className="mt-4 inline-block px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-xl">
                      <p className="text-red-300 font-mono">{flagInput}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFlagStatus(null);
                      setFlagInput('');
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {flagStatus === 'correct' && (
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 animate-fadeIn">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Solution Walkthrough
                </h3>
                <div className="space-y-3">
                  {challenge.data.solution_steps.map((step, index) => (
                    <div key={index} className="bg-gray-900/70 rounded-lg p-4 flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                        <span className="font-bold text-green-400">{index + 1}</span>
                      </div>
                      <p className="text-gray-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!challenge && !loading && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 rounded-xl border border-blue-500/30">
              <Zap className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Instant Generation</h3>
              <p className="text-sm text-gray-300">AI creates complete challenges in under 30 seconds</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-xl border border-purple-500/30">
              <Flag className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Interactive Solving</h3>
              <p className="text-sm text-gray-300">Submit flags and get instant validation with hints</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-6 rounded-xl border border-green-500/30">
              <Brain className="w-10 h-10 text-green-400 mb-3" />
              <h3 className="font-bold text-lg mb-2">Always Unique</h3>
              <p className="text-sm text-
