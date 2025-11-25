import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import { toast } from "react-toastify"

function UploadProfile() {
    const [profilePic, setProfilePic] = useState("")
    const [renderProfile, setRenderProfile] = useState("")
    const [postCount, setPostCount] = useState(null) //stores post count

    // uploading profile picture:
    useEffect(() => {
        fetchProfile()
    }, [])
    
    useEffect(() => {
        fetchPostCount()
    }, [])

    const UploadPic = async (e) => {
        let profilePic = e.target.files[0]
        const { data } = await supabase.auth.getSession()
        let userId = data.session.user.id
        let folder = `public/${userId}-${Date.now()}`
        //1. uploading picture into buckett
        try {
            const { data: uploadprofile, error } = await supabase
                .storage
                .from('Profile_pic')
                .upload(`${folder}`, profilePic)

            if (!uploadprofile) {
                console.log(error.message)
                return
            }
            console.log(uploadprofile);
        }
        catch (err) {
            console.log(err);
        }

        //2. fetching pic from bucket:
        try {
            const { data: getUrl, error } = supabase
                .storage
                .from('Profile_pic')
                .getPublicUrl(`${folder}`)

            //url which will be stored in user_info table in profile_pic column
            let profileUrl = getUrl.publicUrl

            try {
                //flow to add url(profile pic) into user_info table
                const { data: insertUrl, error } = await supabase
                    .from('user_info')
                    .update({ user_profile: profileUrl })
                    .eq("user_id", userId)
                    .select()
                !insertUrl ? console.log(error.message) : console.log(insertUrl);
            } catch (err) {
                console.log(err);
            }

        } catch (err) {
            console.log(err);
        }
    }
    async function fetchProfile() {
        //fetch to show profile pic:
        const { data } = await supabase.auth.getSession()
        let userId = data.session.user.id
        try {
            const { data: profilePicture, error } = await supabase
                .from('user_info')
                .select("user_name, user_profile")
                .eq("user_id", userId)
                .single()
            if (!profilePicture) {
                console.log(error.message);
                return
            }
            setRenderProfile(profilePicture)
        }
        catch (err) {
            alert(err)
        }
    }
    fetchProfile()

    //fetch userPostCount:
    async function fetchPostCount() {
        //getting user session
        const { data } = await supabase.auth.getSession()
        let userId = data.session.user.id
        console.log(userId);

        //getting count by comparing the id we have:
        try {
            const { data, count, error } = await supabase
                .from('react_blogapp')
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)

            if (error) {
                console.log(error.message);
                return
            }
            setPostCount(count)
            console.log(postCount);

        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>

            {/* input which is linked to upload label to upload profile  */}
            <input type="file" name="" id="profilePic" className="hidden" onChange={UploadPic} />

            {/* render photo here */}
            {renderProfile && (
                <>
                    <div className="flex justify-center lg:ml-[27vw]">
                        <div className="flex items-center bg-gray-50 rounded-lg shadow-md justify-around p-5 border border-[#0866FF] w-[90vw] lg:w-[70vw] lg:mt-1 shadow-md">
                            <div>
                                {/* profile picture */}
                                <div className="flex flex-col items-center space-y-2">
                                    <img className="rounded-full border border-blue-500 lg:border-2" src={renderProfile.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"} alt="" width={"190px"} height={"190px"} />
                                    <label htmlFor="profilePic" className="bg-[#0866FF] rounded-lg p-2 text-sm text-white">Upload</label>
                                    <p className="font-semibold text-sm md:text-md lg:text-lg">{renderProfile.user_name}</p>
                                </div>
                            </div>
                            {/* post follower following  */}
                            <div>
                                <ul className="flex items-center pb-10 m-5 gap-5 capitalize font-semibold">
                                    <li className="flex flex-col items-center text-sm md:text-lg lg:text-lg"><p>posts</p>{postCount}</li>
                                    <li className="flex flex-col items-center text-sm md:text-lg lg:text-lg"><p>followers</p> 10</li>
                                    <li className="flex flex-col items-center text-sm md:text-lg lg:text-lg"><p>following</p> 10</li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </>
            )
            }
        </>
    )
}
export default UploadProfile