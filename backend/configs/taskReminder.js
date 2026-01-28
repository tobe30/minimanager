import cron from 'node-cron';
import Task from '../models/Task.js';
import sendEmail from '../configs/nodemailer.js';

// Schedule every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('📧 Running task email job...');

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Find tasks due today
    const tasks = await Task.find({
      dueAt: { $gte: todayStart, $lte: todayEnd }
    }).populate('user');

    console.log(`🔎 Found ${tasks.length} tasks due today`);

    for (const task of tasks) {
      if (!task.user?.email) continue;

      const body = `
        <h2>Task Reminder</h2>
        <p>Hello <strong>${task.user.username}</strong>,</p>
        <p>Your task "<strong>${task.title}</strong>" is due today at ${task.dueAt.toLocaleTimeString()}.</p>
        <p>Please make sure to complete it.</p>
      `;

      try {
        await sendEmail({
          to: task.user.email,
          subject: `Reminder: Task "${task.title}" is due today`,
          body,
        });
        console.log(`✅ Email sent to ${task.user.email}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${task.user.email}:`, err);
      }
    }

  } catch (err) {
    console.error("❌ Error in task reminder cron:", err);
  }
});
