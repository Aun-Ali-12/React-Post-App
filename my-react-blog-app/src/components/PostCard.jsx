import { useState, useEffect } from "react"
import { supabase } from "../SupabaseClient"
import { usePost } from "../pages/Context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisH, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

function PostCard({ type, compact, onEdit }) {
    const [post, setPost] = useState([]) //state which stores only userspecific data
    const [postId, setPostId] = useState(null) //state which will store id 
    const [menuOpen, setMenuOpen] = useState(false)
    const [seeMore, setSM] = useState(false)
    const [seeMoreId, setSeeMoreId] = useState(null)
    const { setEditingPost } = usePost()


    useEffect(() => {
        const fetchPosts = async () => {
            if (type === "profile") {
                await UserSpecificPost()
            } else if (type === "feed") {
                await allPost()
            }
        }
        fetchPosts()
    }, [type])


    //Shows Posts of Loggedin User:
    async function UserSpecificPost() {
        //fetching user id 
        const { data: { session } } = await supabase.auth.getSession()
        let userId = session.user.id
        try {

            const { data: postId, error } = await supabase
                .from('react_blogapp')
                .select(`id, 
                    user_posturl, 
                    user_posttext, 
                    user_info
                    (user_name,
                     user_profile)`)
                .eq("user_id", userId)
            !postId ? console.log(error) : (console.log(),
                setPost(postId))
        }
        catch (err) {
            console.log("Error while fetching userspecific post");
        }
    }

    //function to show all user's post:
    async function allPost() {
        try {

            const { data: allPosts, error } = await supabase
                .from('react_blogapp')
                .select(`id, 
                    user_posturl, 
                    user_posttext, 
                    user_info
                    (user_name,
                     user_profile)`)

            !allPosts ? console.log(error) : setPost(allPosts)
        }
        catch (err) {
            console.log("Error while fetching all post");
        }
    }

    //Del function
    const handleDel = async (id) => {
        console.log("del", id);
        try {
            const { error } = await supabase
                .from('react_blogapp')
                .delete()
                .eq('id', id)
            if (error) {
                toast.error(error)
                return
            }
            toast.success("✅ Post deleted successfully")
            setPost(prev => prev.filter(p => p.id !== id))
        }
        catch (err) {
            alert(err)
        }
    }


    //edit function:
    const handleEdit = (value) => {
        setEditingPost(value)
    }

    //see more function:
    const seeMoreFunc = (id) => {
        setSeeMoreId(id)
        setSM(!seeMore)
    }


    return (
        <>
            <div className="flex justify-center mb-5 mt-1 lg:ml-[27vw]">
                {/* post will be shown here */}
                <div className={`${type === "profile"
                    ? "grid grid-cols-1 gap-2 p-10 w-[90vw] md:grid-cols-2 gap-2 lg:grid-cols-3 gap-2 lg:w-[70vw] object-cover"
                    : "flex flex-col items-center gap-5 p-4 w-[90vw] lg:w-[70vw]"
                    } animate-fadeInUp lg:bg-gray-100 rounded-lg shadow-md border border-[#0866FF]`}>

                    {post && post.map((value) => (
                        !compact && (
                            <div
                                key={value.id}
                                className="relative flex flex-col gap-2 p-5 border-2 border-[#0866FF] rounded-xl"
                            >
                                {/* User Info + Menu Btn  */}
                                <div className="flex items-center justify-between gap-5">

                                    <div className="flex items-center gap-2">
                                        <img
                                            className="w-14 h-14 rounded-full border border-[#0866FF]"
                                            src={value.user_info.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"}
                                            alt=""
                                        />

                                        <p>{
                                            value.user_info?.user_name}</p>
                                    </div>

                                    {/* MENU BUTTON */}
                                    <button
                                        onClick={() => {
                                            setPostId(value.id);
                                            setMenuOpen((prev) => !prev);
                                        }}
                                    >
                                        <FontAwesomeIcon className="text-[#0866FF]" icon={faEllipsisH} />
                                    </button>
                                </div>


                                {/* --- Post Content --- */}
                                <div className="">
                                    <img src={value.user_posturl} alt="post" className={`${type === "feed" ? "lg:max-w-sm" : ""}`} />
                                    {

                                    }

                                    {/* shows full text if seeMoreId has id other than if null than short text  */}
                                    <div className="lg:w-[30vw]">
                                        <p>
                                            {seeMoreId === value.id ? value.user_posttext : `${value.user_posttext.slice(0, 15)}...`}
                                        </p>
                                    </div>
                                    <p>{value.user_posttext.length > 15 && (
                                        //onclick this btn (see more) id will be set in seeMoreId so that whole text with see less btn will be showed and if already id is set then seeMoreId will set back to null with see more btn
                                        <button className="text-sm underline text-blue-600" onClick={() => { setSeeMoreId(seeMoreId === value.id ? null : value.id) }}>{seeMoreId === value.id ? "See less" : "See more"}</button>
                                    )}</p>

                                </div>

                                {/* --- MENU DROPDOWN --- */}
                                {postId === value.id && menuOpen && (
                                    <ul className={`absolute right-2 top-10 py-4 px-6 bg-gray-100 shadow border border-[#0866FF] rounded animate-leftSlide`}>
                                        {type === "profile" ? (
                                            <>
                                                <li
                                                    className="cursor-pointer text-[#0866FF] hover:underline"
                                                    onClick={() => { handleEdit(value); onEdit(); setMenuOpen(false) }}
                                                >
                                                    Edit
                                                </li>

                                                <li
                                                    className="cursor-pointer text-[#0866FF] hover:underline"
                                                    onClick={() => handleDel(value.id)}
                                                >
                                                    Delete
                                                </li>
                                            </>
                                        ) : (
                                            <li className="cursor-pointer text-[#0866FF] hover:underline">
                                                Share
                                            </li>
                                        )}

                                        <button
                                            onClick={() => setMenuOpen(false)}
                                            className="mt-3"
                                        >
                                            <FontAwesomeIcon className="text-[#0866FF]" icon={faCircleXmark} />
                                        </button>
                                    </ul>
                                )}
                            </div>
                        )
                    ))}
                    {post && post.length > 0 ? (
                        compact && post.map((value) => (
                            <div key={value.id} className="">
                                <img src={value.user_posturl} alt="post" width="200" className="lg:w-[23vw]" /><br />
                            </div>
                        ))) : (<p>No post found</p>)
                    }
                </div>
            </div >
        </>
    )

}
export default PostCard
