"use client";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="page">
      <div className="container">
        <article className="card">
          {/* Header */}
          <header className="cardHeader">
            <h1 className="title">Privacy Policy</h1>
          </header>

          {/* Body */}
          <div className="cardBody">
            <section className="prose">
              {/* 1 */}
              <h2>1. Who We Are</h2>
              <p>
                VidyaAI is a personalized and adaptive educational technology
                platform operated by IndiqAI. We provide AI-powered lecture
                management and analytics tools to institutions, teachers, and
                students under a Business-to-Business (B2B) license model.
              </p>

              {/* 2 */}
              <h2>2. About VidyaAI</h2>
              <p>
                VidyaAI is designed to enhance learning by offering features such as
                automated lecture transcription, summaries, analytics, and insights.
                Institutions purchase licenses, and teachers and students use the
                platform to support their educational activities. Our goal is to make
                the teaching and learning journey more efficient, engaging, and
                insightful.
              </p>

              {/* 3 */}
              <h2>3. Scope of This Privacy Policy</h2>
              <p>
                This Privacy Policy explains how VidyaAI collects, uses, shares, and
                protects personal data of students, teachers, and institutional users.
                By accessing or using our platform, you agree to the practices described
                here.
              </p>

              {/* 4 */}
              <h2>4. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  <strong>Account Information:</strong> Name, email address, role
                  (student/teacher/admin), and institutional affiliation.
                </li>
                <li>
                  <strong>Authentication Data:</strong> Email OTPs for secure login and verification.
                </li>
                <li>
                  <strong>Lecture Data:</strong> Uploaded lecture files, transcriptions, and summaries.
                </li>
                <li>
                  <strong>Usage Data:</strong> Log details, access times, and device/browser information.
                </li>
                <li>
                  <strong>Communication Data:</strong> Emails sent to notify users when lectures are
                  processed.
                </li>
                <li>
                  <strong>Student Activity data:</strong> AI content visit, watch time, asked queries.
                </li>
              </ul>
              <p>
                We do not collect payment details directly, as all licensing and
                payments are handled between institutions and VidyaAI through direct
                agreements.
              </p>

              {/* 5 */}
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

              {/* 6 */}
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

              {/* 7 */}
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

              {/* 8 */}
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

              {/* 9 */}
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

              {/* 10 */}
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

              {/* 11 */}
              <h2>11. International Users</h2>
              <p>
                As VidyaAI may be accessed globally, your data may be transferred and
                stored outside your country. We take steps to ensure international
                transfers are legally compliant.
              </p>

              {/* 12 */}
              <h2>12. Children’s Privacy</h2>
              <p>
                There is no minimum age restriction for students on VidyaAI. However,
                since accounts are created and managed through institutions, parental
                consent is not required.
              </p>

              {/* 13 */}
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

              {/* 14 */}
              <h2>14. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Updates will be
                communicated to institution.
              </p>

              {/* 15 */}
              <h2>15. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please
                contact us at:
              </p>
              <p>
                Email: <a href="mailto:admin@indiqai.ai">admin@indiqai.ai</a>
              </p>
              <p>Company Name: IndiqAI</p>
            </section>
          </div>
        </article>
      </div>

      {/* Styles */}
      <style jsx>{`
        /* Layout */
        .page {
          min-height: 100vh;
          background: #f6f6f7;
        }
        .container {
          max-width: 72rem; /* 1152px */
          margin: 0 auto;
          padding: 2rem 1rem 3rem;
        }

        /* Card */
        .card {
          border: 1px solid #e7e7ea;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 4px 20px rgba(10, 10, 20, 0.06);
          backdrop-filter: saturate(140%) blur(6px);
          overflow: hidden;
        }
        .cardHeader {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e7e7ea;
        }
        .title {
          margin: 0;
          text-align: center;
          font-size: 1.875rem; /* 30px */
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: #111114;
          font-weight: 650;
        }
        .cardBody {
          padding: 2rem 1.5rem 2.5rem;
        }

        /* Typography "prose" */
        .prose {
          color: #1b1c20;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI,
            Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          line-height: 1.65;
          font-size: 1rem; /* base */
        }
        .prose h2 {
          margin: 1.35em 0 0.5em;
          font-size: 1.375rem; /* 22px */
          line-height: 1.3;
          color: #0f0f13;
          letter-spacing: -0.01em;
        }
        .prose p {
          margin: 0.6em 0 0.9em;
        }
        .prose ul {
          padding-left: 1.25rem;
          margin: 0.5em 0 1em;
        }
        .prose li {
          margin: 0.35em 0;
        }
        .prose a {
          color: #0e6fff;
          text-decoration: none;
          border-bottom: 1px dotted rgba(14, 111, 255, 0.6);
        }
        .prose a:hover {
          text-decoration: underline;
        }
        .prose strong {
          font-weight: 600;
          color: #0f0f13;
        }

        /* Responsive */
        @media (min-width: 640px) {
          .container {
            padding: 3rem 2rem 4rem;
          }
          .cardHeader {
            padding: 2rem 2.5rem;
          }
          .title {
            font-size: 2rem;
          }
          .cardBody {
            padding: 2.5rem 2.5rem 3rem;
          }
          .prose {
            font-size: 1.0625rem; /* 17px */
          }
          .prose h2 {
            font-size: 1.5rem; /* 24px */
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .page {
            background: #0c0d0f;
          }
          .card {
            background: rgba(17, 17, 20, 0.92);
            border-color: #26262c;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          }
          .cardHeader {
            border-color: #26262c;
          }
          .title {
            color: #f2f3f5;
          }
          .prose {
            color: #e6e7eb;
          }
          .prose h2 {
            color: #ffffff;
          }
          .prose a {
            color: #6aa6ff;
            border-bottom-color: rgba(106, 166, 255, 0.5);
          }
          .prose strong {
            color: #ffffff;
          }
        }

        /* Print-friendly */
        @media print {
          .page {
            background: #ffffff !important;
          }
          .container {
            max-width: none;
            padding: 0;
          }
          .card,
          .cardHeader,
          .cardBody {
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
          }
          .title {
            font-size: 24pt;
            margin-bottom: 8pt;
          }
          .prose {
            font-size: 11.5pt;
            color: #000000;
          }
          .prose h2 {
            font-size: 14pt;
          }
          a[href]:after {
            content: " (" attr(href) ")";
            font-size: 10pt;
          }
        }
      `}</style>
    </main>
  );
}
