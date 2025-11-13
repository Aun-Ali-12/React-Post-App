import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faCog, faPlus, faGlobe, faSignOut } from "@fortawesome/free-solid-svg-icons";

function SideNavbar() {
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
        }, {
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
            <div className="h-screen flex flex-col items-start justify-between p-4">

                <div className="flex flex-col gap-10 text-xl w-full">

                    <div className="w-[100%]">
                        <div className="flex items-center gap-4 border-3 border-gray-900"><FontAwesomeIcon icon={faGlobe} className="text-5xl text-[#0866FF]" /><h1 className="font-bold text-2xl">Blogify</h1></div>
                        <div className="h-[2px] bg-[#0866FF] mt-3 w-[100%] rounded-full mx-auto"></div>
                    </div>
                    {navElements.map((items) => (
                        <Link className="flex gap-4 items-center" key={items.path} to={items.path}>
                            <div key={items} className="w-full flex items-center">
                                {items.icon}<div className="p-2 hover:bg-[#0866FF] hover:text-white rounded w-full transition">{items.label}</div>
                            </div>
                        </Link>
                    ))
                    }
                </div>
                <button onClick={handleLogout} disabled={loading} className="flex items-center gap-4 text-lg p-2 hover:bg-red-500 hover:text-white rounded w-full transition"><FontAwesomeIcon icon={faSignOut} className="text-[#0866FF] text-xl" /> {loading ? "Logging out..." : "Logout"}</button>
            </div>
        </>
    )

}
export default SideNavbar