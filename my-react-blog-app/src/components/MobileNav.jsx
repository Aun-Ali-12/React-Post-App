import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";




function MobileNav() {
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate() //to relocate user to any specific page after clicking btn
    const location = useLocation() //to highlight link

    //Links:
    const navElements = [
        {
            path: '/profile', label: 'Profile', icon: <FontAwesomeIcon className="text-[#0866FF]" icon={faUser} />
        },
        {
            path: '/feed', label: 'Home', icon: <FontAwesomeIcon className="text-[#0866FF]" icon={faHome} />
        },
        {
            path: '/create', label: 'Create', icon: <FontAwesomeIcon className="text-[#0866FF]" icon={faPlus} />
        },
        {
            path: '/settings', label: 'Settings', icon: <FontAwesomeIcon className="text-[#0866FF]" icon={faCog} />
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
            <div className="flex justify-around p-1">
                {navElements.map((items) => (
                    <Link key={items.path} to={items.path}>
                        <div>{items.icon}</div>
                    </Link>
                ))
                }
            </div>
        </>
    )

}
export default MobileNav