import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    if (import.meta.env.VITE_EMAILJS_USER_ID) {
      emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
    }
  }

  async sendEventRegistrationConfirmation(userEmail, userName, eventDetails) {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      event_title: eventDetails.title,
      event_date: new Date(eventDetails.date).toLocaleDateString(),
      event_time: eventDetails.time,
      event_location: eventDetails.location,
      registration_id: eventDetails.registrationId
    };

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTRATION,
        templateParams
      );
      return { success: true, response };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  async sendEventReminder(userEmail, userName, eventDetails) {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      event_title: eventDetails.title,
      event_date: new Date(eventDetails.date).toLocaleDateString(),
      event_time: eventDetails.time,
      event_location: eventDetails.location
    };

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_REMINDER,
        templateParams
      );
      return { success: true, response };
    } catch (error) {
      console.error('Reminder email failed:', error);
      return { success: false, error };
    }
  }

  async sendEventCancellation(userEmail, userName, eventDetails) {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      event_title: eventDetails.title,
      event_date: new Date(eventDetails.date).toLocaleDateString(),
      cancellation_reason: eventDetails.reason || 'Event has been cancelled'
    };

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_CANCELLATION,
        templateParams
      );
      return { success: true, response };
    } catch (error) {
      console.error('Cancellation email failed:', error);
      return { success: false, error };
    }
  }
}

export default new EmailService();