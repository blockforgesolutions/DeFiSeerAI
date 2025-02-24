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

export default function SignUp() {
    const { principal } = useAuthClient()
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const navigate = useNavigate();
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUp = async () => {
        if (!principal) {
            return
        }

        const avatarValue: string = avatar || "";
        const response: boolean = await icpai_user.signUpWithInternetIdentity(name, [avatarValue], Principal.fromText(principal));

        if (response) {
            navigate("/dashboard");
        } else {
            setIsError(true);
            setErrorMessage("Sign up failed! Try again.");
        }

    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
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

            {isError && (
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
