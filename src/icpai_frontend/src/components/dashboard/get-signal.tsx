import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Tooltip } from "../ui/tooltip";

interface GetSignalProps {
    fetchSignal: () => void;
    loading: boolean;
    signalDetails: {
        price: string;
        signal: string;
        confidence: string;
    } | null;
}

export default function GetSignal({ fetchSignal, loading, signalDetails }: GetSignalProps) {
    return (
        <Card className="mb-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-xl border border-gray-700 rounded-lg">
            <CardHeader className="flex justify-between items-center py-4">
                <div className="text-lg font-semibold">Signal & Trading Overview</div>
                <Tooltip>
                    <Button 
                        onClick={fetchSignal} 
                        disabled={loading} 
                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-md transition duration-300"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" /> : "Get Signal"}
                    </Button>
                </Tooltip>
            </CardHeader>
            <CardContent className="p-4">
                {signalDetails ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm lg:px-64">
                            <span><strong>Current Price:</strong></span>
                            <span>{signalDetails.price}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm lg:px-64">
                            <span><strong>Signal:</strong></span>
                            <div className="flex items-center">
                                {signalDetails.signal === "AL" ? (
                                    <CheckCircle className="text-green-500 inline ml-1 " />
                                ) : (
                                    <XCircle className="text-red-500 inline ml-1" />
                                )}
                                <span className="ml-2">{signalDetails.signal}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm lg:px-64">
                            <span><strong>Confidence:</strong></span>
                            <div className="flex items-center space-x-2">
                                <span>{signalDetails.confidence} %</span>
                                <Badge color="orange" className="text-xs">{parseFloat(signalDetails.confidence) >= 75 ? "High" : "Low"}</Badge>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Progress value={85} className="rounded-full mt-4" />
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-300 mt-6">
                        <p>No signal data available. Click "Get Signal" to fetch data.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
