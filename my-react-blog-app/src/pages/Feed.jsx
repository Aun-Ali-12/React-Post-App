import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import UploadPost from "../components/PostForm"
import PostCard from "../components/PostCard"
import { PostProvider } from "./Context"


function Feed() {
    return (
        <>
        <Navbar/>
        <PostProvider>
        <UploadPost/>
        <PostCard type = "feed"/>
        </PostProvider>
        </>
    )
}
export default Feed