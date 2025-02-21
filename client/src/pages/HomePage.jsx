// Modules
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage() {
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        fetch("/api/authUser", {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            if (data.authUser) {
                setAuthUser(data.authUser)
            }
            else console.log(data.msg)
            setLoading(false)
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <>

        {loading ? <div>Loading...</div> :
        <>
            {!authUser ? 
            <div className="flex flex-col gap-2 p-4">
                <div>You're not allowed here!</div>
                <Link className="text-blue-600 hover:text-blue-800" to="/login">Login</Link>
                <Link className="text-blue-600 hover:text-blue-800" to="/register">Register</Link>
            </div> :
            <div className="flex flex-col gap-2 p-4">
                <div>Welcome to HomePage</div>
                <Link className="text-blue-600 hover:text-blue-800" to="/login">Login</Link>
                <Link className="text-blue-600 hover:text-blue-800" to="/register">Register</Link>
            </div>}
        </>}

        </>
    )
}

export default HomePage