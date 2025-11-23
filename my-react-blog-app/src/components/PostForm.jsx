import { useEffect, useState, useRef } from "react"
import { supabase } from "../SupabaseClient"
import { usePost } from "../pages/Context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';

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
            console.log(editingPost.user_posttext);

        } else {
            setPostFile(null)
            setPostText("")
        }
    }, [editingPost])

    const handleUpload = async () => {
        //fetching user id 
        const { data: { session } } = await supabase.auth.getSession()
        let userId = session.user.id

        //uploading file into buccket:
        let fileName = `public/${userId}-${Date.now()}`
        try {
            // Edit mode (update text or optionally replace image)
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

                //formats text 
                let userText = postText.trim().split(" ")
                let formatText = (userText.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ")

                // inserts editted img and text in db 
                const { error: updateErr } = await supabase
                    .from("react_blogapp")
                    .update({
                        user_posttext: formatText,
                        user_posturl: newImageUrl
                    })
                    .eq("id", editingPost.id)

                if (updateErr) console.log(updateErr)
                else toast.success("✅ Posted updated successfully");

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

            getUrl ? console.log(getUrl) : console.log("found no url");


            let imageUrl = getUrl.publicUrl

            //Inserts everything into DB table we took while uploading form:
            async function insertPost() {
                let userText = postText.trim().split(" ")
                let formatText = userText.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                try {
                    const { error } = await supabase
                        .from('react_blogapp')
                        .insert({ user_id: userId, user_posturl: imageUrl, user_posttext: formatText.join(" ") })

                    if (error) {
                        toast.error("something went wrong, try again!")
                        return
                    }

                    toast.success("✅ Posted successfully")
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
            <div className="flex justify-center lg:ml-[27vw]">
                <div className="bg-gray-100 border border-[#0866FF] p-3 mt-1 rounded-lg w-[90vw] lg:w-[70vw]">
                    {editingPost && editingPost.user_posturl && (
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col justify-center w-[50-vw]">
                                <p>Current Image Preview:</p>
                                <img
                                    src={editingPost.user_posturl}
                                    alt="Current Post"
                                    className="rounded w-[25vw]"
                                />
                            </div>
                            <button onClick={() => { window.location.reload() }}> <FontAwesomeIcon className="text-[#0866FF] hover:cursor-pointer" icon={faCircleXmark} /></button>
                        </div>
                    )}
                    <div className="flex flex-col items-center gap-2 w-full">
                        <textarea disabled={loading} value={postText} onChange={(e) => { setPostText(e.target.value) }} rows={4} name="" id="" placeholder="  What's in your mind?" className="w-[65vw] p-2 rounded-lg border border-gray-400 outline-none focus:outline-none focus:border-blue-500 transition-all duration-300"></textarea>
                        <button onClick={() => { fileInputRef.current.click() }} className="border border-gray-400 bg-white w-[65vw] py-4 rounded-lg text-[#0866FF] hover:bg-gray-100 transition">{postFile instanceof File ? (<img src={URL.createObjectURL(postFile)} alt="preview" className="rounded-lg w-40" />) : "Click to upload image"}</button>
                        <input className="hidden" disabled={loading} ref={fileInputRef} onChange={(e) => { setPostFile(e.target.files[0]) }} type="file" />
                        <button onClick={handleUpload} disabled={loading} className="border border-[#80B5FF] bg-[#80B5FF] w-[65vw] py-4 text-white text-lg rounded-lg hover:bg-[#0866FF] transition">{loading ? "Uploading" : editingPost ? "Update Post" : "Post"}</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UploadPost