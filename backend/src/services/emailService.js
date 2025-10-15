import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendRegistrationConfirmation(userEmail, userName, eventDetails) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Registration Confirmed: ${eventDetails.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Event Registration Confirmed!</h2>
          <p>Dear ${userName},</p>
          <p>Your registration for the following event has been confirmed:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">${eventDetails.title}</h3>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDetails.time || 'TBD'}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
            <p><strong>Registration ID:</strong> ${eventDetails.registrationId}</p>
          </div>
          
          <p>We look forward to seeing you at the event!</p>
          <p>Best regards,<br>Event Management Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  async sendEventReminder(userEmail, userName, eventDetails) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Reminder: ${eventDetails.title} is Tomorrow!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">Event Reminder</h2>
          <p>Dear ${userName},</p>
          <p>This is a friendly reminder that you have an upcoming event:</p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #2c3e50; margin-top: 0;">${eventDetails.title}</h3>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${eventDetails.time || 'TBD'}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
          </div>
          
          <p>Don't forget to attend!</p>
          <p>Best regards,<br>Event Management Team</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Reminder email failed:', error);
      return { success: false, error };
    }
  }
}

export default new EmailService();