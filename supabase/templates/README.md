# Supabase Email Templates

This directory contains all email templates used by Supabase Auth for authentication flows.

## Design System

All templates follow the MostlyWhat Systems design system:

- **Colors:**
  - Primary: Cobalt Blue (#4a9eff)
  - Background: Deep Black (#000814, #0f1419)
  - Text: Light Gray (#e5e5e5, #a3a3a3)
  - Borders: Dark Gray (#1a2332)
  - Warning Yellow: #ffd500
  - Error Red: #ef4444
  - Success Green: #22c55e

- **Typography:**
  - Font Stack: SF Mono, Monaco, Cascadia Code, Roboto Mono, Courier New, Consolas
  - Monospace throughout for industrial/tech aesthetic
  - Letter-spacing: 0.15em for headers, 0.05em for titles

- **Style:**
  - Sharp corners (no border-radius)
  - Dark theme
  - High contrast
  - Uppercase text for emphasis

## Templates

### Authentication Templates

1. **confirm.html** - Email confirmation for new accounts
   - Section: `// EMAIL VERIFICATION`
   - Used when users sign up and need to verify their email
   - Expires: 24 hours

2. **magic_link.html** - Passwordless sign-in link
   - Section: `// SECURE LOGIN`
   - Used for magic link authentication
   - Expires: 1 hour
   - Warning border: Yellow (#ffd500)

3. **invite.html** - Team/organization invitation
   - Section: `// TEAM INVITATION`
   - Used when inviting users to join the platform
   - Expires: 7 days

### Account Management Templates

4. **recovery.html** - Password reset request
   - Section: `// PASSWORD RECOVERY`
   - Used when users request password reset
   - Expires: 1 hour
   - Warning border: Red (#ef4444)

5. **email_change.html** - Email address change confirmation
   - Section: `// ACCOUNT SETTINGS`
   - Used when users change their email address
   - Expires: 24 hours
   - Warning border: Red (#ef4444)

6. **reauthentication.html** - Identity verification for sensitive actions
   - Section: `// SECURITY VERIFICATION`
   - Used for sensitive operations requiring re-authentication
   - Expires: 10 minutes
   - Warning border: Yellow (#ffd500)

## Template Structure

Each template follows this structure:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* Inline CSS styles */
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="header">
                <span class="logo">MOSTLYWHAT SYSTEMS</span>
            </div>
            <div class="content">
                <p class="section-marker">// SECTION NAME</p>
                <h1 class="title">Title</h1>
                <p class="text">Message content...</p>
                <a href="{{ .ConfirmationURL }}" class="button">Action Button</a>
                <div class="alt-link">
                    <p>Alternative link text...</p>
                    <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
                </div>
                <div class="warning"><!-- Optional warning message --></div>
            </div>
            <div class="footer">
                <p>Expiration and security notice</p>
            </div>
        </div>
        <div class="meta">
            <p>Copyright and links</p>
        </div>
    </div>
</body>
</html>
```

## Supabase Variables

Templates use Go template syntax for dynamic content:

- `{{ .ConfirmationURL }}` - The action link URL
- `{{ now | date: "%Y" }}` - Current year for copyright

## Customization

To modify templates:

1. **Update inline styles** - All CSS is inline for email compatibility
2. **Maintain responsive design** - Mobile breakpoint at 600px
3. **Keep accessibility** - High contrast ratios maintained
4. **Test rendering** - Verify in major email clients (Gmail, Outlook, Apple Mail)

## Email Client Compatibility

Templates are designed with email client limitations in mind:

- Inline CSS (no external stylesheets)
- Table-free layout using divs
- Web fonts with fallbacks
- Responsive using media queries
- High contrast for readability

## Configuration

Configure these templates in Supabase Dashboard:

1. Go to Authentication > Email Templates
2. Select template type
3. Copy the entire HTML from the corresponding `.html` file
4. Paste into Supabase dashboard
5. Save changes

Each template is completely standalone with all CSS inline, making them ready to copy-paste directly into Supabase.

Alternatively, use Supabase CLI:

```bash
supabase functions deploy
```

## Testing

To test templates locally:

1. Create a test HTML file with sample data
2. Replace `{{ .ConfirmationURL }}` with a test URL
3. Open in browsers and email clients
4. Verify responsive behavior at different screen sizes
5. Check dark mode compatibility

## Maintenance

When updating templates:

- ✅ Keep design system colors consistent
- ✅ Maintain monospace typography
- ✅ Preserve sharp corners (no border-radius)
- ✅ Test in multiple email clients
- ✅ Update all 6 templates for consistency
- ✅ Document changes in this README
