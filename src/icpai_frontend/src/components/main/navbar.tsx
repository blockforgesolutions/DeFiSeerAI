import { useAuthClient } from "@/hooks/useAuthClient";
import LoginLogoutButton from "../LoginLogoutButton";
import { TypographyH3 } from "../ui/typography-h3";
import { icpai_user } from '../../../../declarations/icpai_user'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Navbar() {
    const { isAuthenticated } = useAuthClient();
    const principalId = localStorage.getItem("principal");
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {

            if (!principalId) return;

            const user = await icpai_user.getUserInfo(principalId);
            
            if (user.length === 0) {
                navigate('/sign-up');
            }
        }

        getUser();
    }, [isAuthenticated, principalId]);

    return (
        <div className="w-full flex justify-between items-center p-4">
            <div className="w-full flex lg:px-16 items-center">
                <TypographyH3 title="DeFiSeer AI" color="text-white" />
            </div>
            <div className="w-full lg:px-16 flex justify-end items-center">
                <LoginLogoutButton />
            </div>
        </div>
    )
}