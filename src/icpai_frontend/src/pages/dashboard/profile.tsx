import { useState, useEffect } from "react";
import { useAuthClient } from "@/context/useAuthClient";
import { UserType } from "@/types/user.type";
import { icpai_user } from "../../../../declarations/icpai_user";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Principal } from '@dfinity/principal';
import { useNavigate } from "react-router-dom";
import { useLoading } from "@/context/loading-context";

export function Profile() {
    const { principal, logout } = useAuthClient();
    const [user, setUser] = useState<UserType | null>(null);
    const [tempUser, setTempUser] = useState<UserType | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const { isLoading, setLoading } = useLoading();
    const navigate = useNavigate();

    const getCurrentUser = async () => {
        if (!principal) return;
        setLoading(true);
        const response = await icpai_user.getCurrentUser(Principal.fromText(principal));
        setLoading(false);
        if (!response || !response[0]) return;
        setUser(response[0]);
        setTempUser(response[0]);
    };

    useEffect(() => {
        if (principal) {
            getCurrentUser();
        }
    }, [principal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (tempUser) {
            setTempUser((prevUser) => ({
                ...prevUser,
                [name]: value,
            }));
        }
    };

    const handleUpdateProfile = async () => {
        if (!principal || !tempUser) return;

        const userData = {
            ...tempUser,
            avatar: tempUser.avatar ?? '',
        };

        const response = await icpai_user.updateUser(userData,Principal.fromText(principal));
        if (response) {
            setUser(tempUser);
            getCurrentUser();
        } else {
            console.log("Failed to update profile");
        }
        setOpenUpdateDialog(false);
    };

    const handleDeleteAccount = async () => {
        if (!principal || !user) return;
        const response = await icpai_user.deleteUser(Principal.fromText(principal));
        if (response) {
            await logout();
            navigate('/');
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center p-4 space-y-6">
            {isLoading ? (
                <div className="text-2xl font-semibold text-white">Loading...</div>
            ) : (
                <div className="flex items-center gap-6">
                    <Avatar className="w-48 h-48 cursor-pointer border-2 border-gray-300">
                        <AvatarImage src={user?.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
                    </Avatar>
                    <div>
                        <div className="text-2xl font-semibold text-white">{user?.name || "John Doe"}</div>

                        <div className="mt-4 flex gap-4">
                            <Button onClick={() => setOpenUpdateDialog(true)} variant="outline" className="transform hover:scale-105 transition-all duration-300 hover:bg-green-50">
                                Update Profile
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full bg-red-900 border-none flex justify-start items-center gap-2 p-4 text-white transform hover:scale-105 transition-all duration-300"
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-mono">Delete Account</DialogTitle>
                        <p className="text-[14px]">Are you sure you want to delete your account? This action is irreversible.</p>
                    </DialogHeader>
                    <div className="flex justify-between p-4">
                        <Button onClick={() => setOpenDialog(false)} variant="outline">Cancel</Button>
                        <Button onClick={handleDeleteAccount} color="danger" variant="default">Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-mono">Update Profile</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center gap-4 mb-4">
                        <Avatar className="w-16 h-16 cursor-pointer border-2 border-gray-300">
                            <AvatarImage src={tempUser?.avatar || "https://via.placeholder.com/100"} alt="Avatar" />
                        </Avatar>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={tempUser?.name || ""}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="border p-2 w-full"
                        />
                        <input
                            type="text"
                            name="avatar"
                            value={tempUser?.avatar || ""}
                            onChange={handleChange}
                            placeholder="Avatar URL"
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="flex justify-between p-4 mt-4">
                        <Button onClick={() => setOpenUpdateDialog(false)} variant="outline">Cancel</Button>
                        <Button onClick={handleUpdateProfile} color="primary" variant="default">Update</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
