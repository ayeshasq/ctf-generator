export default async function handler(req, res) {
  try {
    const { category, difficulty } = req.body;

    // Temporary dummy generator to avoid errors
    const challenge = {
      title: `Sample ${category} Challenge`,
      description: `This is a placeholder challenge for ${category} at ${difficulty} difficulty.`,
      hint: "This is a sample hint.",
      flag: "FLAG{sample_flag_123}"
    };

    res.status(200).json(challenge);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
