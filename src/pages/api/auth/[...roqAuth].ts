import { createClient } from '@supabase/supabase-js';
import { RoqAuth } from '@roq/nextjs';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { generateFakeDataUtil } from 'server/utils';
import { Pool } from 'pg';

// Initialize the Supabase client with your Supabase URL and service role key
const supabaseUrl = process.env.SUPABASE_BASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL, // Your PostgreSQL database connection string
});

// Function to create a new table with a dynamic name
async function createTableForUser(userId) {
  const tableName = `user_${userId}`;

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (
      id bigserial,
      content text null,
      metadata jsonb null,
      embedding public.vector null,
      constraint "${tableName}_pkey" primary key (id)
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

// Function to create the match_documents function
async function createMatchDocumentsFunction(userId) {
  const functionName = `user_${userId}`;

  const createFunctionQuery = `
  create function "match_${functionName}" (
    query_embedding vector (1536),
    match_count int default null,
    filter jsonb default '{}'
  ) returns table (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
  ) language plpgsql as $$
  #variable_conflict use_column
  begin
    return query
    select
      id,
      content,
      metadata,
      1 - ("${functionName}".embedding <=> query_embedding) as similarity
    from "${functionName}"
    where metadata @> filter
    order by "${functionName}".embedding <=> query_embedding
    limit match_count;
  end;
  $$
  `;

  try {
    const client = await pool.connect();
    await client.query(createFunctionQuery);
    client.release();
  } catch (error) {
    console.error(`Error creating function ${functionName}:`, error);
  }
}

export default RoqAuth({
  hooks: {
    onRegisterSuccess: async ({ user }) => {
      roqClient.asSuperAdmin().notify({
        notification: {
          key: 'welcome',
          recipients: { userIds: [user.id] },
        },
      });

      const owner = await prisma.user.create({
        data: {
          roq_user_id: user.id,
          tenant_id: user.tenantId,
          email: user.email,
        },
      });

      let mainEntityId;
      let seedNumber = 0;

      if (user.roles.data.some((role) => ['Owner'].includes(role.name))) {
        const tenant = await roqClient.asSuperAdmin().tenant({ id: user.tenantId });
        const { name: tenantName } = tenant.tenant ?? {};
        seedNumber = await prisma.organization.count();
        const mainEntity = await prisma.organization.create({
          data: {
            tenant_id: user.tenantId,
            user_id: owner.id,
            name: tenantName,
          },
        });
        mainEntityId = mainEntity.id;

        // Create a new table in PostgreSQL using the pg library
        const tableName = `user_${user.id}`;
        await createTableForUser(user.id);

        // Create the match_documents function for the user
        await createMatchDocumentsFunction(user.id);
      }

      await generateFakeDataUtil(mainEntityId, user.tenantId, owner.id, seedNumber);
    },

    onLoginSuccess: async ({ user }) => {
      const existedUser = await prisma.user.findFirst({ where: { roq_user_id: user.id } });
      if (!existedUser) {
        const owner = await prisma.user.create({
          data: {
            roq_user_id: user.id,
            tenant_id: user.tenantId,
            email: user.email,
          },
        });

        // Create a table and the match_documents function for the user
        await createTableForUser(user.id);
        await createMatchDocumentsFunction(user.id);
      }
    },
  },
});