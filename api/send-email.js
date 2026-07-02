import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { message } = req.body;
  const isMessageEmpty = !message || message.trim() === '';

  // Nodemailer Transporter configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject = isMessageEmpty 
    ? 'Nikita Saw Your Birthday Website! 👀' 
    : 'New Message from Nikita! 💌';

  const htmlContent = isMessageEmpty
    ? `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
        <h2 style="color: #ec4899; font-size: 20px;">Nikita Saw Your Website! 🎉</h2>
        <p style="color: #475569; line-height: 1.6;">Good news! Nikita has successfully opened and viewed your birthday wishes website.</p>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `
    : `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
        <h2 style="color: #8b5cf6; font-size: 20px;">New Message from Nikita! 💌</h2>
        <p style="color: #475569; font-size: 14px;">Nikita left you a reply message on the website:</p>
        <div style="font-style: italic; background-color: #f8fafc; padding: 15px; border-left: 4px solid #8b5cf6; border-radius: 6px; color: #1e293b; margin: 20px 0; font-size: 16px; line-height: 1.6;">
          "${message.trim()}"
        </div>
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 11px;">Timestamp: ${new Date().toLocaleString()}</p>
      </div>
    `;

  const mailOptions = {
    from: `"Birthday Website Notification" <${process.env.FROM_EMAIL}>`,
    to: process.env.MY_EMAIL,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Mail dispatching failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
}
