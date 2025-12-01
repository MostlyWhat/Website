---
title: Browser Compatibility
slug: browser-compatibility
category: troubleshooting
summary: Supported browsers and how to troubleshoot compatibility issues.
order: 4
---

## Supported Browsers

We build and test our solutions on the following browsers:

### Fully Supported
- **Chrome** 90+ (Windows, macOS, Linux)
- **Firefox** 90+ (Windows, macOS, Linux)
- **Safari** 14+ (macOS, iOS)
- **Edge** 90+ (Windows, macOS)

### Mobile Browsers
- **Safari** on iOS 14+
- **Chrome** on Android 10+
- **Samsung Internet** 15+

### Limited Support
- Internet Explorer - Not supported
- Opera - Tested but not actively supported
- Older browser versions - May work but not guaranteed

## Common Issues

### Site Looks Broken
1. **Clear your browser cache** - Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
2. **Disable browser extensions** - Try incognito/private mode
3. **Update your browser** - Ensure you're on the latest version

### Features Not Working
1. **Enable JavaScript** - Required for interactive features
2. **Check console for errors** - Press F12 and look for red messages
3. **Disable ad blockers** - They may block legitimate scripts

### Slow Performance
1. **Close unused tabs** - Free up memory
2. **Disable hardware acceleration** - In browser settings
3. **Try a different browser** - Rule out browser-specific issues

## Reporting Compatibility Issues

If you encounter a browser-specific issue:

1. Note the exact browser and version (Help > About)
2. Test in a different browser to confirm it's browser-specific
3. Include this information in your [bug report](/support/reporting-bugs)

## Our Testing Process

Before launching any project, we:

1. Test on all major browsers manually
2. Run automated cross-browser tests
3. Validate responsive design on multiple devices
4. Check accessibility compliance
5. Perform performance benchmarks
