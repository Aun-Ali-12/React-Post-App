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
            <h2>hello: {userData.name}</h2>
            <h2 className="text-lg text-gray-700">your email is: {userData.userEmail}</h2>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
                <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                    Hello: {userData.name}
                </h2>
                <h2 className="text-lg font-medium bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg">
                    Your email is: {userData.userEmail}
                </h2>
            </div>
        </>
    )
}
export default UserData