import Site from "../models/Site.js";
import Task from "../models/Task.js";

export const createSite = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id; // from protectRoute middleware

    if (!name) {
      return res.status(400).json({ message: "Site name is required" });
    }

    // Optional: check if the site already exists for this user
    const existingSite = await Site.findOne({ name, user: userId });
    if (existingSite) {
      return res.status(400).json({ message: "Site already exists" });
    }

    const newSite = await Site.create({
      name,
      user: userId,
    });

    res.status(201).json({ success: true, site: newSite });
  } catch (error) {
    console.log("Create site error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteSite = async (req, res) => {
  const userId = req.user._id;
  const { siteId } = req.params;

  try {
    const site = await Site.findOne({ _id: siteId, user: userId });

    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    const taskCount = await Task.countDocuments({ site: siteId });

    if (taskCount > 0) {
      return res.status(400).json({
        message: "Cannot delete site with existing tasks"
      });
    }

    await site.deleteOne();

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Delete site error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSites = async (req, res) => {
  const userId = req.user._id;

  try {
    const sites = await Site.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, sites });
  } catch (error) {
    console.log("Get sites error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
