"use client"
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="policy-wrap">
            {/* ---- styles ---- */}
      <style jsx>{`
        .policy-wrap {
          max-width: 860px;
          margin: 32px auto;
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e6e6e6;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
          font-family: Calibri, "Segoe UI", Tahoma, Arial, sans-serif; /* Word-like font */
          color: #000000; /* exact black text */
        }
        .title {
          font-size: 28px; /* approx 22pt look */
          margin: 0 0 8px 0;
          font-weight: 600;
          text-align:center;
        }
        .updated {
          margin: 0 0 20px 0;
          font-size: 16px;
        }
        .section {
          font-size: 20px;
          margin: 22px 0 8px 0;
          font-weight: 600;
        }
        .para {
          margin: 0 0 12px 0;
          font-size: 15px; /* ~11pt-12pt readability */
          line-height: 1.5;
          white-space: pre-wrap; /* preserves the leading spaces for nested "-" items */
        }
        .indent {
          padding-left: 24px;
        }
        @media (max-width: 640px) {
          .policy-wrap {
            margin: 16px;
            padding: 20px;
          }
          .title {
            font-size: 24px;
          }
          .section {
            font-size: 18px;
          }
          .para {
            font-size: 16px;
          }
        }
      `}</style>
      <h1 className="title">Privacy Policy</h1>

      {/* <p className="updated">Last updated: 18 August 2025</p> */}

      <p className="para">
        VidyaAI is an adaptive and personalized learning platform designed for teachers, students, and educational institutions. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and the choices you have.
      </p>

      <h2 className="section">1. Who We Are</h2>
      <p className="para">
        VidyaAI is a B2B learning platform. Our services are provided to organizations (such as schools, colleges, or training institutions) under license. Users (teachers, students, admins) access VidyaAI through their organization.
      </p>

      <h2 className="section">2. Information We Collect</h2>
      <p className="para">
        We collect information that you or your organization provide when you use VidyaAI:
      </p>

      {/* bullets kept exactly as text, with hyphens, but wrapped in <p> for HTML structure */}
      <div className="indent">
        <p className="para">- Teachers: Name, email, mobile number, password, optional profile picture, lecture details, uploaded files/videos.</p>
        <p className="para">- Students: Name, email, mobile number, password, class details, learning activity (watchtime, visits, scores, rankings).</p>
        <p className="para">- Admins: Created by backend (name, email).</p>
        <p className="para">- System Data: Uploaded lectures, generated transcriptions, AI-generated summaries/assignments/notes, analytics, chatbot interactions.</p>
        <p className="para">- Technical Data: IP address, device info, and logs (through REST APIs).</p>
      </div>

      <p className="para">
        We do not collect or process payment information inside VidyaAI.
      </p>

      <h2 className="section">3. How We Use Your Information</h2>
      <p className="para">We use your data to:</p>

      <div className="indent">
        <p className="para">- Create and manage accounts.</p>
        <p className="para">- Verify users via OTP.</p>
        <p className="para">- Upload, process, and store lectures.</p>
        <p className="para">- Generate AI-powered content (summaries, questions, assignments, chatbot responses).</p>
        <p className="para">- Notify teachers and students (for OTPs, lecture processing, and updates).</p>
        <p className="para">- Provide analytics for teachers, students, and admins.</p>
        <p className="para">- Personalize learning content for students.</p>
        <p className="para">- Maintain security and improve platform performance.</p>
      </div>

      <p className="para">We do not use your email or personal data for marketing or advertising.</p>

      <h2 className="section">4. Sharing of Information</h2>
      <p className="para">We may share information with:</p>

      <div className="indent">
        <p className="para">- Cloud service providers (for file and video storage).</p>
        <p className="para">- AI/LLM service providers (for generating educational content).</p>
        <p className="para">- Internal platform roles (teachers, students, admins) with restricted access:</p>
        <div className="indent">
          <p className="para">  - Students only see their own data.</p>
          <p className="para">  - Teachers can only see basic student details (name, email, marks).</p>
          <p className="para">  - Admins can monitor platform-wide activity.</p>
        </div>
      </div>

      <p className="para">We do not sell or trade your personal information.</p>

      <h2 className="section">5. Data Retention and Deactivation</h2>
      <div className="indent">
        <p className="para">- Your data (lectures, transcripts, analytics) is stored as long as your organization has an active license.</p>
        <p className="para">- Users may request account deactivation, but complete deletion of data is not currently supported.</p>
        <p className="para">- Teachers and admins can remove uploaded lectures if needed.</p>
      </div>

      <h2 className="section">6. Children and Student Data</h2>
      <p className="para">
        VidyaAI may be used by students of any age. We do not require parental consent at this time. However, institutions using VidyaAI are responsible for ensuring compliance with local laws regarding student data.
      </p>

      <h2 className="section">7. Security</h2>
      <p className="para">We take reasonable measures to protect your information:</p>
      <div className="indent">
        <p className="para">- Encrypted data transmission (via REST APIs).</p>
        <p className="para">- Role-based access controls.</p>
        <p className="para">- Limited visibility of student information.</p>
      </div>

      <h2 className="section">8. International Data Transfers</h2>
      <p className="para">
        As VidyaAI may be used internationally, your data may be stored or processed in other countries where our cloud or service providers operate.
      </p>

      <h2 className="section">9. Your Choices and Rights</h2>
      <div className="indent">
        <p className="para">- You can update your profile details at any time.</p>
        <p className="para">- You can request account deactivation through your institution or VidyaAI support.</p>
        <p className="para">- You can contact us for questions about your data.</p>
      </div>

      <h2 className="section">10. Changes to This Policy</h2>
      <p className="para">
        We may update this Privacy Policy from time to time. If we make significant changes, we will notify your organization or update the date at the top of this page.
      </p>

      <h2 className="section">11. Contact Us</h2>
      <p className="para">
        If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
      </p>

      <p className="para">Email: admin@indiqai.ai</p>
      <p className="para">Organization: IndiqAI</p>
    </div>
  );
}
