
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";    
import {cookies} from "next/headers";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

//client side client  (for react components like login and logout)
export const supabaseClient = createClientComponentClient();

//sever siode client (for api routes/middleware)

// this auto uses env vars for browser safe client. server one uses cookies for secure sessions(jwt tokens storaed as httponly cookies which prevents xss attacks)
export function createServerSupabase() {
    return createServerComponentClient({ cookies });
}