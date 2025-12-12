# Quick Reference Guide - New Features

This guide provides quick examples for using the newly implemented features.

---

## Ticket Splitting

**Location:** `src/lib/server/ticket-relationships.ts`

### Split a ticket into multiple tickets

```typescript
import { splitTicket } from '$lib/server/ticket-relationships';

const result = await splitTicket({
  sourceTicketId: 'original-ticket-id',
  splitById: 'staff-user-id',
  newTickets: [
    {
      subject: 'Database performance issue',
      description: 'Investigate slow queries',
      priority: 'high',
      categoryId: 'backend',
      transferComments: true,
      commentIdsToTransfer: ['comment-id-1', 'comment-id-2']
    },
    {
      subject: 'Frontend caching issue',
      description: 'Review cache invalidation',
      priority: 'medium',
      categoryId: 'frontend'
    }
  ]
});

if (result.success) {
  console.log('Created tickets:', result.newTicketIds);
}
```

---

## Ticket Linking

**Location:** `src/lib/server/ticket-relationships.ts`

### Link two tickets

```typescript
import { linkTickets, unlinkTickets, getTicketLinks } from '$lib/server/ticket-relationships';

// Create a link
await linkTickets({
  sourceTicketId: 'ticket-1',
  targetTicketId: 'ticket-2',
  linkType: 'blocks', // or: related, duplicate, blocked_by, references, referenced_by
  createdById: 'staff-id'
});

// Get all links for a ticket
const links = await getTicketLinks('ticket-1');

// Remove a link
await unlinkTickets('link-id', 'staff-id');
```

### Link Types

- `related` - General relationship
- `duplicate` - Marks as duplicate
- `blocks` - This ticket blocks another
- `blocked_by` - This ticket is blocked by another
- `references` - References another ticket
- `referenced_by` - Referenced by another ticket

---

## Project Notes

**Location:** `src/lib/server/project-notes.ts`

### Create, read, update, delete notes

```typescript
import { 
  createProjectNote, 
  getProjectNotes, 
  updateProjectNote, 
  deleteProjectNote 
} from '$lib/server/project-notes';

// Create a note
const result = await createProjectNote({
  projectId: 'project-id',
  content: 'Discussed timeline with client. Moving deadline to next month.',
  createdById: 'staff-id'
});

// Get all notes for a project
const notes = await getProjectNotes('project-id');

// Update a note
await updateProjectNote('note-id', 'Updated content here');

// Delete a note
await deleteProjectNote('note-id');
```

---

## Project Timeline Component

**Location:** `src/lib/components/ProjectTimeline.svelte`

### Use in a Svelte page

```svelte
<script>
  import ProjectTimeline from '$lib/components/ProjectTimeline.svelte';
  
  const milestones = [
    {
      id: '1',
      title: 'Design Phase',
      status: 'completed',
      dueDate: new Date('2024-01-15'),
      completedAt: new Date('2024-01-14'),
      weight: 20
    },
    {
      id: '2',
      title: 'Development',
      status: 'in_progress',
      dueDate: new Date('2024-03-01'),
      completedAt: null,
      weight: 50
    },
    {
      id: '3',
      title: 'Testing',
      status: 'pending',
      dueDate: new Date('2024-03-15'),
      completedAt: null,
      weight: 30
    }
  ];
</script>

<ProjectTimeline 
  {milestones} 
  projectStartDate={new Date('2024-01-01')}
  projectEndDate={new Date('2024-04-01')}
/>
```

---

## Export Reports

**Location:** `src/lib/utils/export-reports.ts`

### Export to CSV

```typescript
import { 
  exportTicketMetricsCSV,
  exportProjectMetricsCSV,
  exportStaffPerformanceCSV,
  exportInvoiceMetricsCSV
} from '$lib/utils/export-reports';

// Export ticket metrics
exportTicketMetricsCSV({
  total: 150,
  byStatus: { open: 30, in_progress: 20, resolved: 100 },
  byPriority: { low: 50, medium: 60, high: 30, urgent: 10 }
});

// Export staff performance
exportStaffPerformanceCSV([
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    ticketsAssigned: 45,
    ticketsResolved: 40,
    resolutionRate: 88.9,
    projectsAssigned: 3,
    totalReplies: 120,
    avgResponseTime: '2.5 hours'
  }
]);
```

### Export to PDF

```typescript
import { exportComprehensiveReportPDF } from '$lib/utils/export-reports';

await exportComprehensiveReportPDF({
  ticketMetrics: {...},
  projectMetrics: {...},
  invoiceMetrics: {...},
  staffPerformance: [...]
});
```

---

## Stripe Payment Integration

**Location:** `src/lib/server/stripe.ts`

### Create Payment Intent

```typescript
import { createPaymentIntent } from '$lib/server/stripe';

const result = await createPaymentIntent({
  invoiceId: 'invoice-123',
  amount: 10000, // $100.00 in cents
  currency: 'usd',
  customerId: 'cus_xxxxx', // optional
  metadata: {
    organizationId: 'org-123',
    projectId: 'project-456'
  }
});

if (result.success) {
  // Send clientSecret to frontend
  const { clientSecret } = result;
}
```

### Create Checkout Session

```typescript
import { createCheckoutSession } from '$lib/server/stripe';

const session = await createCheckoutSession({
  invoiceId: 'invoice-123',
  invoiceNumber: 'INV-2024-001',
  amount: 10000, // $100.00 in cents
  customerEmail: 'customer@example.com',
  metadata: {
    organizationId: 'org-123'
  }
});

if (session.success) {
  // Redirect user to Stripe Checkout
  window.location.href = session.url;
}
```

### Process Refund

```typescript
import { refundPayment } from '$lib/server/stripe';

const result = await refundPayment(
  'pi_xxxxx', // payment intent ID
  5000, // $50.00 in cents (optional, leave empty for full refund)
  'requested_by_customer' // reason (optional)
);
```

### Webhook Handling

The webhook is automatically set up at `/api/stripe/webhook` and handles:

- `payment_intent.succeeded` - Marks invoice as paid
- `payment_intent.payment_failed` - Sends failure notification
- `checkout.session.completed` - Marks invoice as paid
- `charge.refunded` - Marks invoice as refunded

**Webhook URL:** `https://yourdomain.com/api/stripe/webhook`

**Required Environment Variable:**
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## Mobile Components

### Responsive Container

```svelte
<script>
  import ResponsiveContainer from '$lib/components/layout/ResponsiveContainer.svelte';
</script>

<ResponsiveContainer padding="md" maxWidth="2xl">
  <!-- Your content here -->
</ResponsiveContainer>
```

### Mobile Navigation

```svelte
<script>
  import MobileNav from '$lib/components/layout/MobileNav.svelte';
  import { page } from '$app/stores';
  
  const navItems = [
    { label: 'Dashboard', href: '/app/dashboard', icon: '📊', badge: 5 },
    { label: 'Tickets', href: '/app/tickets', icon: '🎫' },
    { label: 'Projects', href: '/app/projects', icon: '📁' },
    { label: 'Settings', href: '/app/settings', icon: '⚙️' }
  ];
</script>

<MobileNav 
  items={navItems} 
  currentPath={$page.url.pathname}
  siteName="MostlyWhat"
>
  <!-- Desktop nav content in slot -->
  <slot />
</MobileNav>
```

### Responsive Table

```svelte
<script>
  import ResponsiveTable from '$lib/components/layout/ResponsiveTable.svelte';
  
  const columns = [
    { key: 'id', label: 'ID', priority: 'high', width: '80px' },
    { key: 'name', label: 'Name', priority: 'high' },
    { key: 'email', label: 'Email', priority: 'medium' },
    { key: 'created', label: 'Created', priority: 'low', align: 'right' }
  ];
  
  const data = [
    { id: 1, name: 'John', email: 'john@example.com', created: '2024-01-01' }
  ];
</script>

<ResponsiveTable 
  {columns} 
  {data}
  mobileCardMode={true}
  emptyMessage="No records found"
>
  {#snippet cell({ column, item })}
    {#if column.key === 'id'}
      <a href="/admin/users/{item.id}">#{item.id}</a>
    {:else}
      {item[column.key]}
    {/if}
  {/snippet}
</ResponsiveTable>
```

### Mobile Form

```svelte
<script>
  import MobileForm from '$lib/components/layout/MobileForm.svelte';
  
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let priority = $state('medium');
</script>

<form>
  <MobileForm
    label="Name"
    name="name"
    bind:value={name}
    required={true}
    placeholder="Enter your name"
  />
  
  <MobileForm
    label="Email"
    name="email"
    type="email"
    bind:value={email}
    required={true}
    hint="We'll never share your email"
  />
  
  <MobileForm
    label="Priority"
    name="priority"
    type="select"
    bind:value={priority}
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </MobileForm>
  
  <MobileForm
    label="Message"
    name="message"
    type="textarea"
    bind:value={message}
    required={true}
  />
  
  <button type="submit">Submit</button>
</form>
```

---

## Form Actions (Server-Side)

### Split Ticket Action

```typescript
// In +page.server.ts
import { splitTicket } from '$lib/server/ticket-relationships';

export const actions = {
  splitTicket: async ({ request, locals }) => {
    const data = await request.formData();
    const sourceTicketId = data.get('ticketId');
    
    // Parse new tickets from form data
    const newTickets = JSON.parse(data.get('newTickets'));
    
    const result = await splitTicket({
      sourceTicketId,
      splitById: locals.profile.id,
      newTickets
    });
    
    if (result.success) {
      return { success: true, newTicketIds: result.newTicketIds };
    }
    
    return { error: result.error };
  }
};
```

### Link Tickets Action

```typescript
// In +page.server.ts
import { linkTickets } from '$lib/server/ticket-relationships';

export const actions = {
  linkTicket: async ({ request, locals }) => {
    const data = await request.formData();
    
    const result = await linkTickets({
      sourceTicketId: data.get('sourceTicketId'),
      targetTicketId: data.get('targetTicketId'),
      linkType: data.get('linkType'),
      createdById: locals.profile.id
    });
    
    return result;
  }
};
```

---

## Testing Checklist

### Ticket Features
- [ ] Split a ticket into 2+ new tickets
- [ ] Verify parent-child relationship is created
- [ ] Link two tickets with different link types
- [ ] Verify bidirectional link comments
- [ ] Unlink tickets and verify audit trail
- [ ] Test all 6 link types

### Project Features
- [ ] Create internal note on project
- [ ] Update project note
- [ ] Delete project note
- [ ] View timeline with 3+ milestones
- [ ] Verify timeline auto-adjusts date range
- [ ] Test milestone status colors

### Reports
- [ ] Export ticket metrics to CSV
- [ ] Export staff performance to CSV
- [ ] Export comprehensive PDF report
- [ ] Verify CSV special characters are escaped
- [ ] Verify PDF formatting

### Stripe
- [ ] Create payment intent
- [ ] Complete checkout session
- [ ] Verify webhook updates invoice
- [ ] Test refund processing
- [ ] Verify email notifications

### Mobile
- [ ] Test mobile navigation on phone
- [ ] Verify tables convert to cards
- [ ] Test form inputs are 48px+ tall
- [ ] Verify no iOS zoom on input focus
- [ ] Test responsive breakpoints

---

## Common Issues & Solutions

### Ticket Splitting
**Issue:** Comments not transferred  
**Solution:** Ensure `commentIdsToTransfer` array contains valid comment IDs

### Stripe Integration
**Issue:** Webhook signature verification fails  
**Solution:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

### Mobile Forms
**Issue:** iOS zooms on input focus  
**Solution:** Ensure font-size is 16px or larger

### Export Reports
**Issue:** CSV contains garbled characters  
**Solution:** Excel needs UTF-8 BOM. Update export function to add BOM

---

## Performance Tips

1. **Ticket Links:** Index on `source_ticket_id` and `target_ticket_id`
2. **Project Notes:** Index on `project_id` and `created_at`
3. **Stripe:** Cache customer lookups
4. **Exports:** Generate in background for large datasets
5. **Timeline:** Limit to 50 milestones for performance

---

## Security Considerations

1. **Ticket Splitting:** Verify user has permission on source ticket
2. **Ticket Linking:** Ensure both tickets belong to user's organization
3. **Project Notes:** Staff-only access, verify role
4. **Stripe:** Always validate amounts server-side
5. **Exports:** Rate limit export requests

---

This quick reference guide covers all newly implemented features. For more details, see `IMPLEMENTATION_COMPLETE.md`.
