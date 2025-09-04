export function getPasswordResetEmailTemplate(resetToken: string, baseUrl: string) {
  const resetUrl = `${baseUrl}/admin/reset-password?token=${resetToken}`;
  
  return {
    subject: 'PaproMakeovers Admin - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #b49b82; margin-bottom: 10px;">PaproMakeovers</h1>
          <h2 style="color: #4a4037; font-weight: normal;">Password Reset Request</h2>
        </div>
        
        <div style="background-color: #faf8f5; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <p style="color: #4a4037; margin-bottom: 15px;">Hello,</p>
          <p style="color: #4a4037; margin-bottom: 15px;">
            You requested a password reset for your PaproMakeovers admin account.
          </p>
          <p style="color: #4a4037; margin-bottom: 20px;">
            Click the button below to reset your password. This link will expire in 15 minutes for security.
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #d4b896 0%, #b49b82 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(180, 155, 130, 0.3);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b5d4f; font-size: 14px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #b49b82; word-break: break-all; font-size: 13px;">
            ${resetUrl}
          </p>
        </div>
        
        <div style="border-top: 1px solid #f5f2ed; padding-top: 20px;">
          <p style="color: #6b5d4f; font-size: 13px; margin-bottom: 10px;">
            <strong>Security Notice:</strong>
          </p>
          <ul style="color: #6b5d4f; font-size: 13px; margin: 0; padding-left: 20px;">
            <li>This link expires in 15 minutes</li>
            <li>If you didn't request this reset, ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f5f2ed;">
          <p style="color: #6b5d4f; font-size: 12px; margin: 0;">
            PaproMakeovers Admin Portal<br>
            This is an automated security email.
          </p>
        </div>
      </div>
    `,
    text: `
PaproMakeovers - Password Reset Request

Hello,

You requested a password reset for your PaproMakeovers admin account.

To reset your password, visit this link (expires in 15 minutes):
${resetUrl}

Security Notice:
- This link expires in 15 minutes
- If you didn't request this reset, ignore this email
- Never share this link with anyone

PaproMakeovers Admin Portal
This is an automated security email.
    `.trim()
  };
}


export function getBookingConfirmationEmailTemplate(
  customerName: string, 
  service: string, 
  date: string, 
  time: string, 
  location: string
) {
  return {
    subject: `Booking Confirmation - ${service} on ${date}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #b49b82; margin-bottom: 10px;">PaproMakeovers</h1>
          <h2 style="color: #4a4037; font-weight: normal;">Booking Confirmation</h2>
        </div>
        
        <div style="background-color: #faf8f5; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <h3 style="color: #4a4037; margin-top: 0;">Dear ${customerName},</h3>
          <p style="color: #4a4037; margin-bottom: 15px;">
            Thank you for your booking request! We've received your appointment details and will contact you within 24 hours to confirm your booking.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #b49b82; margin-top: 0; margin-bottom: 15px;">Booking Details:</h4>
            <table style="width: 100%; color: #4a4037;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 120px;">Service:</td>
                <td style="padding: 8px 0;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                <td style="padding: 8px 0;">${location}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f5f2ed; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #4a4037; margin-top: 0; margin-bottom: 10px;">What Happens Next:</h4>
            <ul style="color: #4a4037; margin: 0; padding-left: 20px;">
              <li>We'll contact you within 24 hours to confirm your appointment</li>
              <li>An invoice will be sent to you with payment details</li>
              <li>Please arrive 5 minutes early on your appointment day</li>
              <li>Come with a clean, moisturized face</li>
              <li>Feel free to bring any makeup inspiration photos</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f5f2ed;">
          <p style="color: #6b5d4f; font-size: 14px; margin-bottom: 10px;">
            Questions? Contact us:
          </p>
          <p style="color: #b49b82; margin: 5px 0;">📞 +447368590564</p>
          <p style="color: #b49b82; margin: 5px 0;">✉️ papromakeoversstudio@gmail.com</p>
          <p style="color: #6b5d4f; font-size: 12px; margin-top: 15px;">
            PaproMakeovers - Professional Makeup Artistry<br>
            Coventry, United Kingdom
          </p>
        </div>
      </div>
    `,
    text: `
PaproMakeovers - Booking Confirmation

Dear ${customerName},

Thank you for your booking request! We've received your appointment details and will contact you within 24 hours to confirm your booking.

BOOKING DETAILS:
Service: ${service}
Date: ${date}
Time: ${time}
Location: ${location}

WHAT HAPPENS NEXT:
- We'll contact you within 24 hours to confirm your appointment
- An invoice will be sent to you with payment details
- Please arrive 5 minutes early on your appointment day
- Come with a clean, moisturized face
- Feel free to bring any makeup inspiration photos

Questions? Contact us:
Phone: +447368590564
Email: papromakeoversstudio@gmail.com

PaproMakeovers - Professional Makeup Artistry
Coventry, United Kingdom
    `.trim()
  };
}