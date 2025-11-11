import { useAuth } from "../context/UserData"
function Settings() {
    const { user } = useAuth()
    return (
        <>
            <h1>hello</h1>
            {user ? (
                <>
                    <h1>{user.name}</h1>
                    <h1>{user.userEmail}</h1>
                </>
            ) :
                (
                    <p>No info found</p>
                )
            }
        </>)

}

export default Settings