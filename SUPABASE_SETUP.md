# Supabase CLI Setup & Deployment Guide

This project uses PostgreSQL on Supabase for authentication, roles, and user management. You already have the SQL scripts (`DATABASE_SCHEMA.sql`, `AUTH_SCHEMA.sql`, `ADMIN_USER_SETUP.sql`) ready for execution. The following steps show how to connect the Supabase CLI, apply the schema, seed the admin user, and manage the database going forward.

> **Note:** these commands must be run on your local machine (or CI) where you have the Supabase CLI installed. The AI assistant cannot execute them automatically.

---

## 1. Install the Supabase CLI

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# Linux (npm)
npm install -g supabase

# Windows (Chocolatey)
choco install supabase
```

Verify installation:

```bash
supabase --version
```

---

## 2. Log in and link your project

```bash
# authenticate with your Supabase account
supabase login

# in the repository root, initialize or link to an existing project
docker run --rm -it -v "$PWD":/local -w /local supabase/cli:latest supabase init

# if you already have a Supabase project ID, run:
supabase link --project-ref your-project-ref
```

The command will create a `supabase/config.toml` file containing the project reference and local settings.

---

## 3. Create migrations & apply schema

We already have full SQL files, but you may prefer to split them into migrations for version control. For simplicity you can run the monolithic scripts directly:

```bash
# from workspace root
supabase db remote set "<your-supabase-db-url>"

# execute the complete schema
supabase db query < DATABASE_SCHEMA.sql

# or run auth-only schema if you prefer
supabase db query < AUTH_SCHEMA.sql
```

To create proper migrations, you can generate files:

```bash
supabase db diff ./migrations/20260227_init.sql
```

Then apply them with:

```bash
supabase db push
```

---

## 4. Seed the admin user

After the schema is in place, run the admin setup script:

```bash
supabase db query < ADMIN_USER_SETUP.sql
```

You can verify the user by querying:

```sql
SELECT id, name, email, role FROM users WHERE email = 'admin@almadeenastock.com';
```

---

## 5. Manage RLS and functions

The schema scripts already enable RLS policies and create helper functions. If you need to modify them, edit a migration or run `supabase db query` with the altered SQL.

---

## 6. Development workflow

When you change the database schema:

1. Create a new migration:
   ```bash
   supabase migration new add_new_table
   ```
2. Edit the generated SQL in `supabase/migrations/<timestamp>_add_new_table.sql`.
3. Push the migration:
   ```bash
   supabase db push
   ```
4. Run seeds if needed:
   ```bash
   supabase db seed run
   ```

---

## 7. Local development (optional)

You can run a local Postgres instance with Supabase emulation:

```bash
supabase start
```

This spins up a local database and realtime server. After starting, the config file will contain the local connection string, and you can apply migrations locally with the same `supabase db` commands.

---

## 8. CI/CD Integration

Add the following to your CI pipeline (GitHub Actions, etc.) to automatically deploy whenever you push to `main`:

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: supabase/actions@v1
    with:
      args: db push --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    env:
      SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## 9. Troubleshooting

- **Unable to connect**: Check `supabase/config.toml` and your `SUPABASE_URL`/`SUPABASE_KEY`.
- **Permission denied**: Ensure your access token has the `service_role` role to run DDL.
- **Migration conflict**: Use `supabase db reset` locally to start fresh.

---

## 10. Next steps

- Integrate Supabase SDK into the frontend (`@supabase/supabase-js`) for auth & CRUD.
- Replace mock data in `UserManagement.tsx` with real API calls.
- Test admin login and user creation against the live database.

Happy building! 🚀