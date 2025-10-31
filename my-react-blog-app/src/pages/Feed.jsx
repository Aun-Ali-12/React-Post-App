import { Link } from "react-router-dom"
import MobileNav from "../components/MobileNav"
import UploadPost from "../components/PostForm"
import PostCard from "../components/PostCard"
import { PostProvider } from "./Context"


function Feed() {
    return (
        <>
            <PostProvider>
                {/* <UploadPost/> */}
                <PostCard type="feed" />
            </PostProvider>
        </>
    )
}
export default Feed