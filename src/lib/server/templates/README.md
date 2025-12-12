# Email Templates

This directory contains all transactional email templates used throughout the application. Each template is a standalone HTML file that can be edited, tested, and deployed independently.

## Design System

All templates follow the MostlyWhat Systems design system:

- **Primary Color**: Cobalt Blue (#4a9eff)
- **Background**: Deep Black (#000814, #0f1419, #0a0f14)
- **Text**: Light Gray (#e5e5e5, #a3a3a3, #6b7280)
- **Success**: Green (#22c55e)
- **Warning**: Yellow (#ffd500)
- **Error**: Red (#ef4444)
- **Typography**: SF Mono, Monaco, Cascadia Code, Roboto Mono (monospace stack)
- **Style**: Dark theme, sharp corners, high contrast

## Template Structure

Each template follows this structure:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Title</title>
</head>
<body style="...">
    <div style="max-width: 600px; ...">
        <!-- Header -->
        <div style="padding: 32px;">
            <div style="...">MOSTLYWHAT SYSTEMS</div>
            <div style="...">// SECTION MARKER</div>
            <h2>{{TITLE}}</h2>
            
            <!-- Content with {{PLACEHOLDERS}} -->
            
        </div>
        
        <!-- Compliance Footer -->
        <div style="background-color: #0a0f14; padding: 24px 32px; border-top: 1px solid #1a2332;">
            <p>© {{YEAR}} MostlyWhat Systems. All rights reserved.</p>
            <p>
                <a href="https://mostlywhat.com/legal/privacy">Privacy Policy</a> · 
                <a href="https://mostlywhat.com/legal/terms">Terms of Service</a> · 
                <a href="https://mostlywhat.com/support">Contact Support</a>
            </p>
            <p>MostlyWhat Systems · support@mostlywhat.com</p>
        </div>
    </div>
</body>
</html>
```

## Placeholders

Templates use `{{PLACEHOLDER}}` syntax for dynamic content:

- `{{YEAR}}` - Current year (automatically replaced)
- `{{NAME}}` - User/customer name
- `{{EMAIL}}` - Email address
- `{{AMOUNT}}` - Formatted currency amount
- `{{URL}}` - Action/invoice/survey URLs
- And more specific to each template

## Available Templates

### Transaction Emails

1. **contact-notification.html** - Contact form submissions to admin
   - Placeholders: NAME, EMAIL, COMPANY, PHONE, TOPIC, SUBJECT, MESSAGE, ORDER_ID, SUBMISSION_ID

2. **payment-confirmation.html** - Payment receipt
   - Placeholders: CUSTOMER_NAME, ORDER_ID, PRODUCT_NAME, AMOUNT
   - Note: Transactional email

3. **refund-notification.html** - Refund processed notification
   - Placeholders: CUSTOMER_NAME, ORDER_ID, AMOUNT, REASON
   - Note: Transactional email

4. **wire-transfer-approval.html** - Admin notification for wire transfer approval
   - Placeholders: INVOICE_ID, CUSTOMER_NAME, AMOUNT, UPLOAD_ID, APPROVAL_URL

5. **wire-transfer-confirmation.html** - Customer payment confirmed
   - Placeholders: CUSTOMER_NAME, INVOICE_ID, AMOUNT

6. **wire-transfer-rejection.html** - Payment verification required
   - Placeholders: CUSTOMER_NAME, INVOICE_ID, REASON, INVOICE_URL

### Communication Emails

7. **notification-email.html** - In-app notification emails
   - Placeholders: USER_NAME, NOTIFICATION_TITLE, NOTIFICATION_MESSAGE, ACTION_BUTTON, UNSUBSCRIBE_URL
   - Note: Includes unsubscribe link

8. **survey-email.html** - Customer satisfaction survey
   - Placeholders: CUSTOMER_NAME, TICKET_ID, TICKET_TITLE, SURVEY_URL
   - Note: One-time email, no unsubscribe needed

## Compliance Features

All templates include:

### Footer Information
- Copyright notice with dynamic year
- Links to Privacy Policy, Terms of Service, and Contact Support
- Company contact information (MostlyWhat Systems · support@mostlywhat.com)

### Email Type Indicators
- **Transactional emails**: "This is a transactional email regarding your [action]."
- **Notification emails**: Includes unsubscribe/preference management link
- **Admin emails**: "This is an administrative notification."
- **One-time emails**: Clarifies no further emails will be sent

### CAN-SPAM Compliance
- Physical address or support contact
- Clear indication of email purpose
- Unsubscribe mechanism for marketing/notification emails
- Transactional emails clearly marked as such

## Usage in Code

Templates are loaded via `loadTemplate()` function in `src/lib/server/email.ts`:

```typescript
const html = await loadTemplate('template-name', {
    PLACEHOLDER_NAME: 'value',
    ANOTHER_PLACEHOLDER: 'another value'
});

await sendEmail({
    to: 'user@example.com',
    subject: 'Email Subject',
    html
});
```

## Testing Templates

### Local Testing
1. Copy template file
2. Replace `{{PLACEHOLDERS}}` with sample data
3. Open in browser
4. Test in multiple browsers and screen sizes

### Email Client Testing
Test templates in:
- Gmail (Desktop & Mobile)
- Outlook (Desktop & Web)
- Apple Mail (iOS & macOS)
- Yahoo Mail
- ProtonMail

### Responsive Testing
- Desktop (>600px): Full layout with padding
- Mobile (<600px): Adjusted padding, stacked buttons

## Editing Templates

### When to Edit
- Color scheme updates
- Branding changes
- Compliance requirement changes
- Content/copy updates
- Adding new placeholder fields

### What NOT to Change
- Email-safe inline CSS approach
- Mobile responsiveness breakpoints
- Compliance footer structure
- Dark theme color contrast ratios
- Monospace font stack

### Best Practices
1. **Inline CSS only** - No external stylesheets
2. **Test thoroughly** - Verify in all major email clients
3. **Keep accessibility** - Maintain high contrast ratios
4. **Preserve structure** - Don't remove compliance sections
5. **Document changes** - Update this README when adding placeholders

## Email Client Compatibility

Templates are designed for maximum compatibility:

✅ **Fully Supported:**
- Gmail (Web, Android, iOS)
- Outlook (2016+, Web, Mobile)
- Apple Mail (macOS, iOS)
- Yahoo Mail
- ProtonMail

✅ **Inline CSS** - All styles inline for email client compatibility
✅ **Web Fonts with Fallbacks** - Monospace stack with system font fallbacks
✅ **Responsive** - Mobile-optimized with media queries
✅ **Dark Theme Safe** - Explicitly set colors, no transparency

## Adding New Templates

1. Create new `.html` file in this directory
2. Follow the structure above
3. Include compliance footer
4. Add placeholders using `{{PLACEHOLDER}}` syntax
5. Create corresponding function in `email.ts`
6. Document template in this README

## Deployment

Templates are:
- Read from filesystem at runtime
- Cached by Node.js (changes require restart)
- Can be hot-swapped without code deployment (restart server)
- Version controlled with application code

## Support

For questions about email templates:
- Technical: Review `src/lib/server/email.ts`
- Design: See `DESIGN_SYSTEM.md`
- Compliance: Contact legal team
