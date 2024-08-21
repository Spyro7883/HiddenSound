"use client"
import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"

type FormRegisterSchema = {
    name: string
    email: string
    password: string

}

interface RegisterPopupProps {
    onClose: () => void;
}

const RegisterPopup: React.FC<RegisterPopupProps> = ({ onClose }) => {
    const { register, handleSubmit } = useForm<FormRegisterSchema>()
    const onSubmit: SubmitHandler<FormRegisterSchema> = async (data) => {
        try {
            const response = await fetch(`/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
            } else {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <section className="relative flex flex-col justify-center w-96 min-w-48 h-48 border-2 rounded-lg bg-white pb-2 pt-2 m-8">
                <button onClick={onClose} className="absolute top-2 right-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="flex justify-center pb-2 text-black">User Registration</h1>
                <form method="post" className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <input className="bg-transparent outline-none text-black px-6" type="text" placeholder="Name" {...register("name")} />
                    <input className="bg-transparent outline-none text-black px-6" type="email" placeholder="Email" {...register("email")} />
                    <input className="bg-transparent outline-none text-black px-6" type="password" placeholder="Password" {...register("password")} />
                    <button className="text-black pt-2" type="submit">Submit</button>
                </form>
            </section>
        </div>
    );
};

export default RegisterPopup;