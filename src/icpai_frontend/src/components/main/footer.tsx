import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { TypographyP } from "../ui/typography-p";

export function Footer() {
    return (
        <div className="w-full flex flex-col p-4">
            <Separator className="my-4 bg-gray-800" />
            <div className="w-full flex justify-between lg:px-8 items-center">
                <TypographyP className="text-sm text-gray-400" paragraph="© 2025 DeFiSeer AI. All Rights Reserved" />
                <div className="flex gap-4">
                    <Link to={'/privacy'}>
                        <TypographyP className="text-sm text-gray-400 underline underline-offset-4" paragraph="Privacy Policy" />
                    </Link>
                    <Link to={'/terms-of-service'}>
                        <TypographyP className="text-sm text-gray-400 underline underline-offset-4" paragraph="Terms of Service" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
