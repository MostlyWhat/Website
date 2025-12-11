# Fix all a11y issues across the project

# Fix tickets/[id]/+page.svelte - change label to div for display-only labels
$file = 'c:\Users\venot\Projects\GitHub\Website\src\routes\(admin)\admin\tickets\[id]\+page.svelte'
$content = Get-Content -LiteralPath $file -Raw
$content = $content -replace '<label class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">\s+TARGET TICKET\s+</label>', '<div class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">TARGET TICKET</div>'
$content = $content -replace '<label class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">\s+PARENT TICKET\s+</label>', '<div class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">PARENT TICKET</div>'
Set-Content -LiteralPath $file -Value $content

# Fix tickets/search/+page.svelte - change label to div
$file = 'c:\Users\venot\Projects\GitHub\Website\src\routes\(admin)\admin\tickets\search\+page.svelte'
$content = Get-Content -LiteralPath $file -Raw
$content = $content -replace '<label class="block text-xs font-medium mb-2">STATUS</label>', '<div class="block text-xs font-medium mb-2">STATUS</div>'
$content = $content -replace '<label class="block text-xs font-medium mb-2">PRIORITY</label>', '<div class="block text-xs font-medium mb-2">PRIORITY</div>'
$content = $content -replace '<label class="block text-xs font-medium mb-2">CATEGORY</label>', '<div class="block text-xs font-medium mb-2">CATEGORY</div>'
Set-Content -LiteralPath $file -Value $content

# Fix surveys/[token]/+page.svelte - change label to div for display-only labels
$file = 'c:\Users\venot\Projects\GitHub\Website\src\routes\surveys\[token]\+page.svelte'
$content = Get-Content -LiteralPath $file -Raw
$content = $content -replace '<label class="block font-medium text-foreground mb-3">\s+Overall Satisfaction <span class="text-destructive">\*</span>\s+</label>', '<div class="block font-medium text-foreground mb-3">Overall Satisfaction <span class="text-destructive">*</span></div>'
$content = $content -replace '<label class="block text-sm font-medium text-foreground mb-2">\s+Response Time\s+</label>', '<div class="block text-sm font-medium text-foreground mb-2">Response Time</div>'
$content = $content -replace '<label class="block text-sm font-medium text-foreground mb-2">\s+Resolution Quality\s+</label>', '<div class="block text-sm font-medium text-foreground mb-2">Resolution Quality</div>'
$content = $content -replace '<label class="block text-sm font-medium text-foreground mb-2">\s+Staff Professionalism\s+</label>', '<div class="block text-sm font-medium text-foreground mb-2">Staff Professionalism</div>'
$content = $content -replace '<label class="block font-medium text-foreground mb-3">\s+Would you recommend our service to others\?\s+</label>', '<div class="block font-medium text-foreground mb-3">Would you recommend our service to others?</div>'
Set-Content -LiteralPath $file -Value $content

# Fix MobileNav.svelte - remove empty CSS ruleset
$file = 'c:\Users\venot\Projects\GitHub\Website\src\lib\components\layout\MobileNav.svelte'
$content = Get-Content -LiteralPath $file -Raw
$content = $content -replace '\.desktop-nav \{\s+\}', ''
Set-Content -LiteralPath $file -Value $content

Write-Host "A11y fixes applied successfully!"
