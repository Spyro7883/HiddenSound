"use client"
import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Zod schema for login form validation
const loginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

type FormRegisterSchema = z.infer<typeof loginSchema>;

interface LoginPopupProps {
    onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose }) => {
    const { login } = useAuth();
    const form = useForm<FormRegisterSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",  // Set initial values to empty strings or any default values
            password: "",
        },
    });

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
                login({ id: responseData.id, name: responseData.name });
                onClose();
            } else {
                const errorText = await response.text();
                console.error('Error response text:', errorText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <section>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="mx-0" type="submit">Submit</Button>
                </form>
            </Form>
        </section >
    );
};

export default LoginPopup;