import { useEffect, useState } from "react"
import { useAuth } from "../context/UserData"
import { supabase } from "../SupabaseClient"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOut } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"

function Settings() {
    const { user, updateUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [editName, setEditName] = useState("")
    const [status, setStatus] = useState(false)
    const navigate = useNavigate() //to relocate user to any specific page after clicking btn

    useEffect(() => {
        if (user?.name) {
            setEditName(user.name)
        }
    }, [user])

    //logout function
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

    const handleChange = async () => {
        setStatus(true)
        let splitEditName = editName.trim().split(" ")

        let formatName = (splitEditName.map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(" "))

        try {
            if (!user) return
            const { error } = await supabase
                .from('user_info')
                .update({ user_name: formatName })
                .eq("user_id", user.id)
            if (error) {
                alert(error.message)
                return
            }
            updateUser({ name: formatName })
            setStatus(false)
        }
        catch (err) {
            alert(err, "Issue in updating name")
        }
    }

    return (
        <>
            <div className="flex flex-col mb-10 items-center justify-between lg:ml-[27vw] animate-fadeInUp">
                {/* userCurrent info  */}
                <div>
                    <h1 className="bg-gray-100 w-[90vw] rounded p-5 text-xl text-[#0866FF] font-lighter lg:w-[70vw]">Settings</h1>
                    {user ? (
                        <>
                            <div className="bg-gray-100 w-[90vw] h-screen mt-2 rounded p-5 font-lighter lg:w-[70vw]">
                                <h1 className="text-3xl text-gray-700 capitalize">User information</h1><br />
                                <div className="text-xl text-[#0866FF]">
                                    <p><span className="capitalize">User name:</span> {user.name}</p>
                                    <p><span className="capitalize">User email:</span> {user.userEmail}</p>
                                </div>
                                {/* To change info  */}
                                <div className="mt-4"></div>
                                <div>
                                    <h1 className="capitalize text-3xl">Change your info</h1><br />
                                    <div>
                                        <label htmlFor="" className="capitalize flex items-center gap-3 w-full mb-4">your name: <input type="text" value={editName} onChange={(e) => { setEditName(e.target.value) }} className="outline-none border-2 border-gray-300 w-full rounded px-2 py-1 text-md focus:outline-none focus:border-blue-500 transition-all duration-300" /><button className="bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600 transition-all capitalize" onClick={handleChange} disabled={status}>{status ? "updating..." : "update"}</button></label>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <p>No info found</p>
                        )
                    }
                    <div className="lg:w-[70vw] bg-gray-100">
                        <button onClick={handleLogout} disabled={loading} className="flex items-center gap-4 text-lg p-2 hover:bg-red-500 hover:text-white rounded w-[70vw] transition"><FontAwesomeIcon icon={faSignOut} className="text-[#0866FF] text-xl" /> {loading ? "Logging out..." : "Logout"}</button>
                    </div>
                </div>
            </div>
        </>)

}

export default Settings