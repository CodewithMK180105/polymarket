import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useUser } from "./hooks/useUser"
import { useState } from "react";

function App(){
  const [supabase, _setSupabase]= useState(createClient("https://oljprmqrtevlseoushbu.supabase.co", "sb_publishable__t45A4rZiR53nLv8ifYGbA_1_Lo9GVY"));
  return <AppWrapper supabase={supabase} />
}

function AppWrapper({supabase}: {supabase: SupabaseClient}) {

  const {claims}=useUser(supabase);

  return (
    <div>
      {window.solflare && !claims && <button onClick={async () => {
        await supabase.auth.signInWithWeb3({
          chain: "solana",
          statement: "I confirm I want to sign in into the prediction market",
          wallet: window.solflare
        })
      }}>
        Sign in with Solana
      </button>}

      {claims && <button
        onClick={async()=>{
          await supabase.auth.signOut()
        }}
      >
        LogOut
      </button>}

      {JSON.stringify(claims)}

      <button
          onClick={async () => {
              try {
                  const { data } = await supabase.auth.getSession();

                  const token = data.session?.access_token;

                  const response = await fetch("http://localhost:3000/buy", {
                      method: "POST",
                      headers: {
                          Authorization: token || "",
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({}),
                  });

                  const result = await response.json();
                  console.log(result);
              } catch (error) {
                  console.error(error);
              }
          }}
      >
          Click here to buy
      </button>
      
    </div>
  )
}

export default App
