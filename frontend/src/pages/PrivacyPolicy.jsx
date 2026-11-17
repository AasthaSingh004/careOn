import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card">
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f4c5c', marginBottom: '8px' }}>
          Privacy, Terms & Responsible Prototype Disclosure
        </h2>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          Last updated: Prototype Demonstration Version 2026
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              1. Educational Decision-Support Prototype Notice
            </h3>
            <p>
              CareOn is an intelligent emergency resource coordination prototype developed for academic demonstration and faculty review. <strong>CareOn is NOT an official emergency service, municipal 911/112 operator, police service, or replacement for government emergency dispatchers.</strong>
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              2. Cost Transparency & ₹0 Platform Fee
            </h3>
            <p>
              CareOn does not charge citizens any commission or platform fee for requesting emergency help. If platform resources are unavailable and an external private provider is engaged, the coordinator transparently displays the quotation and requests informed user consent before dispatching paid assistance.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              3. Data Retention & Responsible Handling
            </h3>
            <p>
              • Contact details and coordinates are only collected to coordinate relevant specialist assistance.<br/>
              • Passwords are encrypted with PBKDF2-HMAC-SHA256 salts.<br/>
              • All phone numbers in seeded demonstrations are safe fictional demo numbers.<br/>
              • Normal users cannot inspect another user's private incident details.<br/>
              • Administrators have role-protected command centre access with audit logging.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              4. Sahara Emergency Companion Boundaries
            </h3>
            <p>
              Sahara is a rule-based AI companion designed to provide supportive guidance and help track emergency requests. Sahara does NOT diagnose medical conditions, prescribe medication, or invent dispatch arrival times. For immediate life threats, citizens are directed to official emergency hotlines (112 / 108).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
