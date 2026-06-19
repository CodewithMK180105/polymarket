import { useSupabase } from "./hooks/useSupabase";
import { useUser } from "./hooks/useUser"

function App() {

  const {claims}=useUser();
  const supabase=useSupabase();

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
    </div>
  )
}

export default App
