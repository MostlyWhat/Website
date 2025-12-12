# Data Breach Notification Procedure

**Document Type:** Incident Response Procedure  
**Last Updated:** December 11, 2025  
**Document Owner:** Security & Compliance Team  
**Status:** Active  
**Review Cycle:** Quarterly

---

## Purpose

This document outlines the procedure for responding to personal data breaches in compliance with GDPR Article 33 and 34. All team members must be familiar with this procedure and act swiftly if a breach is suspected.

---

## Legal Requirements

### GDPR Article 33: Notification to Supervisory Authority
- **Timeline:** Within 72 hours of becoming aware of the breach
- **Applies to:** Breaches likely to result in risk to individuals' rights and freedoms

### GDPR Article 34: Communication to Data Subjects
- **Timeline:** Without undue delay
- **Applies to:** Breaches likely to result in high risk to individuals' rights and freedoms

### Penalties for Non-Compliance
- Up to €10 million or 2% of global annual turnover (whichever is higher)
- Reputational damage
- Loss of customer trust
- Potential civil lawsuits

---

## What Constitutes a Data Breach?

A breach of security leading to the accidental or unlawful:
- Destruction of personal data
- Loss of personal data
- Alteration of personal data
- Unauthorized disclosure of personal data
- Unauthorized access to personal data

### Examples of Data Breaches

**Yes - These ARE breaches:**
- ✅ Database backup stolen or exposed
- ✅ User credentials leaked or compromised
- ✅ Ransomware attack encrypting user data
- ✅ Employee accessing data without authorization
- ✅ Email sent to wrong recipient containing personal data
- ✅ Lost or stolen laptop with unencrypted data
- ✅ Cloud storage misconfiguration exposing data
- ✅ SQL injection attack accessing user records
- ✅ Third-party vendor breach affecting our data

**No - These are NOT breaches:**
- ❌ User forgets password (user action, not breach)
- ❌ Failed login attempt blocked by system
- ❌ Phishing email sent to user (unless successful)
- ❌ DDoS attack with no data access
- ❌ Website defacement with no data access

---

## Incident Response Team

### Core Team

| Role | Responsibility | Contact |
|------|----------------|---------|
| **Incident Commander** | Overall response coordination | [Primary Contact] |
| **Technical Lead** | Containment, investigation, remediation | [Dev Team Lead] |
| **Legal Counsel** | Legal obligations, notification requirements | [Legal Email] |
| **Communications Lead** | User notifications, PR | [Communications Email] |
| **DPO (Data Protection Officer)** | Regulatory compliance, authority notification | dpo@mostlywhat.com |

### Escalation Path
1. **Any employee** detecting breach → Notify Incident Commander immediately
2. **Incident Commander** → Assemble response team within 1 hour
3. **Response Team** → Assess severity and begin containment
4. **DPO** → Notify supervisory authority if required (within 72 hours)

---

## Breach Response Procedure

### Phase 1: Detection & Initial Assessment (Hour 0-1)

**Actions:**

1. **Immediately notify Incident Commander**
   - Email: security@mostlywhat.com
   - Slack: #security-incidents channel
   - Phone: [Emergency Contact]

2. **Document initial details**
   - What: Type of breach (unauthorized access, data loss, etc.)
   - When: Time of detection and suspected occurrence
   - Where: System/database/service affected
   - How: Attack vector or cause
   - Who: Affected users/data categories

3. **Preserve evidence**
   - Take screenshots
   - Save logs
   - Document system state
   - Do NOT delete or modify evidence

4. **Initial severity assessment**

**Severity Classification:**

| Level | Description | Examples | Response Time |
|-------|-------------|----------|---------------|
| **Critical** | High risk to individuals' rights | Password hashes exposed, payment card data, health records | Immediate (15 min) |
| **High** | Significant risk | Email addresses + personal info, location data | 1 hour |
| **Medium** | Limited risk | Non-sensitive data, small number of users | 4 hours |
| **Low** | Minimal risk | Public data, no PII | 24 hours |

### Phase 2: Containment (Hour 1-4)

**Immediate Actions:**

1. **Stop the breach**
   - Isolate affected systems
   - Revoke compromised credentials
   - Block malicious IP addresses
   - Disable vulnerable features
   - Take affected services offline if necessary

2. **Secure backups**
   - Verify backup integrity
   - Ensure backups not compromised
   - Create point-in-time snapshot before remediation

3. **Change credentials**
   - Rotate API keys
   - Change admin passwords
   - Revoke access tokens
   - Update security certificates if needed

4. **Document containment actions**
   - Timestamp all actions
   - Record commands executed
   - Note who performed each action

### Phase 3: Investigation (Hour 4-24)

**Detailed Analysis:**

1. **Scope determination**
   - How many users affected?
   - What data was accessed/disclosed?
   - What data categories? (names, emails, passwords, financial, etc.)
   - Time period of unauthorized access
   - Has data been exfiltrated or just accessed?

2. **Root cause analysis**
   - Vulnerability exploited
   - Attack vector
   - When vulnerability was introduced
   - Why existing controls failed

3. **Risk assessment**
   
   **Data Categories Risk Matrix:**
   
   | Data Type | Risk Level | Notification Required |
   |-----------|-----------|----------------------|
   | Names + Email only | Low | Possibly not |
   | Email + Password hashes | High | Yes (Authority + Users) |
   | Payment card data | Critical | Yes (Authority + Users + Card Networks) |
   | Government IDs | Critical | Yes (Authority + Users) |
   | Health records | Critical | Yes (Authority + Users) |
   | Biometric data | Critical | Yes (Authority + Users) |
   | Children's data | Critical | Yes (Authority + Users + Parents) |
   | Public business info | Low | Possibly not |

4. **Document findings**
   - Create detailed incident report
   - Timeline of events
   - Evidence collected
   - Affected user list

### Phase 4: Notification (Hour 24-72)

#### A. Supervisory Authority Notification

**Required if:**
- Breach likely to result in risk to individuals' rights and freedoms
- Cannot rule out risk with high confidence

**Not required if:**
- Data encrypted with keys not compromised
- Immediate measures taken to ensure no risk
- No risk to individuals (e.g., public data only)

**Notification Details (Article 33):**

Must include:
1. Nature of the breach (categories and approximate numbers)
2. Name and contact of DPO
3. Likely consequences of the breach
4. Measures taken or proposed to address breach and mitigate effects

**Where to Report:**

| Region | Authority | Contact | Portal |
|--------|-----------|---------|--------|
| EU (Primary) | Irish DPC | info@dataprotection.ie | https://forms.dataprotection.ie/contact |
| UK | ICO | casework@ico.org.uk | https://ico.org.uk/for-organisations/report-a-breach/ |
| Thailand | PDPC Thailand | pdpc@mdes.go.th | https://www.pdpc.or.th |

**Template Notification:**

```
Subject: Personal Data Breach Notification - [Incident ID]

To: [Supervisory Authority]
From: MostlyWhat Systems - Data Protection Officer
Date: [Date/Time]

1. BREACH DETAILS
   - Incident ID: [Unique ID]
   - Date detected: [Date/Time]
   - Estimated date occurred: [Date/Time]
   - Nature of breach: [Unauthorized access / Data loss / etc.]

2. DATA AFFECTED
   - Number of data subjects: [Approximate number]
   - Categories of data: [Email addresses, names, etc.]
   - Number of records: [Approximate number]

3. LIKELY CONSEQUENCES
   - [Description of potential impact on individuals]
   - Risk level: [Low / Medium / High]
   - Justification: [Why this risk level]

4. MEASURES TAKEN
   - Containment actions: [List actions and timestamps]
   - Remediation: [Steps taken to prevent recurrence]
   - User notification plan: [If applicable]

5. CONTACT INFORMATION
   - DPO: dpo@mostlywhat.com
   - Security Team: security@mostlywhat.com
   - Phone: [Contact number]

Attachments: [Technical incident report, affected user list (if requested)]
```

#### B. User Notification

**Required if:**
- High risk to individuals' rights and freedoms
- Identity theft risk
- Financial loss risk
- Discrimination risk
- Reputational damage risk

**Not required if:**
- Technical measures render data unintelligible (e.g., encryption)
- Subsequent measures eliminate high risk
- Notification would involve disproportionate effort (then use public announcement)

**Notification Timeline:**
- Without undue delay after breach confirmed
- Preferably within 24-48 hours
- Before public disclosure or media reports

**Notification Method:**
- Email to registered address (primary)
- In-app notification
- Dashboard alert
- If unable to reach user: Public notice on website

**User Notification Template:**

```
Subject: Important Security Notice - Action Required

Dear [User Name],

We are writing to inform you of a security incident that may have affected your account.

WHAT HAPPENED
On [date], we discovered [brief description of breach]. We immediately 
took action to secure our systems and investigate the incident.

WHAT INFORMATION WAS INVOLVED
The following information may have been accessed:
- [List data categories: email address, name, etc.]
- [Specifically NOT affected: passwords were encrypted and not compromised]

WHAT WE'RE DOING
- [Containment action 1]
- [Containment action 2]
- [Preventive measure]

WHAT YOU SHOULD DO
1. Change your password immediately at [link]
2. Enable two-factor authentication: [link]
3. Monitor your account for suspicious activity
4. [Any other specific actions]

DO NOT:
- Reply to suspicious emails claiming to be from us
- Click on links in unexpected emails
- Share your password with anyone

MORE INFORMATION
- Full incident details: [link to status page]
- Contact our security team: security@mostlywhat.com
- Privacy support: privacy@mostlywhat.com

We sincerely apologize for this incident and any concern it may cause.

[Signature]
MostlyWhat Systems Security Team

This notification is required under GDPR Article 34.
```

### Phase 5: Remediation (Hour 72+)

**Technical Remediation:**

1. **Fix vulnerability**
   - Apply security patches
   - Update dependencies
   - Fix code vulnerabilities
   - Strengthen access controls

2. **Implement additional controls**
   - Enhanced monitoring
   - Additional logging
   - Rate limiting
   - IP whitelisting (if applicable)

3. **Verify fix**
   - Security testing
   - Penetration testing
   - Code review
   - Third-party audit (for critical breaches)

**User Support:**

1. **Support resources**
   - Dedicated support email/chat
   - FAQ page with common questions
   - Status page with updates
   - Regular communication updates

2. **Remediation for users**
   - Free credit monitoring (if financial data affected)
   - Password reset assistance
   - Account recovery support
   - Compensation (if applicable)

### Phase 6: Post-Incident Review (Week 1-2)

**Conduct Post-Mortem:**

1. **Timeline review**
   - Detection: How quickly was breach detected?
   - Response: How effective was response?
   - Containment: How quickly was breach contained?
   - Notification: Were timelines met?

2. **Control effectiveness**
   - What controls worked?
   - What controls failed?
   - What controls were missing?

3. **Lessons learned**
   - What would we do differently?
   - What went well?
   - What training is needed?

4. **Action items**
   - Technical improvements
   - Process improvements
   - Training needs
   - Policy updates

**Document Review:**

1. Create detailed post-incident report
2. Update this procedure based on lessons learned
3. Brief executive team
4. Train team on improvements
5. Update risk register

---

## Breach Documentation Template

**Incident ID:** [YYYY-MM-DD-XXX]  
**Classification:** [Critical / High / Medium / Low]  
**Status:** [Open / Contained / Remediated / Closed]

### Timeline

| Time | Event | Action Taken | Person Responsible |
|------|-------|--------------|-------------------|
| [HH:MM] | Breach detected | [Action] | [Name] |
| [HH:MM] | Team notified | [Action] | [Name] |
| [HH:MM] | Containment begun | [Action] | [Name] |
| [HH:MM] | Authority notified | [Action] | [DPO] |

### Affected Data

| Data Category | Number of Records | Sensitivity | Encrypted? |
|---------------|-------------------|-------------|------------|
| Email addresses | [X] | Medium | No |
| Hashed passwords | [X] | High | Yes |

### Impact Assessment

- **Number of affected users:** [X]
- **Data exfiltrated:** [Yes/No/Unknown]
- **Likelihood of harm:** [Low/Medium/High]
- **Type of potential harm:** [Identity theft / Financial loss / etc.]

### Notifications Sent

- ☐ Supervisory authority (within 72 hours)
- ☐ Affected users
- ☐ Other parties: [specify]

### Root Cause

[Detailed description of what went wrong and why]

### Remediation Actions

1. [Action taken]
2. [Action taken]
3. [Preventive measure implemented]

### Cost Impact

- **Response cost:** [Amount]
- **Remediation cost:** [Amount]
- **Potential fines:** [Estimate]
- **Reputational cost:** [Assessment]

---

## Prevention Measures

### Proactive Security

1. **Regular security audits**
   - Quarterly vulnerability scans
   - Annual penetration testing
   - Code security reviews
   - Dependency updates

2. **Access controls**
   - Principle of least privilege
   - Regular access reviews
   - MFA for all admin accounts
   - IP whitelisting for sensitive operations

3. **Monitoring and detection**
   - Real-time security monitoring
   - Anomaly detection
   - Failed login tracking
   - Database query monitoring

4. **Data minimization**
   - Collect only necessary data
   - Regular data cleanup
   - Anonymization where possible
   - Pseudonymization for analytics

5. **Employee training**
   - Security awareness training (quarterly)
   - Phishing simulation tests
   - Incident response drills
   - Privacy training

6. **Vendor management**
   - Security assessments of vendors
   - Regular DPA reviews
   - Sub-processor audits
   - Breach notification clauses in contracts

---

## Testing and Drills

### Tabletop Exercises

- **Frequency:** Bi-annually
- **Participants:** Incident response team
- **Scenarios:** 
  - Database breach
  - Ransomware attack
  - Insider threat
  - Third-party breach

### Incident Response Drills

- **Frequency:** Annually
- **Type:** Full simulation with actual systems (test environment)
- **Metrics:** 
  - Detection time
  - Response time
  - Containment time
  - Communication effectiveness

---

## Contact Information

### Internal Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| Incident Commander | security@mostlywhat.com | 24/7 |
| Technical Lead | dev@mostlywhat.com | 24/7 |
| DPO | dpo@mostlywhat.com | Business hours |
| Legal | legal@mostlywhat.com | Business hours |

### External Contacts

| Entity | Contact | Use Case |
|--------|---------|----------|
| Cloudflare Security | abuse@cloudflare.com | CDN/DDoS issues |
| Supabase Security | security@supabase.com | Database issues |
| Lemon Squeezy | hello@lemonsqueezy.com | Payment issues |
| Law Enforcement | [Local cybercrime unit] | Criminal activity |

### Supervisory Authorities

- **EU/Ireland:** info@dataprotection.ie
- **UK:** casework@ico.org.uk
- **Thailand:** pdpc@mdes.go.th

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | December 11, 2025 | Initial procedure created | Security Team |

---

## Quick Reference Card

**🚨 BREACH DETECTED? FOLLOW THESE STEPS:**

1. **NOTIFY** security@mostlywhat.com immediately (< 15 minutes)
2. **DOCUMENT** what you know (what, when, where, how)
3. **PRESERVE** evidence (screenshots, logs, don't delete anything)
4. **DO NOT** attempt to fix without incident team approval
5. **WAIT** for incident team instructions

**⏰ CRITICAL TIMELINES:**
- Notify incident team: < 15 minutes
- Initial assessment: < 1 hour
- Containment: < 4 hours
- Authority notification: < 72 hours
- User notification: < 48 hours (if high risk)

**📞 EMERGENCY CONTACTS:**
- Security: security@mostlywhat.com
- DPO: dpo@mostlywhat.com
- Legal: legal@mostlywhat.com

**Print this page and keep it accessible!**

---

*This document is confidential and for internal use only. Do not distribute outside the organization.*
