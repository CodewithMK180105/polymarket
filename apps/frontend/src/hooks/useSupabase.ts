import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export function useSupabase(){
    const [supabase, setSupabase]= useState(createClient("https://oljprmqrtevlseoushbu.supabase.co", "sb_publishable__t45A4rZiR53nLv8ifYGbA_1_Lo9GVY"));

    return supabase;
}
