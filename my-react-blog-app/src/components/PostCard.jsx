import { useState, useEffect } from "react"
import { supabase } from "../SupabaseClient"
import { usePost } from "../pages/Context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsisH, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function PostCard({ type }) {
    const [post, setPost] = useState([]) //state which stores only userspecific data
    const [postId, setPostId] = useState(null) //state which will store id 
    const [menuOpen, setMenuOpen] = useState(false)
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
    }, [post])


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
                console.log(error);
                return
            }
            console.log("deleted successfully");
            setPost(prev => prev.filter(p => p.id !== id))
        }
        catch (err) {
            console.log(err);
        }
    }


    //edit function:
    const handleEdit = (value) => {
        setEditingPost(value)
    }


    return (
        <>
            {/* post will be shown here */}
            <div className={type === "profile" ? "grid grid-cols-1 py-20 md:grid grid-cols-2 gap-1 py-20 animate-fadeInUp rounded-lg shadow-md bg-gray-50 mt-5 border border-[#0866FF]" : "flex flex-col items-center gap-5 pb-20 animate-fadeInUp"}>
                {
                    post && post.map((value) => (
                        // over all post 
                        <div key={value.id} className="flex flex-col gap-2 w-fit p-5 border-2 border-[#0866FF] rounded-xl"  >
                            <div className="flex items-center justify-between gap-5 ">
                                {/* username and pic  */}
                                <div className="flex items-center gap-2">
                                    <img className="w-14 h-14 rounded-full border border-[#0866FF]" src={value.user_info.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"} alt="" width={"100px"} height={"100px"} />
                                    <p>{value.user_info?.user_name}</p>
                                </div>

                                {/* del and edit btn  */}
                                <div className="relative">
                                    <button onClick={() => { setPostId(value.id), setMenuOpen(!menuOpen) }}>
                                        <FontAwesomeIcon className="text-[#0866FF]" icon={faEllipsisH} />
                                    </button>
                                    {postId === value.id && menuOpen && (
                                        <div className="">
                                            <ul className={`absolute right-0 top-0 py-10 px-8 bg-gray-100 w-sm shadow border border-[#0866FF] rounded ${menuOpen? "animate-leftSlide": "animate-closeBtn"}`}>
                                                <li className="inline-block w-10 rounded text-[#0866FF] p-1 relative text-[#0866FF] cursor-pointer after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0866FF] after:transition-all after:duration-300 after:transform after:-translate-x-1/2 hover:after:w-full" onClick={() => { handleEdit(value) }}>Edit</li>
                                                <li className="inline w-10 rounded text-[#0866FF] p-1 relative text-[#0866FF] cursor-pointer after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0866FF] after:transition-all after:duration-300 after:transform after:-translate-x-1/2 hover:after:w-full" onClick={() => handleDel(value.id)}>Delete</li>
                                                <li className="inline-block w-10 rounded text-[#0866FF] p-1 relative text-[#0866FF] cursor-pointer after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0866FF] after:transition-all after:duration-300 after:transform after:-translate-x-1/2 hover:after:w-full" onClick={() => handleDel(value.id)}>Share</li>
                                                 <div>
                                                    <button onClick={() => { setMenuOpen(false) }}><FontAwesomeIcon className="text-[#0866FF] relative left-14 top-8" icon={faCircleXmark} /></button>
                                                </div>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <img src={value.user_posturl} alt="post" width="200" /><br />
                                <p>{value.user_posttext}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )

}
export default PostCard