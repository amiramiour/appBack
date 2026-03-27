const subscriptionService = require("../services/subscription.service");

exports.subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Type requis" });
    }

    const user = await subscriptionService.subscribe(userId, type);

    res.json({
      message: "Abonnement activé",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};