import * as React from 'react';

interface BookingEmailTemplateProps {
  name: string;
  service: string;
  date: string;
  time: string;
  phone: string;
  notes?: string;
}

export function BookingEmailTemplate({ 
  name, 
  service, 
  date, 
  time, 
  phone, 
  notes 
}: BookingEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: '#4a4037', 
        color: 'white', 
        padding: '30px 20px', 
        textAlign: 'center' 
      }}>
        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
          Papromakeovers
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: '0.9' }}>
          Professional Makeup Artistry
        </p>
      </div>

      <div style={{ padding: '40px 20px' }}>
        <h2 style={{ color: '#b49b82', marginTop: '0', fontSize: '24px' }}>
          Booking Confirmation
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
          Dear {name},
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
          Thank you for booking with Papromakeovers! Your appointment has been confirmed and we&apos;re excited to create a beautiful look for you.
        </p>
        
        <div style={{ 
          backgroundColor: '#faf8f5', 
          padding: '25px', 
          borderRadius: '12px', 
          margin: '30px 0',
          border: '1px solid #e5ddd1'
        }}>
          <h3 style={{ 
            color: '#4a4037', 
            marginTop: '0', 
            marginBottom: '20px',
            fontSize: '20px'
          }}>
            📅 Appointment Details
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ 
                padding: '8px 0', 
                fontWeight: 'bold', 
                color: '#6b5b4a',
                width: '30%'
              }}>
                Service:
              </td>
              <td style={{ padding: '8px 0', color: '#333' }}>
                {service}
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8px 0', 
                fontWeight: 'bold', 
                color: '#6b5b4a'
              }}>
                Date:
              </td>
              <td style={{ padding: '8px 0', color: '#333' }}>
                {new Date(date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8px 0', 
                fontWeight: 'bold', 
                color: '#6b5b4a'
              }}>
                Time:
              </td>
              <td style={{ padding: '8px 0', color: '#333' }}>
                {time}
              </td>
            </tr>
            <tr>
              <td style={{ 
                padding: '8px 0', 
                fontWeight: 'bold', 
                color: '#6b5b4a'
              }}>
                Phone:
              </td>
              <td style={{ padding: '8px 0', color: '#333' }}>
                {phone}
              </td>
            </tr>
            {notes && (
              <tr>
                <td style={{ 
                  padding: '8px 0', 
                  fontWeight: 'bold', 
                  color: '#6b5b4a',
                  verticalAlign: 'top'
                }}>
                  Notes:
                </td>
                <td style={{ padding: '8px 0', color: '#333' }}>
                  {notes}
                </td>
              </tr>
            )}
          </table>
        </div>
        
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '20px', 
          borderRadius: '8px',
          borderLeft: '4px solid #b49b82',
          margin: '20px 0'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4a4037' }}>
            💡 What to Expect
          </h4>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            Please arrive 5-10 minutes early. If you need to reschedule or have any questions, 
            contact us at least 24 hours in advance.
          </p>
        </div>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
          We look forward to creating something beautiful together! You will receive an invoice in your email shortly.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>
          Best regards,<br />
          <strong>The Papromakeovers Team</strong>
        </p>
      </div>
      
      <div style={{ 
        backgroundColor: '#f5f2ed', 
        padding: '20px', 
        textAlign: 'center',
        borderTop: '1px solid #e5ddd1'
      }}>
        <p style={{ 
          color: '#6b5b4a', 
          fontSize: '14px', 
          margin: '0 0 10px 0' 
        }}>
          📍 Based in Coventry, UK | 📞 +447368590564
        </p>
        <p style={{ 
          color: '#6b5b4a', 
          fontSize: '14px', 
          margin: '0 0 15px 0' 
        }}>
          ✉️ papromakeoversstudio@gmail.com
        </p>
        <p style={{ 
          color: '#999', 
          fontSize: '12px', 
          margin: '0',
          fontStyle: 'italic'
        }}>
          This is an automated confirmation email from Papromakeovers.
        </p>
      </div>
    </div>
  );
}
