import Task from "../models/Task.js";
import Site from "../models/Site.js"
import sendEmail from "../configs/nodemailer.js";


export const createTask = async (req, res) => {
  const userId = req.user._id;

  try {
    const { title, priority, dueAt, siteId, newSiteName } = req.body;

    // ✅ Only title is mandatory
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let site;

    // ✅ Existing site selected
    if (siteId) {
      site = await Site.findOne({ _id: siteId, user: userId });

      if (!site) {
        return res.status(403).json({ message: "You do not have access to this site" });
      }
    }

    // ✅ New site typed
    else if (newSiteName) {
      site = await Site.create({
        name: newSiteName.trim(),
        user: userId,
      });
    }

    
    else {
      return res.status(400).json({ message: "Site is required" });
    }
    
    const task = await Task.create({
      title,
      priority,
      dueAt,
      site: site._id,
      user: userId,
    });

    // ✅ Send email immediately after creating task
    if (req.user.email) {
      const dueTime = dueAt ? new Date(dueAt).toLocaleString() : "No due time set";
      const body = `
        <h2>New Task Created</h2>
        <p>Hello <strong>${req.user.username}</strong>,</p>
        <p>Your new task "<strong>${title}</strong>" has been created.</p>
        <p>Priority: <strong>${priority || "medium"}</strong></p>
        <p>Due At: <strong>${dueTime}</strong></p>
      `;

      try {
        await sendEmail({
          to: req.user.email,
          subject: `Task Created: ${title}`,
          body,
        });
        console.log(`✅ Task email sent to ${req.user.email}`);
      } catch (err) {
        console.error("❌ Failed to send task email:", err);
      }
    }

    return res.status(201).json({ success: true, task });

  } catch (error) {
    console.log("Create task error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateTask = async (req, res) => {
  const userId = req.user._id;
  const { taskId } = req.params;
  const { title, priority, dueAt, siteName, completed, status } = req.body;

  try {
    // 1️⃣ Find the task
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2️⃣ Handle site
    if (siteName) {
      // Check if site already exists for this user
      let site = await Site.findOne({ name: siteName, user: userId });

      if (!site) {
        // Create new site if it doesn't exist
        site = await Site.create({ name: siteName, user: userId });
      }
// Update the task’s `site` field to point to the ID of the site.
// `task.site` stores only the ObjectId of the Site document, not the full site info.
      task.site = site._id;
    }

    // 3️⃣ Update other fields if provided
    if (title !== undefined) task.title = title;
    if (priority !== undefined) task.priority = priority;
    if (dueAt !== undefined) task.dueAt = dueAt;
    if (completed !== undefined) task.completed = completed;
    if (status !== undefined) task.status = status;

    // 4️⃣ Save task
    await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    console.log("Update task error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//get all task
export const getTask = async (req, res) => {
  const userId = req.user._id;

  try {
    const tasks = await Task.find({ user: userId }).populate("site");

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log("Get task error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete task

export const deleteTask = async (req, res) => {
  const userId = req.user._id;
  const { taskId } = req.params; 

  try {
    
    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.deleteOne({ _id: taskId });

    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.log("Delete task error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
