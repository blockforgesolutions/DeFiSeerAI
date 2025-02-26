import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

interface Signal {
    price: string;
    signal: string;
    confidence: string;
}

export default function LastPredictions({ recentPredictions }: { recentPredictions: Signal[] }) {
    return (
        <Card className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg rounded-lg">
            <CardHeader className="text-lg font-semibold">Latest Predictions</CardHeader>
            <CardContent className="p-4">
                <table className="w-full text-sm text-white">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2 px-4 text-left">Time</th>
                            <th className="py-2 px-4 text-left">Price</th>
                            <th className="py-2 px-4 text-left">Signal</th>
                            <th className="py-2 px-4 text-left">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentPredictions.map((prediction, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-700 hover:bg-gray-700 transition-all"
                            >
                                <td className="py-2 px-4">{new Date().toLocaleTimeString()}</td>
                                <td className="py-2 px-4">{prediction.price} USDT</td>
                                <td className="py-2 px-4 flex items-center">
                                    {prediction.signal === "AL" ? (
                                        <CheckCircle className="text-green-500 inline mr-2" />
                                    ) : (
                                        <XCircle className="text-red-500 inline mr-2" />
                                    )}
                                    {prediction.signal}
                                </td>
                                <td className="py-2 px-4">
                                    <span className="font-semibold">{prediction.confidence}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
