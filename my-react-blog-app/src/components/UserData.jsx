import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"


//Data which'll be rendered onto profile page 
function UserData() {
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState(
        {
            name: '',
            userEmail: ''
        }
    )

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
                setUserData({
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


    if (loading) return <p>Loading...</p>
    return (
        <>
            <h1>hello: {userData.name} <br />
                Your email is: {userData.userEmail}
                </h1>
        </>
    )
}
export default UserData