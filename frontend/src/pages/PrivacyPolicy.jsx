import React from 'react';
import { useTranslation } from '../translations';

export default function PrivacyPolicy({ lang = 'en' }) {
  const { t } = useTranslation(lang);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE5EB', borderRadius: 16, padding: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#171C24', marginBottom: '8px' }}>
          {t('privacy_title', 'Privacy, Terms & Responsible Prototype Disclosure')}
        </h2>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          {t('privacy_updated', 'Last updated: Prototype Demonstration Version 2026')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '15px', lineHeight: 1.6, color: '#344252' }}>
          <section>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#171C24', marginBottom: '6px' }}>
              {t('privacy_sec1_title', '1. Educational Decision-Support Prototype Notice')}
            </h3>
            <p>
              {t('privacy_sec1_desc', 'CareOn is an intelligent emergency resource coordination prototype developed for academic demonstration and faculty review. CareOn is NOT an official emergency service, municipal 911/112 operator, police service, or replacement for government emergency dispatchers.')}
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#171C24', marginBottom: '6px' }}>
              {t('privacy_sec2_title', '2. Cost Transparency & ₹0 Platform Fee')}
            </h3>
            <p>
              {t('privacy_sec2_desc', "CareOn does not charge citizens any commission or platform fee for requesting emergency help. If platform resources are unavailable and an external private provider is engaged, the coordinator transparently displays the quotation and requests informed user consent before dispatching paid assistance.")}
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#171C24', marginBottom: '6px' }}>
              {t('privacy_sec3_title', '3. Data Retention & Responsible Handling')}
            </h3>
            <p>
              • {t('privacy_sec3_item1', 'Contact details and coordinates are only collected to coordinate relevant specialist assistance.')}<br/>
              • {t('privacy_sec3_item2', 'Passwords are encrypted with PBKDF2-HMAC-SHA256 salts.')}<br/>
              • {t('privacy_sec3_item3', 'All phone numbers in seeded demonstrations are safe fictional demo numbers.')}<br/>
              • {t('privacy_sec3_item4', "Normal users cannot inspect another user's private incident details.")}<br/>
              • {t('privacy_sec3_item5', 'Administrators have role-protected command centre access with audit logging.')}
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#171C24', marginBottom: '6px' }}>
              {t('privacy_sec4_title', '4. Sahara Emergency Companion Boundaries')}
            </h3>
            <p>
              {t('privacy_sec4_desc', 'Sahara is a rule-based AI companion designed to provide supportive guidance and help track emergency requests. Sahara does NOT diagnose medical conditions, prescribe medication, or invent dispatch arrival times. For immediate life threats, citizens are directed to official emergency hotlines (112 / 108).')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
