"use client"
import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

type FormRegisterSchema = {
    email: string
    password: string
}

const LoginPopup: React.FC = () => {
    const { register, handleSubmit } = useForm<FormRegisterSchema>()
    const { login } = useAuth();

    const onSubmit: SubmitHandler<FormRegisterSchema> = async (data) => {
        try {
            const response = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),

            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                login({ name: responseData.name }); // Update the login state using the context
            } else {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <section className="w-96 h-48 border-2 rounded-lg bg-white pb-2 pt-2 m-8 inset-0">
            <h1 className="flex justify-center pb-2 text-black">User Login</h1>
            <form method="post" className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <input className="bg-transparent outline-none text-black px-6" type="email" placeholder="Email" {...register("email")} />
                <input className="bg-transparent outline-none text-black px-6" type="password" placeholder="Password" {...register("password")} />
                <button className="text-black" type="submit">Submit</button>
            </form>
        </section>
    );
};

export default LoginPopup;