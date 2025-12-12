export default function handler(req, res) {
  res.status(200).json({
    title: "Sample CTF Challenge",
    description: "If you see this, your backend is working!",
    flag: "FLAG{backend_ok}"
  });
}
