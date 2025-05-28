const { createClient } = require("@supabase/supabase-js");
// Tidak perlu require('dotenv') di sini jika sudah di-load di server.js paling atas

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Supabase URL or Service Role Key is missing. Check your .env file."
  );
}

// Menggunakan Service Role Key untuk operasi backend yang memerlukan hak akses penuh
// dan bisa melewati RLS. Hati-hati dalam penggunaannya.
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // autoRefreshToken: false, // Opsional, tergantung kebutuhan
    // persistSession: false    // Opsional, server-side tidak perlu persist session
  },
});

module.exports = supabase;
