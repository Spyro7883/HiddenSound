import { getSession } from "next-auth/react";

export default function Protected({ session }) {
    if (!session) {
        return <p>You need to be authenticated to view this page.</p>;
    }

    return (
        <div>
            <h1>Protected Page</h1>
            <p>Welcome, {session.user.name}!</p>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
}
