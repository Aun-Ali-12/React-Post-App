import { Link } from "react-router-dom"
import MobileNav from "../components/MobileNav"
import UploadPost from "../components/PostForm"
import PostCard from "../components/PostCard"
import { PostProvider } from "./Context"
import BlogLogo from "../components/Logo"


function Feed() {
    return (
        <>
            <PostProvider>
                <BlogLogo/>
                {/* <UploadPost/> */}
                <PostCard type="feed" compact={false} />
            </PostProvider>
        </>
    )
}
export default Feed