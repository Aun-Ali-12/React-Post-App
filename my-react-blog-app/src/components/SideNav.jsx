import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"
import { useState } from "react"

function SideNavbar() {
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate() //to relocate user to any specific page after clicking btn
    const location = useLocation() //to highlight link

    //Links:
    const navElements = [
        {
            path: '/profile', label: 'Profile', icon: 'no'
        },
        {
            path: '/feed', label: 'Home', icon: 'no'
        }, {
            path: '/settings', label: 'Settings', icon: 'no'
        }
    ]
    const handleLogout = async (e) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) {
                alert(error.message)
                setLoading(false)
                return
            }
            navigate("/")
        }
        catch (err) {
            alert(err)
        }
    }

    return (
        <>
            {/* <Link to='/profile'>Home</Link>
            <Link to='/feed'>Feed</Link> */}
            <div>
                {navElements.map((items) => (
                    <Link key={items.path} to={items.path}>
                        {items.icon}<span>{items.label}</span>
                    </Link>
                ))
                }
                <button onClick={handleLogout} disabled={loading}>{loading ? "Logging out..." : "Logout"}</button>
            </div>
        </>
    )

}
export default SideNavbar