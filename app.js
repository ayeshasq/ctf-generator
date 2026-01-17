const { useState, useEffect } = React;

const API_URL = "/api/generate";

function App() {
  const [challenge, setChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState("");
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [view, setView] = useState("home");

  /* 🔒 Load saved progress */
  useEffect(() => {
    const savedPoints = localStorage.getItem("ctf_points");
    const savedChallenge = localStorage.getItem("ctf_challenge");
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedChallenge) {
      setChallenge(JSON.parse(savedChallenge));
      setView("challenge");
    }
  }, []);

  /* 💾 Persist progress */
  useEffect(() => {
    localStorage.setItem("ctf_points", points);
    if (challenge)
      localStorage.setItem("ctf_challenge", JSON.stringify(challenge));
  }, [points, challenge]);

  async function generateChallenge(level) {
    const res = await fetch(`${API_URL}?difficulty=${level}`);
    const data = await res.json();
    setChallenge(data.challenge);
    setView("challenge");
    setMessage("");
    setFlagInput("");
  }

  function submitFlag() {
    if (flagInput.trim() === challenge.flag) {
      setPoints(points + challenge.points);
      setMessage("✅ Correct flag! Points awarded.");
      localStorage.removeItem("ctf_challenge");
    } else {
      setMessage("❌ Incorrect flag. Try again.");
    }
  }

  if (view === "home") {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8">
        <h1 className="text-4xl font-bold mb-6">🛡️ AI CTF Generator</h1>
        <p className="mb-4">Total Points: {points}</p>

        <div className="space-y-4">
          <button onClick={() => generateChallenge("easy")} className="btn">
            🟢 Easy Challenge
          </button>
          <button onClick={() => generateChallenge("medium")} className="btn">
            🟡 Medium Challenge
          </button>
          <button onClick={() => generateChallenge("hard")} className="btn">
            🔴 Hard Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8">
      <button onClick={() => setView("home")} className="mb-4 underline">
        ⬅ Home
      </button>

      <h2 className="text-3xl font-bold">{challenge.title}</h2>
      <p className="italic mb-4">{challenge.storyline}</p>

      <div className="bg-gray-900 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">📦 Artifact Provided</h3>
        <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
          {challenge.artifact.content}
        </pre>
        {challenge.artifact.download && (
          <a
            href={challenge.artifact.download}
            download
            className="underline mt-2 inline-block"
          >
            ⬇ Download Artifact
          </a>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-bold">🎯 Mission</h3>
        <p>{challenge.mission}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-bold">💡 Hints</h3>
        <ul className="list-disc ml-5">
          {challenge.hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      <input
        className="w-full p-2 text-black"
        placeholder="CTF{...}"
        value={flagInput}
        onChange={(e) => setFlagInput(e.target.value)}
      />

      <button onClick={submitFlag} className="btn mt-4">
        🚩 Submit Flag
      </button>

      {message && <p className="mt-4">{message}</p>}

      {message.startsWith("✅") && (
        <div className="mt-4 bg-gray-800 p-4 rounded">
          <h3 className="font-bold">🧠 Learning Summary</h3>
          <p>{challenge.learning.explanation}</p>
          <p className="mt-2">
            <strong>MITRE:</strong> {challenge.learning.mitre.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

/* Tailwind helper */
const style = document.createElement("style");
style.innerHTML = `
  .btn {
    background: #16a34a;
    color: black;
    padding: 12px;
    border-radius: 6px;
    width: 100%;
    font-weight: bold;
  }
`;
document.head.appendChild(style);
