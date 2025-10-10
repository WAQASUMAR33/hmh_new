// lib/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465", // Use TLS for port 587, SSL for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;
    const mailOptions = {
        from: `"HMH Platform" <${process.env.EMAIL_FROM}>`, // Formatted sender
        to: email,
        subject: "Verify Your Email - HMH Platform",
        html: `
      <h1>Verify Your Email</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #2563eb; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}

export async function sendSuspensionEmail(email, firstName, lastName, userType, suspensionReason) {
    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;
    const appealUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/${userType}/suspended`;
    
    const mailOptions = {
        from: `"HMH Platform" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Account Suspension Notice - HMH Platform",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h1 style="color: #dc2626; margin: 0 0 10px 0;">Account Suspended</h1>
                    <p style="color: #7f1d1d; margin: 0;">Your HMH Platform account has been suspended.</p>
                </div>
                
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #374151; margin: 0 0 15px 0;">Account Details</h2>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Account Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
                    <p style="margin: 5px 0;"><strong>Suspension Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0;">Reason for Suspension</h3>
                    <p style="color: #78350f; margin: 0;">${suspensionReason}</p>
                </div>
                
                <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">What This Means</h3>
                    <ul style="color: #075985; margin: 0; padding-left: 20px;">
                        <li>You cannot access your ${userType} dashboard</li>
                        <li>All active opportunities and bookings are paused</li>
                        <li>You can still submit an appeal to contest this decision</li>
                    </ul>
                </div>
                
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #166534; margin: 0 0 10px 0;">Submit an Appeal</h3>
                    <p style="color: #15803d; margin: 0 0 15px 0;">If you believe this suspension was made in error, you can submit an appeal:</p>
                    <a href="${appealUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Submit Appeal</a>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        Need help? Contact our support team at 
                        <a href="mailto:support@hmh.com" style="color: #2563eb;">support@hmh.com</a>
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Suspension email sent to ${email}`);
    } catch (error) {
        console.error("Error sending suspension email:", error);
        // In development without SMTP, do not throw to avoid breaking flow
        if (process.env.NODE_ENV === 'production') {
            throw new Error("Failed to send suspension email");
        }
    }
}

export async function sendAppealResponseEmail(email, firstName, lastName, userType, appealStatus, adminResponse) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl}/login`;
    const dashboardUrl = `${baseUrl}/${userType}`;
    
    const statusColor = appealStatus === 'APPROVED' ? '#059669' : '#dc2626';
    const statusBg = appealStatus === 'APPROVED' ? '#f0fdf4' : '#fef2f2';
    const statusBorder = appealStatus === 'APPROVED' ? '#bbf7d0' : '#fecaca';
    const actionText = appealStatus === 'APPROVED' ? 'Your account has been restored and you can now access your dashboard.' : 'Your account remains suspended.';
    const actionButton = appealStatus === 'APPROVED' ? 
        `<a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Dashboard</a>` :
        `<a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Login</a>`;
    
    const mailOptions = {
        from: `"HMH Platform" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `Appeal ${appealStatus} - HMH Platform`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: ${statusBg}; border: 1px solid ${statusBorder}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h1 style="color: ${statusColor}; margin: 0 0 10px 0;">Appeal ${appealStatus}</h1>
                    <p style="color: ${statusColor}; margin: 0;">Your appeal has been ${appealStatus.toLowerCase()}.</p>
                </div>
                
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #374151; margin: 0 0 15px 0;">Account Details</h2>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 5px 0;"><strong>Account Type:</strong> ${userType.charAt(0).toUpperCase() + userType.slice(1)}</p>
                    <p style="margin: 5px 0;"><strong>Response Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div style="background-color: #f9fafb; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #374151; margin: 0 0 10px 0;">Admin Response</h3>
                    <p style="color: #4b5563; margin: 0;">${adminResponse}</p>
                </div>
                
                <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #0c4a6e; margin: 0 0 10px 0;">Next Steps</h3>
                    <p style="color: #075985; margin: 0 0 15px 0;">${actionText}</p>
                    ${actionButton}
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        Need help? Contact our support team at 
                        <a href="mailto:support@hmh.com" style="color: #2563eb;">support@hmh.com</a>
                    </p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Appeal response email sent to ${email}`);
    } catch (error) {
        console.error("Error sending appeal response email:", error);
        throw new Error("Failed to send appeal response email");
    }
}
