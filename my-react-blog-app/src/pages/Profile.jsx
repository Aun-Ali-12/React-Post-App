import MobileNav from "../components/MobileNav"
import UserData from "../components/UserData"
import Verify from "../components/Verify"
import UploadPost from '../components/PostForm'
import PostCard from "../components/PostCard"
import UploadProfile from "../components/ProfilePicture"
import { PostProvider } from "./Context"
import BlogLogo from "../components/Logo"

function Profile(){
return(
    <>
    <Verify/>
    <BlogLogo/>
    <UploadProfile/>
    <UserData/>
    <PostProvider>
    <UploadPost/>
    <PostCard type = "profile" compact={true}/>
    </PostProvider>
    </>
)
}
export default Profile