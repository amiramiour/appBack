const { User } = require("../models");

exports.subscribe = async (userId, type) => {
  const user = await User.findByPk(userId);

  if (!user) throw new Error("User introuvable");

  user.isPremium = true;
  user.subscriptionType = type;

  await user.save();

  return user;
};