import { useState, useEffect } from "react"
import { supabase } from "../SupabaseClient"
import { usePost } from "../pages/Context"

function PostCard({ type }) {
    const [post, setPost] = useState([]) //state which stores only userspecific data
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
            <div className="flex flex-col items-center mt-5 gap-5">
                {
                    post && post.map((value) => (
                        <div key={value.id} className="flex flex-col gap-2 w-fit p-5 border-2 border-gray-400 rounded-xl">
                            <div className="flex items-center justify-between gap-5">
                                {/* username and pic  */}
                                <div className="flex items-center gap-2">
                                    <img className="w-14 h-14 rounded-full border-2 border-blue-400" src={value.user_info.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"} alt="" width={"100px"} height={"100px"} />
                                    <p>{value.user_info?.user_name}</p>
                                </div>
                                {/* del and edit btn  */}
                                <div className="flex gap-2">
                                    <button className="bg-blue-400 w-10 rounded text-white p-1" onClick={() => { handleEdit(value) }}>Edit</button>
                                    <button className="bg-red-400 w-10 rounded text-white p-1" onClick={() => handleDel(value.id)}>Del</button>
                                </div>
                            </div>
                            <div>
                                <img src={value.user_posturl} alt="post" width="200" /><br />
                                {value.user_posttext}
                            </div>

                        </div>
                    ))
                }
            </div>
        </>
    )

}
export default PostCard