import { useEffect, useState } from "react";
import { icpai_user } from "../../../../declarations/icpai_user";
import { UserType } from "@/types/user.type";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { useAuthClient } from "@/context/useAuthClient";

export function DashboardNavbar() {
    const { logout, actor, principal } = useAuthClient();
    const [user, setUser] = useState<UserType | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentUser = async () => {
        if (!principal) return;
        const response = await actor.getUserInfo(principal);
        if (!response || !response[0]) return;
        setUser(response[0]);
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const currentPage = location.pathname.split("/").filter(Boolean).pop();

    return (
        <div className="w-full flex items-center p-4 lg:px-16">
            <Breadcrumb className="w-full">
                <BreadcrumbList className="text-white">
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {currentPage && (
                        <BreadcrumbItem>
                            <BreadcrumbLink href={location.pathname}>{currentPage}</BreadcrumbLink>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full flex justify-end items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="w-10 h-10 cursor-pointer flex justify-center items-center ">
                            <Bell color="white" size={24}/>
                        </Avatar>
                    </PopoverTrigger>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="w-10 h-10 cursor-pointer border-2 border-gray-300">
                            <AvatarImage src={user?.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48 p-2 bg-gray-800 shadow-lg rounded-lg">
                        <div className="flex flex-col gap-2 p-2">
                            <span className="text-[16px] text-white text-start font-medium">{user?.name || "Guest"}</span>
                            <Button variant="outline" className="w-full text-start justify-start" onClick={() => navigate("/profile")}>
                                <User /> Profile
                            </Button>
                            <Button variant="destructive" className="w-full text-start justify-start" onClick={logout}>
                                <LogOut /> Logout
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}