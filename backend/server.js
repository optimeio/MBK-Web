require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');

const path = require('path');
const fs = require('fs');

const app = express();
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Configure allowed origins. Add additional origins via ENV if needed.
const allowedOrigins = [
  'https://mbktechnologies.info',
  'https://website.mbktechnologies.info',
  'https://mbk-web-1.onrender.com',
  process.env.FRONTEND_URL, // optional
  process.env.RENDER_URL, // optional (e.g. https://mbk-web-1.onrender.com)
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve static files from the React frontend app if present
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  console.log('Serving frontend from', frontendDist);
} else {
  console.warn('Frontend dist folder not found at', frontendDist);
}


// Connect to MongoDB
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err));
// Course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  image: String,
  price: String,
  duration: String,
  description: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});
const Course = mongoose.model('Course', courseSchema);

// Registration Schema
const registrationSchema = new mongoose.Schema({
  studentName: String,
  phone: String,
  email: String,
  qualification: String,
  timing: String,
  mode: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  createdAt: { type: Date, default: Date.now }
});
const Registration = mongoose.model('Registration', registrationSchema);

// Contact Message Schema
const messageSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  interest: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Public Routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Active' });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const nodemailer = require('nodemailer');

// Setup Nodemailer transporter (SMTP - works on Render/cloud hosts)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER || 'mbktechnologies8@gmail.com',
    pass: process.env.MAIL_PASS || 'doswdcnaynncomuy'
  }
});

// Test SMTP connection on startup
transporter.verify((err, success) => {
  if (err) console.error('SMTP Connection Error:', err.message);
  else console.log('SMTP Ready: Emails will send correctly.');
});

app.post('/api/register', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    await newReg.save();

    // Fetch course title if courseId exists
    let courseName = 'General Info';
    if (req.body.courseId) {
      const course = await Course.findById(req.body.courseId);
      if (course) courseName = course.title;
    }

    // Send Notification to MBK owner
    const mailOptions = {
      from: '"MBK Technology" <mbktechnologies8@gmail.com>',
      to: 'mbktechnologies8@gmail.com',
      subject: `New Course Registration: ${req.body.studentName}`,
      html: `
        <h3>New Registration Received</h3>
        <p><strong>Name:</strong> ${req.body.studentName}</p>
        <p><strong>Phone:</strong> ${req.body.phone}</p>
        <p><strong>Email:</strong> ${req.body.email}</p>
        <p><strong>Course:</strong> ${courseName}</p>
        <p><strong>Qualification:</strong> ${req.body.qualification || 'N/A'}</p>
        <p><strong>Timing:</strong> ${req.body.timing || 'N/A'}</p>
        <p><strong>Mode:</strong> ${req.body.mode || 'Offline'}</p>
      `
    };

    // Auto-Reply to Student
    const autoReplyOptions = {
      from: '"MBK Technology" <mbktechnologies8@gmail.com>',
      to: req.body.email,
      subject: `Registration Confirmed - MBK Technology`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                    <img src="https://i.ibb.co/4wmJCKRq/training.png" alt="MBK Technology Logo" style="height: 50px;">
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Registration Confirmed!</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Dear ${req.body.studentName},</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for registering for the <strong>${courseName}</strong> program at MBK Technology. We have successfully received your details.</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Our admissions team will contact you shortly at <strong>${req.body.phone}</strong> to guide you through the next steps and batch schedule.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 5px;">Need immediate assistance?</p>
                    <p style="color: #64748b; font-size: 14px; margin-top: 0;">Call or WhatsApp us at: <a href="https://wa.me/918807653965" style="color: #f97316; text-decoration: none;">+91 88076 53965</a></p>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} MBK Technology Salem. All rights reserved.</p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (err) => { if (err) console.error('Nodemailer Error:', err); });
    transporter.sendMail(autoReplyOptions, (err) => { if (err) console.error('AutoReply Error:', err); });

    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    // Send Notification to MBK owner
    const mailOptions = {
      from: '"MBK Technology Website" <mbktechnologies8@gmail.com>',
      to: 'mbktechnologies8@gmail.com',
      subject: `New Contact Form Submission: ${req.body.name}`,
      html: `
          <h3>New Message Received</h3>
          <p><strong>Name:</strong> ${req.body.name}</p>
          <p><strong>Phone:</strong> ${req.body.phone}</p>
          <p><strong>Email:</strong> ${req.body.email}</p>
          <p><strong>Interested In:</strong> ${req.body.interest}</p>
          <p><strong>Message:</strong> ${req.body.message}</p>
        `
    };

    // Auto-Reply to User
    const autoReplyOptions = {
      from: '"MBK Technology" <mbktechnologies8@gmail.com>',
      to: req.body.email,
      subject: `We've Received Your Message - MBK Technology`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                    <img src="https://i.ibb.co/4wmJCKRq/training.png" alt="MBK Technology Logo" style="height: 50px;">
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Thank You for Reaching Out!</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi ${req.body.name},</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">This is an automated confirmation that we have received your inquiry regarding <strong>${req.body.interest}</strong>.</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Our team reviews all messages and will respond to you securely within 24 hours. For urgent requirements, please feel free to reach us directly on WhatsApp.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                    <a href="https://wa.me/918807653965" style="display: inline-block; background-color: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Message on WhatsApp</a>
                </div>
                <div style="background-color: #f8fafc; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} MBK Technology Salem. All rights reserved.</p>
                </div>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (err) => { if (err) console.error('Contact Nodemailer Error:', err); });
    transporter.sendMail(autoReplyOptions, (err) => { if (err) console.error('Contact AutoReply Error:', err); });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Routes
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.json({ token: process.env.ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/admin/course', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/course/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/course/:id', async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { status: 'Inactive' });
    res.json({ message: 'Course disabled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().populate('courseId');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/overview', async (req, res) => {
  try {
    const coursesCount = await Course.countDocuments({ status: 'Active' });
    const registrationsCount = await Registration.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrationsCount = await Registration.countDocuments({ createdAt: { $gte: today } });
    const recentRegistrations = await Registration.find().sort({ createdAt: -1 }).limit(5).populate('courseId');
    const messagesCount = await Message.countDocuments();
    res.json({ coursesCount, registrationsCount, todayRegistrationsCount, recentRegistrations, messagesCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simple Root Route for API Health Check
app.get('/health', (req, res) => {
  res.send('MBK Technology Backend API is running gracefully.');
});

// Serve React's index.html for non-API GET requests to support client-side routing.
// If frontend build exists, serve index.html for client-side routes.
if (fs.existsSync(frontendDist)) {
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback for API-only deployments
  app.get(/^\/(?!api).*/, (req, res) => {
    res.send('MBK Technology Backend is running. Frontend not served from this instance.');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
