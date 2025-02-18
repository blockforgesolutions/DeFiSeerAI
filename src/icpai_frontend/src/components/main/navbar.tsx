import LoginLogoutButton from "../LoginLogoutButton";
import { TypographyH3 } from "../ui/typography-h3";


export function Navbar() {
    return (
        <div className="w-full flex justify-between items-center p-4">
            <div className="w-full flex px-8 items-center">
                <TypographyH3 title="DeFiSeer AI" color="text-white" />
            </div>
            <div className="w-full px-8 flex justify-end items-center">
                <LoginLogoutButton />
            </div>
        </div>
    )
}