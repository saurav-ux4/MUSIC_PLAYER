const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to get profile",
    });
  }
};

export { getMyProfile };