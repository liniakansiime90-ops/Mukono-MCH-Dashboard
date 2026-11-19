
/*
 Lesson 16: Supabase connection
 Mukono MCH Academic Dashboard
*/

const SUPABASE_URL = "https://qkglxrrffjcsmtzuopud.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_SOH4_5Y8ttMw1TuC0OMCFA_X7FXFtxk";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("Supabase client initialised.");
