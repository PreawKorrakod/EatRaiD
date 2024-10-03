import React, { createContext, useState, useEffect } from 'react';
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY
export const supabase = createClient(supabaseUrl,supabaseKey);


export const General = createContext({});

function session(props) {
    const [session,setSession] =useState(null);

    useEffect(() => {
            supabase.auth.getSession().then(({ data: { user_session } }) => {
            setSession(user_session);
            console.log('this session.js',user_session)
        });
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        const currentSession = supabase.auth.session();
        setSession(currentSession);

        return () => subscription.unsubscribe();
      }, []);

      const value = {
        supabase_for_use: supabase,
        session: session,
        user: session?.user,
      };
      
      return (
        <General.Provider value={value}>
            {props.children}
        </General.Provider>
      );
    }

export default session;    