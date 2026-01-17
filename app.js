const { useState, useEffect } = React;

// ArtifactItem component
function ArtifactItem({ artifact }) {
  const [expanded, setExpanded] = useState(false);

  const downloadFile = () => {
    const element = document.createElement("a");
    const file = new Blob([artifact.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = artifact.name;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-3 rounded-lg text-left font-bold ${
          expanded ? "bg-pink-600/30" : "bg-gray-700/50"
        } border-2 border-pink-500`}
      >
        {expanded ? "📂 " : "📁 "} {artifact.name}
      </button>
      {expanded && (
        <div className="mt-2 relative">
          <pre className="bg-black/90 p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words">
            {artifact.content}
          </pre>
          <div className="flex gap-2 mt-2">
            <button
              onClick={downloadFile}
              className="px-3 py-1 text-xs rounded-lg bg-purple-700 hover:bg-purple-600"
            >
              📥 Download
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(artifact.content);
                alert("Copied to clipboard!");
              }}
              className="px-3 py-1 text-xs rounded-lg bg-purple-700 hover:bg-purple-600"
            >
              📋 Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main CTF Generator
function CTFGenerator() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("random");
  const [difficulty, setDifficulty] = useState("medium");
  const [flagInput, setFlagInput] = useState("");
  const [flagStatus, setFlagStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [revealedHints, setRevealedHints] = useState([]);
  const [tab, setTab] = useState("description");
  const [totalPoints, setTotalPoints] = useState(0);

  const MAX_ATTEMPTS = 3;

  // Load total points from localStorage
  useEffect(() => {
    const stored = parseInt(localStorage.getItem("totalPoints")) || 0;
    setTotalPoints(stored);
  }, []);

  const categories = [
    { id: "random", name: "Random", emoji: "🎲" },
    { id: "web", name: "Web Exploitation", emoji: "🕷️" },
    { id: "forensics", name: "Forensics", emoji: "🔍" },
    { id: "crypto", name: "Cryptography", emoji: "🔐" },
    { id: "network", name: "Network Analysis", emoji: "🌐" },
    { id: "osint", name: "OSINT", emoji: "🧠" },
  ];

  async function generate() {
    setLoading(true);
    setFlagInput("");
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);
    setTab("description");

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "random") params.append("category", selectedCategory);
      if (difficulty) params.append("difficulty", difficulty);

      const res = await fetch(`/api/generate?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        const ch = data.challenge;
        ch.objectives = ch.objectives || ["Analyze the scenario and capture the flag"];
        ch.flag_format = ch.flag_format || "CTF{...}";
        ch.steps =
          ch.steps ||
          ["Step 1: Examine the artifact", "Step 2: Analyze the data", "Step 3: Capture the flag"];
        ch.artifact =
          ch.artifact?.map(a => (typeof a === "string" ? { name: "artifact.txt", content: a } : a)) ||
          [{ name: "artifact.txt", content: "No artifact provided" }];
        ch.hints = ch.hints || [];
        ch.learning = ch.learning || {
          attack: "Example Attack",
          explanation: "Learning summary placeholder.",
          mitigation: ["Mitigation 1", "Mitigation 2"],
          mitre: ["TXXXX"],
        };
        setChallenge(ch);
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

    const isCorrect = flagInput.trim() === challenge.flag?.trim();
    setAttempts(prev => prev + 1);
    setFlagStatus(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      const newTotal = totalPoints + (challenge.points || 0);
      setTotalPoints(newTotal);
      localStorage.setItem("totalPoints", newTotal);
    }
  }

  function resetChallenge() {
    setChallenge(null);
    setFlagInput("");
    setFlagStatus(null);
    setAttempts(0);
    setRevealedHints([]);
  }

  function home() {
    resetChallenge();
    setTab("description");
  }

  function toggleHint(i) {
    if (revealedHints.includes(i)) {
      setRevealedHints(revealedHints.filter(x => x !== i));
    } else if (i < attempts) {
      setRevealedHints([...revealedHints, i]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 text-white p-5 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header / Navbar */}
        <div className="flex justify-between items-center py-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400">
            AI CTF Lab
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold">Total Points: {totalPoints}</span>
            <button
              onClick={home}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-700 to-pink-500 font-bold"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {!challenge ? (
          <div className="bg-gray-800/60 rounded-2xl p-10 border border-purple-700/30">
            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="mb-4 text-purple-300 font-bold">Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-4 rounded-xl font-bold text-white ${
                      selectedCategory === c.id
                        ? "bg-gradient-to-r from-purple-700 to-pink-500 border-2 border-white"
                        : "bg-gray-700/50 border-2 border-gray-600"
                    }`}
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
                {["easy", "medium", "hard"].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 p-4 rounded-xl font-bold text-white ${
                      difficulty === d
                        ? "bg-gradient-to-r from-green-500 to-blue-500 border-2 border-white"
                        : "bg-gray-700/50 border-2 border-gray-600"
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className={`w-full p-5 text-lg font-bold rounded-xl ${
                loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-purple-700 to-pink-500"
              }`}
            >
              {loading ? "⏳ Generating..." : "🎲 Generate Challenge"}
            </button>
          </div>
        ) : (
          <div>
            {/* Challenge Tabs */}
            <div className="mb-4 flex gap-3 flex-wrap">
              {["description", "steps", "artifacts", "hints", "submit"].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg font-bold ${
                    tab === t ? "bg-gradient-to-r from-purple-700 to-pink-500" : "bg-gray-700/50"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {tab === "description" && (
              <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-700/30 mb-6">
                <h2 className="text-3xl font-bold mb-4">{challenge.title}</h2>
                <p className="mb-4">{challenge.storyline}</p>
                <h4 className="text-blue-400 font-bold mb-2">🎯 Mission Objectives</h4>
                <ul className="list-disc list-inside">
                  {challenge.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "steps" && (
              <div className="bg-gray-800/60 p-8 rounded-2xl mb-6">
                <h3 className="text-blue-400 font-bold mb-4">📋 Investigation Checklist</h3>
                {challenge.steps.map((step, i) => (
                  <label key={i} className="f
