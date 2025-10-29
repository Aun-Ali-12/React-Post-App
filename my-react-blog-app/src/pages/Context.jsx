import { createContext, useContext, useState } from "react";

const PostContext = createContext()

export const PostProvider = ({children}) => {
const [editingPost, setEditingPost] = useState(null)

    return(
    <>
    <PostContext.Provider value={{editingPost, setEditingPost}}>
        {children}
    </PostContext.Provider>
    </>
)
}
export const usePost = () => useContext(PostContext) 