import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Principal } from "@dfinity/principal";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useAuthClient } from "@/context/useAuthClient";
import { icpai_user } from "../../../../declarations/icpai_user";

const isValidImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
}

export default function SignUp() {
    const { principal, userActor } = useAuthClient();
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUp = async () => {
        if (!principal) {
            return;
        }

        if (!name) {
            setIsError(true);
            setErrorMessage("Name is required!");
            return;
        }

        if (avatar && !isValidImageUrl(avatar)) {
            setIsError(true);
            setErrorMessage("Please provide a valid image URL for the avatar!");
            return;
        }

        const avatarValue: string = avatar || "";
        const response: boolean = await userActor.signUpWithInternetIdentity(name, [avatarValue]);
        console.log(response);
        
        if (response) {
            navigate("/dashboard");
        } else {
            setIsError(true);
            setErrorMessage("Sign up failed! Try again.");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-sm shadow-xl rounded-3xl bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-gray-800">DeFiSeer AI</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 p-6">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-24 h-24 border-4 border-gray-300">
                            <AvatarImage 
                                src={avatar || "https://cdn3.pixelcut.app/7/20/uncrop_hero_bdf08a8ca6.jpg"} 
                                alt="Avatar"
                            />
                        </Avatar>
                    </div>
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-bordered"
                    />
                    <Input
                        placeholder="Enter avatar URL (image)"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="input-bordered"
                    />
                    <Button 
                        onClick={handleSignUp} 
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Sign Up
                    </Button>
                </CardContent>
            </Card>

            {isError && (
                <Alert variant="destructive" className="absolute bottom-4 left-4 right-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
