import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { icpai_user } from "../../../../declarations/icpai_user";
import { Principal } from "@dfinity/principal";

export default function SignUp() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const principalId = localStorage.getItem("principal");

    const handleSignUp = async() => {
        if (!principalId) {
            return
        }

        const avatarValue: [] | [string] = avatar ? [avatar] : [];
        const principal = Principal.fromText(principalId);
        const response = await icpai_user.signUpWithInternetIdentity(name, avatarValue, principal);
        console.log(response);
        
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-sm shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">DeFiSeer AI</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="w-20 h-20 border-2 border-gray-300">
                            <AvatarImage src={avatar || "https://via.placeholder.com/100"} alt="Avatar" />
                        </Avatar>
                    </div>
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Enter avatar URL"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                    <Button onClick={handleSignUp} className="w-full">Sign Up</Button>
                </CardContent>
            </Card>
        </div>
    );
}
