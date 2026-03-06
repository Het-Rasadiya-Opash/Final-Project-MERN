import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error: any, success: any) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"ListingHouse" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendBookingMail = async (to: string, booking: any) => {
  const listing = booking.listing;
  const customer = booking.customer;
  const statusText = booking.status === "pending" ? "Waiting for Confirmation" : booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
  const statusColor = booking.status === "pending" ? "#FFA500" : booking.status === "confirmed" ? "#28a745" : "#dc3545";
  const listingImage = listing.images?.[0] || "";
  
  const subject = "Booking Confirmation - ListingHouse";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: #fff; background-color: ${statusColor}; }
        .property-image { width: 100%; height: 250px; object-fit: cover; border-radius: 8px; }
        .detail-row { padding: 12px 0; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; }
        .price-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 ListingHouse</h1>
          <p style="color: #fff; margin: 10px 0 0 0;">Booking Confirmation</p>
        </div>
        <div class="content">
          <p style="font-size: 18px; color: #333;">Dear ${customer.username},</p>
          <p style="color: #555;">Your booking has been successfully created!</p>
          <div style="margin: 20px 0;">
            <span class="status-badge">${statusText}</span>
          </div>
          ${listingImage ? `<img src="${listingImage}" alt="${listing.title}" class="property-image" />` : ''}
          <h2 style="margin: 20px 0 10px 0; color: #333;">${listing.title}</h2>
          <p style="color: #666; margin: 0 0 20px 0;">📍 ${listing.location}</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <div class="detail-row"><span><strong>Booking ID:</strong></span><span>${booking._id}</span></div>
            <div class="detail-row"><span><strong>Check-in:</strong></span><span>${new Date(booking.checkIn).toLocaleDateString()}</span></div>
            <div class="detail-row"><span><strong>Check-out:</strong></span><span>${new Date(booking.checkOut).toLocaleDateString()}</span></div>
            <div class="detail-row"><span><strong>Guests:</strong></span><span>${booking.guests}</span></div>
            <div class="detail-row"><span><strong>Stay Duration:</strong></span><span>${booking.stayDay} nights</span></div>
            <div class="detail-row" style="border: none;"><span><strong>Price/night:</strong></span><span>₹${listing.price}</span></div>
          </div>
          <div class="price-box">Total: ₹${booking.totalPrice}</div>
          <p style="color: #555; line-height: 1.6;">${booking.status === 'pending' ? '⏳ Your booking is pending. The property owner will confirm shortly.' : 'We look forward to hosting you!'}</p>
        </div>
        <div class="footer">
          <p style="margin: 0;">Thank you for choosing ListingHouse!</p>
        </div>
      </div>
    </body>
    </html>
  `;
  await sendEmail(to, subject, html);
};