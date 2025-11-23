import MobileNav from "../components/MobileNav"
import UserData from "../components/UserData"
import Verify from "../components/Verify"
import UploadPost from '../components/PostForm'
import PostCard from "../components/PostCard"
import UploadProfile from "../components/ProfilePicture"
import { PostProvider } from "./Context"
import BlogLogo from "../components/Logo"
import { useRef } from "react"
function Profile() {
const formRef = useRef(null) //reference of form 

const goToForm = () => {
    formRef.current?.scrollIntoView({
        behavior: "smooth", 
        block: "start"
    })
}

    return (
        <>
            <Verify />
            <BlogLogo />
            <UploadProfile />
            <UserData />
            <PostProvider>
                <div ref={formRef}>
                <UploadPost />
                </div>
                <PostCard onEdit={goToForm} type="profile" />
            </PostProvider>
        </>
    )
}
export default Profile