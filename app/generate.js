export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: "Backend is working!",
    challenge: {
      title: "Test CTF Challenge",
      description: "If you see this, your backend is alive.",
      flag: "FLAG{TEST_BACKEND}"
    }
  });
}
