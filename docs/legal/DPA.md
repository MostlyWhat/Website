# Data Processing Agreements (DPA)

**Last Updated:** December 11, 2025  
**Document Owner:** Legal & Compliance Team  
**Status:** Active

---

## Overview

This document outlines the Data Processing Agreements (DPAs) and sub-processor relationships for MostlyWhat Systems. Under GDPR Article 28, we are required to maintain written agreements with all third-party processors who handle personal data on our behalf.

## Legal Framework

**Controller:** MostlyWhat Systems  
**Data Protection Officer:** [To be assigned]  
**Contact:** privacy@mostlywhat.com

**Applicable Regulations:**
- GDPR (EU General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- UK GDPR
- Thai PDPA (Personal Data Protection Act)

---

## Third-Party Sub-Processors

### 1. Supabase, Inc.

**Service Provided:** Database, Authentication, File Storage  
**Data Processed:** 
- User authentication data (email, hashed passwords)
- Profile information (name, avatar, contact details)
- Application data (projects, tickets, invoices, organizations)
- File uploads and attachments
- Activity logs and session data

**Location:** United States (primary), with global CDN distribution  
**Transfer Mechanism:** Standard Contractual Clauses (SCCs)  
**DPA Status:** ✅ Signed via Supabase Enterprise Agreement  
**Certification:**
- SOC 2 Type II Certified
- ISO 27001 Certified
- GDPR Compliant

**Security Measures:**
- End-to-end encryption for data at rest (AES-256)
- TLS 1.3 for data in transit
- Row-level security (RLS) policies
- Regular security audits and penetration testing
- Automated backups with point-in-time recovery
- Multi-factor authentication for admin access

**Data Retention:** 
- Active data: Retained while account is active
- Backups: 30-day rolling backups
- Deleted data: Permanent deletion within 30 days

**DPA Link:** https://supabase.com/legal/dpa  
**Privacy Policy:** https://supabase.com/privacy

**Sub-processors of Supabase:**
- AWS (Amazon Web Services) - Infrastructure hosting
- Fly.io - Edge computing and distribution
- Cloudflare - CDN and DDoS protection

---

### 2. Cloudflare, Inc.

**Service Provided:** CDN, DDoS Protection, Edge Computing, DNS  
**Data Processed:**
- IP addresses
- HTTP request headers and metadata
- Cache keys and cached content
- DNS query logs
- Security event logs

**Location:** Global network with data centers worldwide  
**Transfer Mechanism:** Standard Contractual Clauses (SCCs)  
**DPA Status:** ✅ Available via Cloudflare Dashboard  
**Certification:**
- ISO 27001 Certified
- SOC 2 Type II Certified
- PCI DSS Compliant
- GDPR Compliant

**Security Measures:**
- DDoS mitigation at edge
- Web Application Firewall (WAF)
- Bot management and rate limiting
- Zero Trust Network Access (ZTNA)
- Automatic HTTPS/TLS encryption
- HTTP/3 and QUIC support

**Data Retention:**
- Logs: 30 days (security logs may be retained longer)
- Cache: Configurable TTL (typically 1 hour to 7 days)
- Analytics: Aggregated data retained for 90 days

**DPA Link:** https://www.cloudflare.com/cloudflare-customer-dpa/  
**Privacy Policy:** https://www.cloudflare.com/privacypolicy/

---

### 3. Lemon Squeezy LLC

**Service Provided:** Payment Processing, Subscription Management, Merchant of Record  
**Data Processed:**
- Customer billing information (name, address, email)
- Payment card details (tokenized, not stored by us)
- Invoice data
- Subscription status
- Order history
- Tax identification information

**Location:** United States  
**Transfer Mechanism:** Standard Contractual Clauses (SCCs)  
**DPA Status:** ✅ Included in Lemon Squeezy Terms  
**Certification:**
- PCI DSS Level 1 Compliant (via Stripe)
- GDPR Compliant
- SOC 2 Type II (in progress)

**Security Measures:**
- Payment card data handled by PCI-compliant processor (Stripe)
- Tokenization of sensitive payment information
- Encrypted data transmission (TLS 1.3)
- Fraud detection and prevention
- Secure API key management
- Webhook signature verification

**Data Retention:**
- Active subscription data: Retained while subscription is active
- Historical transactions: 7 years (for tax and legal compliance)
- Payment card details: Not stored (tokenized by Stripe)

**DPA Link:** https://www.lemonsqueezy.com/dpa  
**Privacy Policy:** https://www.lemonsqueezy.com/privacy

**Sub-processors of Lemon Squeezy:**
- Stripe, Inc. - Payment processing
- Paddle - Alternative payment provider
- SendGrid/Twilio - Email notifications

---

### 4. Google LLC (Analytics)

**Service Provided:** Website Analytics (Google Analytics 4)  
**Data Processed:**
- IP addresses (anonymized)
- Device and browser information
- Page views and navigation paths
- Geographic location (city-level)
- User interactions and events
- Session duration and bounce rates

**Location:** United States (with global processing)  
**Transfer Mechanism:** Standard Contractual Clauses (SCCs)  
**DPA Status:** ✅ Available via Google Ads Data Processing Terms  
**Certification:**
- ISO 27001 Certified
- SOC 2/3 Certified
- GDPR Compliant

**Security Measures:**
- IP anonymization enabled
- Consent Mode v2 implementation
- Data retention limits configured (14 months)
- User ID not collected without consent
- Advertising features disabled by default

**Data Retention:**
- Event data: 14 months (configurable)
- User-level data: Automatically expires after 14 months
- Aggregated reports: Indefinite

**Privacy Controls:**
- Users can opt out via cookie preferences
- Google Analytics Opt-out Browser Add-on supported
- Do Not Track (DNT) signals respected

**DPA Link:** https://privacy.google.com/businesses/processorterms/  
**Privacy Policy:** https://policies.google.com/privacy

---

### 5. Sentry.io (Planned)

**Service Provided:** Error Monitoring, Performance Monitoring  
**Data Processed:**
- Error stack traces
- User IDs (hashed)
- Performance metrics
- Request URLs and headers
- Device and browser information
- IP addresses (anonymized)

**Location:** United States  
**Transfer Mechanism:** Standard Contractual Clauses (SCCs)  
**DPA Status:** ⏳ To be signed upon implementation  
**Certification:**
- SOC 2 Type II Certified
- ISO 27001 Certified
- GDPR Compliant

**Security Measures:**
- Data scrubbing for sensitive information
- PII filtering and redaction
- Source map security
- IP address masking
- Encrypted storage and transmission

**Data Retention:**
- Error events: 90 days
- Performance data: 90 days
- Aggregated metrics: 1 year

**DPA Link:** https://sentry.io/legal/dpa/  
**Privacy Policy:** https://sentry.io/privacy/

---

## Data Processing Impact Assessment (DPIA)

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data breach at sub-processor | Low | High | All processors SOC 2/ISO 27001 certified, regular audits |
| Unauthorized data access | Low | High | Encryption at rest and in transit, RLS policies, MFA |
| Data loss | Very Low | Medium | Automated backups, 30-day retention, point-in-time recovery |
| GDPR non-compliance | Low | High | DPAs in place, regular compliance reviews, consent management |
| Excessive data retention | Low | Medium | Automated deletion policies, data minimization principles |
| Third-party data sharing | Very Low | High | Strict contractual obligations, no sharing without consent |

### Data Minimization

We only process the minimum data necessary for:
- Account creation and authentication
- Service delivery and support
- Billing and invoicing
- Security and fraud prevention
- Legal compliance

**Not Collected:**
- Biometric data
- Health information
- Sensitive personal categories (race, religion, political views)
- Children's data (under 16)

---

## International Data Transfers

### EU to US Transfers

**Mechanism:** Standard Contractual Clauses (SCCs) approved by EU Commission  
**Legal Basis:** Article 46 GDPR

All US-based processors (Supabase, Cloudflare, Lemon Squeezy, Google) have signed SCCs.

**Additional Safeguards:**
- Encryption at rest and in transit
- Access controls and authentication
- Regular security audits
- Incident response procedures
- Data subject rights facilitation

### UK to US Transfers

**Mechanism:** UK International Data Transfer Agreement (IDTA)  
**Status:** All processors compliant with UK GDPR

### Thailand to US Transfers

**Mechanism:** Thai PDPA cross-border transfer requirements  
**Consent:** Explicit consent obtained for transfers outside Thailand

---

## Data Subject Rights Facilitation

All sub-processors are contractually obligated to assist with:

1. **Right of Access (Article 15)** - Data export within 30 days
2. **Right to Rectification (Article 16)** - Correction of inaccurate data
3. **Right to Erasure (Article 17)** - "Right to be forgotten"
4. **Right to Restriction (Article 18)** - Temporary processing suspension
5. **Right to Data Portability (Article 20)** - Machine-readable export
6. **Right to Object (Article 21)** - Opt-out of processing

**Process:**
1. User submits request via `/app/settings/privacy`
2. Request verified and logged
3. Data retrieved from all sub-processors within 30 days
4. Exported or deleted as requested
5. Confirmation sent to user

---

## Breach Notification Obligations

All sub-processors are contractually required to:
- Notify us within 24 hours of discovering a breach
- Provide full details of affected data and users
- Assist with breach investigation and remediation
- Document all incidents and corrective actions

**Our Response:**
- Assess impact and affected users within 24 hours
- Notify supervisory authority within 72 hours (if applicable)
- Notify affected users without undue delay
- Implement corrective measures
- Document breach in compliance register

See [BREACH_PROCEDURE.md](./BREACH_PROCEDURE.md) for full details.

---

## Sub-Processor Change Notification

Users will be notified of new sub-processors or changes via:
- Email to registered users (30 days advance notice)
- Update on website privacy policy
- In-app notification for logged-in users

Users have the right to object to new sub-processors within 30 days.

---

## Audit and Compliance

### Regular Reviews
- Quarterly review of all DPAs
- Annual compliance audit
- Sub-processor security assessment
- Incident log review

### Documentation
- DPA copies maintained in `/docs/legal/dpa/`
- Sub-processor certifications verified annually
- Transfer impact assessments updated annually
- Risk register maintained and reviewed quarterly

---

## Contact for DPA Inquiries

**Data Protection Officer (DPO):**  
Email: dpo@mostlywhat.com  
Address: [Company Address]

**Privacy Team:**  
Email: privacy@mostlywhat.com

**For Data Subject Requests:**  
Portal: https://mostlywhat.com/app/settings/privacy  
Email: privacy@mostlywhat.com

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | December 11, 2025 | Initial DPA documentation | Compliance Team |

---

## Appendices

### Appendix A: Data Processing Activities

See [GDPR_REGISTER.md](./GDPR_REGISTER.md) for full register of processing activities.

### Appendix B: Standard Contractual Clauses

All SCCs are available upon request from privacy@mostlywhat.com

### Appendix C: Sub-Processor Contact Details

| Processor | DPO Contact | Emergency Contact |
|-----------|-------------|-------------------|
| Supabase | privacy@supabase.com | security@supabase.com |
| Cloudflare | privacyquestions@cloudflare.com | abuse@cloudflare.com |
| Lemon Squeezy | privacy@lemonsqueezy.com | hello@lemonsqueezy.com |
| Google | https://support.google.com/policies/troubleshooter/9009584 | N/A |
