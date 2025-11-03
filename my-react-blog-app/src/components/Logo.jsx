import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

function BlogLogo() {
    return (
        <>
            <div className="flex items-center border-2 mb-4 text-[#0866FF] p-3 bg-gray-50 shadow">
                <FontAwesomeIcon icon={faGlobe} className="text-3xl" />
                <h1 className="text-[#0866FF] text-2xl font-bold">Blogify</h1>
            </div>
        </>
    )
}

export default BlogLogo