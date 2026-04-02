const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'mbktechnologies8@gmail.com',
    pass: 'doswdcnaynncomuy'
  }
});

async function runTests() {
  // Verify SMTP connection first
  try {
    await transporter.verify();
    console.log('✅ SMTP Connected Successfully!');
  } catch (err) {
    console.error('❌ SMTP Connection FAILED:', err.message);
    process.exit(1);
  }

  const tests = [
    {
      label: 'Registration Notification (Owner)',
      mail: {
        from: '"MBK Technology" <mbktechnologies8@gmail.com>',
        to: 'mbktechnologies8@gmail.com',
        subject: 'TEST - New Registration: John Doe',
        html: '<h3>Test Registration Email</h3><p><b>Name:</b> John Doe</p><p><b>Phone:</b> 9876543210</p><p><b>Course:</b> Industry 4.0</p><p><b>Mode:</b> Offline</p>'
      }
    },
    {
      label: 'Registration Auto-Reply (Student receives)',
      mail: {
        from: '"MBK Technology" <mbktechnologies8@gmail.com>',
        to: 'mbktechnologies8@gmail.com',
        subject: 'TEST - Registration Confirmed - MBK Technology',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          <div style="background:#0f172a;padding:20px;text-align:center">
            <img src="https://i.ibb.co/4wmJCKRq/training.png" alt="MBK Logo" style="height:50px">
          </div>
          <div style="padding:30px">
            <h2 style="color:#1e293b">Registration Confirmed!</h2>
            <p style="color:#475569;font-size:16px">Dear John Doe,</p>
            <p style="color:#475569;font-size:16px">Thank you for registering for <strong>Industry 4.0</strong> at MBK Technology.</p>
            <p style="color:#64748b;font-size:14px">Call: <a href="https://wa.me/918807653965" style="color:#f97316">+91 88076 53965</a></p>
          </div>
          <div style="background:#f8fafc;padding:15px;text-align:center;border-top:1px solid #e5e7eb">
            <p style="color:#94a3b8;font-size:12px;margin:0">&copy; 2025 MBK Technology Salem</p>
          </div>
        </div>`
      }
    },
    {
      label: 'Contact Form Notification (Owner)',
      mail: {
        from: '"MBK Technology Website" <mbktechnologies8@gmail.com>',
        to: 'mbktechnologies8@gmail.com',
        subject: 'TEST - New Contact Form: Jane Smith',
        html: '<h3>Test Contact Form</h3><p><b>Name:</b> Jane Smith</p><p><b>Phone:</b> 9876543210</p><p><b>Interest:</b> EV Training</p><p><b>Message:</b> I want to know more about your EV course.</p>'
      }
    },
    {
      label: 'Contact Auto-Reply (User receives)',
      mail: {
        from: '"MBK Technology" <mbktechnologies8@gmail.com>',
        to: 'mbktechnologies8@gmail.com',
        subject: 'TEST - We Received Your Message - MBK Technology',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          <div style="background:#0f172a;padding:20px;text-align:center">
            <img src="https://i.ibb.co/4wmJCKRq/training.png" alt="MBK Logo" style="height:50px">
          </div>
          <div style="padding:30px">
            <h2 style="color:#1e293b">Thank You for Reaching Out!</h2>
            <p style="color:#475569">Hi Jane Smith, we have received your inquiry about <strong>EV Training</strong>. We will respond within 24 hours.</p>
            <a href="https://wa.me/918807653965" style="display:inline-block;background:#25d366;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;font-weight:bold">Message on WhatsApp</a>
          </div>
          <div style="background:#f8fafc;padding:15px;text-align:center;border-top:1px solid #e5e7eb">
            <p style="color:#94a3b8;font-size:12px;margin:0">&copy; 2025 MBK Technology Salem</p>
          </div>
        </div>`
      }
    }
  ];

  for (const test of tests) {
    try {
      const info = await transporter.sendMail(test.mail);
      console.log(`✅ ${test.label}: SENT - ${info.response}`);
    } catch (err) {
      console.error(`❌ ${test.label}: FAILED - ${err.message}`);
    }
  }

  console.log('\n✅ Email test complete. Check mbktechnologies8@gmail.com inbox for all 4 test emails.');
}

runTests();
