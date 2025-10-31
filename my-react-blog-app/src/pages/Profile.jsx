import MobileNav from "../components/MobileNav"
import UserData from "../components/UserData"
import Verify from "../components/Verify"
import UploadPost from '../components/PostForm'
import PostCard from "../components/PostCard"
import UploadProfile from "../components/ProfilePicture"
import { PostProvider } from "./Context"

function Profile(){
return(
    <>
    <Verify/>
    <UploadProfile/>
    <UserData/>
    <PostProvider>
    <UploadPost/>
    <PostCard type = "profile"/>
    </PostProvider>
    </>
)
}
export default Profile