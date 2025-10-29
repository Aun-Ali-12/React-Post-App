import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
function UploadProfile() {
    const [profilePic, setProfilePic] = useState("")
    const [renderProfile, setRenderProfile] = useState("")

    // uploading profile picture:
    useEffect(() => {
        fetchProfile()
    }, [renderProfile])


    const UploadPic = async () => {
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
            console.log(err);
        }
    }

    return (
        <>
            <br />
            <label htmlFor="">Add your picture:<input type="file" name="" id="" onChange={(e) => { setProfilePic(e.target.files[0]) }} /></label>
            <button onClick={UploadPic}>Add</button>

            {/* render photo here */}
            {renderProfile && (
                <>
                    < img src={renderProfile.user_profile || "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"} alt="" width={"190px"} height={"190px"} />
                    <p>{renderProfile.user_name}</p>
                </>
            )
            }
        </>
    )
}
export default UploadProfile