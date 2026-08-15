import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def send_admin_email(subject: str, html_content: str, recipient_email: str = None) -> dict:
    """
    Send an email digest/notification to the SAM AI Admin.
    """
    admin_email = recipient_email or os.getenv("ADMIN_EMAIL", "sam@mail.com")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    if not smtp_user or not smtp_pass:
        # Return log simulation if SMTP credentials are not yet configured in .env
        safe_subject = subject.encode('ascii', 'replace').decode('ascii')
        print(f"[EMAIL SIMULATION] To: {admin_email} | Subject: {safe_subject}")
        return {
            "status": "simulated",
            "message": f"Email digest logged successfully for {admin_email}. Configure SMTP_USER and SMTP_PASS in .env for live SMTP delivery.",
            "recipient": admin_email,
            "subject": subject
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = admin_email

        part = MIMEText(html_content, "html", "utf-8")
        msg.attach(part)

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, admin_email, msg.as_string())

        return {
            "status": "sent",
            "message": f"Email successfully sent to {admin_email}",
            "recipient": admin_email,
            "subject": subject
        }
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to send email: {str(e)}",
            "recipient": admin_email,
            "subject": subject
        }
