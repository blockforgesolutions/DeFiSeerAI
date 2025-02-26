import { useAuthClient } from "@/context/useAuthClient";
import LoginLogoutButton from "../LoginLogoutButton";
import { TypographyH3 } from "../ui/typography-h3";
import { icpai_user } from '../../../../declarations/icpai_user'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Principal } from '@dfinity/principal'

export function Navbar() {
    const { isAuthenticated, principal, userActor } = useAuthClient();
    const navigate = useNavigate();
    console.log(principal);

    useEffect(() => {
        const getUser = async () => {
            if (!principal) return;

            try {
                const user = await userActor.getCurrentUser(Principal.fromText(principal));
                console.log(user);

                if (user.length === 0) {
                    navigate('/sign-up');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                // Handle error, show feedback to the user
            }
        }

        getUser();
    }, [isAuthenticated, principal]);

    return (
        <div className="w-full flex justify-between items-center p-4">
            <div className="w-full flex lg:px-16 items-center">
                <TypographyH3 title="DeFiSeer AI" color="text-white font-bold tracking-wider" />
            </div>
            <div className="w-full lg:px-16 flex justify-end items-center">
                <LoginLogoutButton />
            </div>
        </div>
    )
}