import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function enableRLS() {
    console.log('Enabling RLS on all tables with service-role-only access...\n');

    const tables = [
        'profiles',
        'organizations',
        'organization_members',
        'projects',
        'proposals',
        'invoices',
        'payments',
        'tickets',
        'ticket_comments',
        'activity_log',
        'file_uploads'
    ];

    for (const table of tables) {
        try {
            // Enable RLS
            await sql.unsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`);
            console.log(`✓ Enabled RLS on ${table}`);

            // Drop existing policies
            const policies = await sql`
				SELECT policyname FROM pg_policies WHERE tablename = ${table}
			`;

            for (const policy of policies) {
                await sql.unsafe(`DROP POLICY IF EXISTS "${policy.policyname}" ON "${table}"`);
                console.log(`  - Dropped policy: ${policy.policyname}`);
            }

            // Create restrictive policy (blocks all client access, service_role bypasses RLS)
            await sql.unsafe(`
				CREATE POLICY "service_role_only" ON "${table}" 
				FOR ALL 
				USING (false) 
				WITH CHECK (false)
			`);
            console.log(`  + Created service_role_only policy`);

        } catch (err) {
            console.error(`✗ Error on ${table}:`, err.message);
        }
    }

    console.log('\n✓ RLS setup complete. Only service_role can access the database.');
    await sql.end();
}

enableRLS().catch(console.error);
