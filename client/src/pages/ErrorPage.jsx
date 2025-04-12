// Modules
import { Link } from "react-router-dom";

function ErrorPage() {
    return (
        <div className="w-full h-screen flex flex-col gap-4 justify-center items-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">404</h1>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl">Oh no, this route doesn't exist!</h2>
            <Link className="bg-sky-600 hover:bg-sky-800 p-2 text-base sm:text-lg md:text-xl lg:text-2xl rounded-lg" to="/">Go back home</Link>
        </div>
    )
}

export default ErrorPage