"use client";
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
          text-align: center;
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

      <h2>1. Who We Are</h2>
      <p>
        VidyaAI is a personalized and adaptive educational technology platform
        operated by IndiqAI. We provide AI-powered lecture management and
        analytics tools to institutions, teachers, and students under a
        Business-to-Business (B2B) license model.
      </p>

      <h2>2. About VidyaAI</h2>
      <p>
        VidyaAI is designed to enhance learning by offering features such as
        automated lecture transcription, summaries, analytics, and insights.
        Institutions purchase licenses, and teachers and students use the
        platform to support their educational activities. Our goal is to make
        the teaching and learning journey more efficient, engaging, and
        insightful.
      </p>

      <h2>3. Scope of This Privacy Policy</h2>
      <p>
        This Privacy Policy explains how VidyaAI collects, uses, shares, and
        protects personal data of students, teachers, and institutional users.
        By accessing or using our platform, you agree to the practices described
        here.
      </p>

      <h2>4. Information We Collect</h2>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>
          Account Information: Name, email address, role
          (student/teacher/admin), and institutional affiliation.
        </li>
        <li>
          Authentication Data: Email OTPs for secure login and verification.
        </li>
        <li>
          Lecture Data: Uploaded lecture files, transcriptions, and summaries.
        </li>
        <li>
          Usage Data: Log details, access times, and device/browser information.
        </li>
        <li>
          Communication Data: Emails sent to notify users when lectures are
          processed.
        </li>
        <li>
          Student Activity data: AI content visit, watch time, asked queries.
        </li>
      </ul>
      <p>
        We do not collect payment details directly, as all licensing and
        payments are handled between institutions and VidyaAI through direct
        agreements.
      </p>

      <h2>5. How We Collect User Data</h2>
      <p>We collect information about you in the following ways:</p>
      <ul>
        <li>
          <strong>Through Institutions:</strong> Institutions provide student
          and teacher details (name, email, role) when creating accounts.
        </li>
        <li>
          <strong>Directly from You:</strong> When you register by yourself,
          verify with OTP, or update your profile information.
        </li>
        <li>
          <strong>Automatically:</strong> When you use the platform, we collect
          usage logs, device details, and browser information.
        </li>
        <li>
          <strong>From Uploaded Content: </strong>Teachers upload lecture files,
          which generate transcripts, summaries, and analytics that may include
          student-related data.
        </li>
        <li>
          <strong>Through Communication: </strong>When we send emails (e.g.,
          lecture processing notifications), we may collect delivery and
          engagement data.
        </li>
        <li>
          <strong>Through Student Activities: </strong>When students visit any
          AI content section, watch videos, ask questions to chatbot we store
          these activities for personalization.
        </li>
      </ul>
      <p>
        We only collect the minimum necessary data required to deliver our
        services effectively.
      </p>

      <h2>6. How We Use Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide and operate the platform.</li>
        <li>Notify teachers and students when lectures are processed.</li>
        <li>Authenticate users with OTP verification.</li>
        <li>
          Ensure role-based access so that students see only their own data and
          teachers see limited student information (name, email, marks).
        </li>
        <li>Improve services and platform performance.</li>
      </ul>
      <p>We do not use collected data for marketing purposes.</p>

      <h2>7. Legal Basis for Processing</h2>
      <p>
        Where applicable under international laws (e.g., GDPR), our legal bases
        for processing include:
      </p>
      <ul>
        <li>
          Performance of a contract (providing services under institutional
          agreements).
        </li>
        <li>Compliance with legal obligations.</li>
        <li>
          Legitimate interests (platform security, product improvement).
        </li>
        <li>Consent (when applicable).</li>
      </ul>

      <h2>8. Data Protection & Security</h2>
      <p>
        We take reasonable technical and organizational measures to protect your
        data, including:
      </p>
      <ul>
        <li>Encryption of data in transit and at rest.</li>
        <li>
          Role-based access controls to ensure users can only access
          authorized data.
        </li>
        <li>Regular monitoring for security vulnerabilities.</li>
        <li>Secure APIs for all transactions and communications.</li>
      </ul>
      <p>
        We encourage users to keep login details confidential and report any
        suspicious activity.
      </p>

      <h2>9. Data Sharing and Disclosure</h2>
      <p>We do not sell or rent personal data. Data may be shared with:</p>
      <ul>
        <li>
          Institutions (your school/university) for administrative purposes.
        </li>
        <li>
          Service Providers that support hosting, storage, or delivery of
          services (bound by confidentiality agreements).
        </li>
        <li>Legal Authorities if required by law.</li>
      </ul>

      <h2>10. Data Retention & Deactivation</h2>
      <ul>
        <li>
          Data is retained for as long as your institution maintains a license
          with VidyaAI.
        </li>
        <li>
          Currently, we do not provide full deletion of user data. Users may
          request temporary deactivation of their account through their
          institution.
        </li>
      </ul>

      <h2>11. International Users</h2>
      <p>
        As VidyaAI may be accessed globally, your data may be transferred and
        stored outside your country. We take steps to ensure international
        transfers are legally compliant.
      </p>

      <h2>12. Children’s Privacy</h2>
      <p>
        There is no minimum age restriction for students on VidyaAI. However,
        since accounts are created and managed through institutions, parental
        consent is not required.
      </p>

      <h2>13. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have rights to:</p>
      <ul>
        <li>Access your personal data.</li>
        <li>Correct inaccurate data.</li>
        <li>Request account deactivation.</li>
        <li>Withdraw consent where applicable.</li>
      </ul>
      <p>
        Requests should be made via your institution or by contacting us
        directly.
      </p>

      <h2>14. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Updates will be
        communicated to institution.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        If you have questions or concerns about this Privacy Policy, please
        contact us at:
      </p>
      <p>
        Email: <a>admin@indiqai.ai</a>
      </p>
      <p>Company Name: IndiqAI</p>
    </div>
  );
}
