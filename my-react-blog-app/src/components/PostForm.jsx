import { useEffect, useState, useRef } from "react"
import { supabase } from "../SupabaseClient"
import { usePost } from "../pages/Context"

function UploadPost() {
    const [postFile, setPostFile] = useState(null)
    const [postText, setPostText] = useState("")
    const [loading, setLoading] = useState(false)
    const { editingPost, setEditingPost } = usePost()
    const fileInputRef = useRef(null)



    useEffect(() => {
        if (editingPost) {
            setPostFile(editingPost.user_posturl || null)
            setPostText(editingPost.user_posttext || "")
        } else {
            setPostFile(null)
            setPostText("")
        }
    }, [editingPost])

    const handleUpload = async (e) => {

        //fetching user id 
        const { data: { session } } = await supabase.auth.getSession()
        let userId = session.user.id

        //uploading file into buccket:
        let fileName = `public/${userId}-${Date.now()}`
        try {
            // 🟢 Edit mode (update text or optionally replace image)
            if (editingPost) {
                // Agar nayi image choose ki hai to replace bhi kar dein:
                let newImageUrl = editingPost.user_posturl

                if (postFile instanceof File) {
                    const fileName = `public/${userId}-${Date.now()}`
                    const { error: uploadErr } = await supabase
                        .storage
                        .from("Post")
                        .upload(fileName, postFile)
                    if (uploadErr) throw uploadErr

                    const { data: getUrl } = supabase
                        .storage
                        .from("Post")
                        .getPublicUrl(fileName)
                    newImageUrl = getUrl.publicUrl
                }

                const { error: updateErr } = await supabase
                    .from("react_blogapp")
                    .update({
                        user_posttext: postText.trim(),
                        user_posturl: newImageUrl
                    })
                    .eq("id", editingPost.id)

                if (updateErr) console.log(updateErr)
                else console.log("✅ Post updated successfully")

                // Reset
                setEditingPost(null)
                setPostText("")
                setPostFile(null)
                fileInputRef.current.value = ""
                setLoading(false)
                return

            }
            if (!postFile) {
                alert("add something")
                return
            }
            setLoading(true)
            const { data, error } = await supabase
                .storage
                .from('Post')
                .upload(`${fileName}`, postFile)
            if (!error) {
                console.log(data);
            } else {
                console.log(error);
            }
        } catch (err) {
            console.log("error while uploading file")
        }

        try {
            //fetching file url from bucket
            const { data: getUrl } = supabase
                .storage
                .from('Post')
                .getPublicUrl(`${fileName}`)

            getUrl ? console.log(getUrl) : console.log("hai hi nai");


            let imageUrl = getUrl.publicUrl

            //Inserts everything into DB table we took while uploading form:
            async function insertPost() {
                let userText = postText.trim().split(" ")
                let formatText = userText.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                try {
                    const { error } = await supabase
                        .from('react_blogapp')
                        .insert({ user_id: userId, user_posturl: imageUrl, user_posttext: formatText.join(" ") })
                } catch (err) {
                    console.log("error while inserting post")
                }
            }
            insertPost() //insert post details in post table
        }
        catch (err) {
            console.log("error while getting pic url.");
        }
        setLoading(false)
        setPostFile(null)
        fileInputRef.current.value = ""
        setPostText("")
    }


    return (
        <>
            {/* 🔹 Show current image if editing */}
            {editingPost && editingPost.user_posturl && (
                <div>
                    <p>Current Image Preview:</p>
                    <img
                        src={editingPost.user_posturl}
                        alt="Current Post"
                        width="200"
                        style={{ borderRadius: "10px", marginBottom: "10px" }}
                    />
                </div>
            )}

            <label htmlFor="">Upload: <input disabled={loading} ref={fileInputRef} onChange={(e) => { setPostFile(e.target.files[0]) }} type="file" /></label><br />
            <label htmlFor="">Enter text: <input disabled={loading} value={postText} onChange={(e) => { setPostText(e.target.value) }} type="text" /></label><br />
            <button onClick={handleUpload} disabled={loading}>{loading ? "Uploading" : editingPost ? "Update Post" : "Upload"}</button>
        </>
    )
}
export default UploadPost