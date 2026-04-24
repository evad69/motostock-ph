import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(filename) {
  const filePath = path.join(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function findUserByEmail(supabase, email) {
  let page = 1;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });

    if (error) {
      throw error;
    }

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email.toLowerCase()
    );

    if (user) {
      return user;
    }

    if (data.users.length < 1000) {
      return null;
    }

    page += 1;
  }
}

async function upsertAdminProfile(supabase, userId, fullName) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      role: "admin",
    },
    { onConflict: "id" }
  );

  if (error) {
    throw error;
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const email = getRequiredEnv("SEED_ADMIN_EMAIL");
  const password = getRequiredEnv("SEED_ADMIN_PASSWORD");
  const fullName = process.env.SEED_ADMIN_FULL_NAME?.trim() || "Admin";

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  let user = await findUserByEmail(supabase, email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
    console.log(`Created auth user for ${email}.`);
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        full_name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    user = data.user;
    console.log(`Updated existing auth user for ${email}.`);
  }

  await upsertAdminProfile(supabase, user.id, fullName);
  console.log(`Admin profile is ready for ${email}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
