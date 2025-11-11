import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../SupabaseClient"


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                // checking user session to render user details on profile page 
                const { data: { session } } = await supabase.auth.getSession()
                if (!session?.user) {
                    setLoading(false)
                    return
                }

                //fetching user details
                const { data, error } = await supabase.auth.getSession()
                if (!data) {
                    alert(error.message)
                    return
                }
                setUser({
                    name: data.session.user.user_metadata.user_name || 'No name found',
                    userEmail: data.session.user.user_metadata.email || 'No email found'
                })

            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        }
        fetchUserInfo()
    }, [])


    return (
        <AuthContext.Provider value={{user , loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
