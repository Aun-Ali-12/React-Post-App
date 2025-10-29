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
            {
                post && post.map((value) => (
                    <div key={value.id} >
                        <div>
                            <p>{value.user_info?.user_name}</p>
                            <img src={value.user_info.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"} alt="" width={"100px"} height={"100px"} />
                        </div>
                        <div>
                            <img src={value.user_posturl} alt="post" width="200" /><br />
                            {value.user_posttext}
                        </div>
                        <button onClick={() => { handleEdit(value) }}>Edit</button>
                        <button onClick={() => handleDel(value.id)}>Del</button>
                    </div>
                ))
            }
        </>
    )

}
export default PostCard