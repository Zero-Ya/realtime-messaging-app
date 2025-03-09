// Modules
import { useState } from "react";
import { Link } from "react-router-dom";

// Store
import { useAuthStore } from "../store/authStore";

function RegisterPage() {
    const { register } = useAuthStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isRegistering, setIsRegistering] = useState(false);

    function handleSubmit(e) {
        e.preventDefault()
        const user = { username , password };

        setIsRegistering(true);
        setError(false);
        fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                setError(true);
                setErrors(data.errors);
                return setIsRegistering(false);
            }
            setIsRegistering(false);
            register(data);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className="h-screen bg-white flex justify-center items-center">
            <div className="w-10/12 sm:w-3/4 md:w-7/12 lg:w-2/5 xl:w-1/3 2xl:w-1/4 flex flex-col gap-4 p-6 items-center border rounded-md shadow">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold">Register</div>

                {(error) && 
                <div className="w-full p-2 rounded-lg bg-red-600 text-white text-sm md:text-base max-h-20 overflow-y-auto">
                    <ul className="list-disc list-inside">
                        {errors.map((error, index) => <li key={index}>{error.msg}</li>)}
                    </ul>
                </div>}

                <form className="w-full flex flex-col gap-4 text-sm md:text-base">
                    <div className="flex flex-col gap-2">
                        <label className="cursor-pointer" htmlFor="username">Username</label>
                        <input className="border rounded-lg p-2" type="text" id="username" name="username" value={username}
                        placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="cursor-pointer" htmlFor="password">Password</label>
                        <input className="border rounded-lg p-2" type="text" id="password" name="password" value={password}
                        placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link className="text-blue-600 hover:text-blue-800" to="/login">Already have an account? Login</Link>
                        <button className="bg-blue-600 hover:bg-blue-800 text-white p-2 rounded-lg" type="submit" onClick={handleSubmit}>
                            {isRegistering ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default RegisterPage