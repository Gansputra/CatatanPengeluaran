const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL)
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY?.slice(0, 10))

module.exports = supabase;