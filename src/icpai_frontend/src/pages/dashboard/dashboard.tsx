import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { icpai_backend } from "../../../../declarations/icpai_backend";

interface Signal {
    price: string;
    signal: string;
    confidence: string;
}

interface Trade {
    time: string;
    price: number;
}

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [signalDetails, setSignalDetails] = useState<Signal | null>(null);
    const [trades, setTrades] = useState<Trade[] | null>([]);

    const fetchSignal = async () => {
        setLoading(true);
        const response = await icpai_backend.getSignal();
        setSignalDetails(parseSignal(response));
        setLoading(false);
    };

    const fetchLastTrades = async () => {
        setLoading(true);
        const result = await icpai_backend.getLastTrades(10n);
        setTrades(parseTrades(result));
        setLoading(false);
    };

    const parseSignal = (signalString: string) => {
        const parts = signalString.split("\n");
        return {
            price: parts[0].split(":")[1]?.trim(),
            signal: parts[1].split(":")[1]?.trim(),
            confidence: parts[2].split(":")[1]?.trim(),
        };
    };

    const parseTrades = (tradeString: string) => {
        return tradeString
            .split("Zaman:")
            .slice(1)
            .map((trade: string) => {
                const parts = trade.split("Fiyat:");
                return { time: parts[0].trim(), price: parseFloat(parts[1].trim()) };
            });
    };

    useEffect(() => {
        fetchLastTrades();
    }, []);

    return (
        <div className="min-h-screen text-white p-10">
            <h1 className="text-4xl font-bold text-orange-500 mb-6">DeFiSeer AI</h1>

            <Card className="mb-6 bg-gray-900 border border-gray-700">
                <CardHeader className="text-white">Signal & Trading Overview</CardHeader>
                <CardContent>
                    <Button onClick={fetchSignal} disabled={loading} className="w-full mb-3 bg-orange-500 hover:bg-orange-600">
                        {loading ? <Loader2 className="animate-spin" /> : "Get Signal"}
                    </Button>
                    {signalDetails && (
                        <div className="text-lg">
                            <p><strong>Current Price:</strong> {signalDetails.price}</p>
                            <p>
                                <strong>Signal:</strong>
                                {signalDetails.signal === "AL" ? (
                                    <CheckCircle className="text-green-500 inline ml-1" />
                                ) : (
                                    <XCircle className="text-red-500 inline ml-1" />
                                )} {signalDetails.signal}
                            </p>
                            <p><strong>Confidence:</strong> {signalDetails.confidence} %</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Separator className="border-gray-700 mb-6" />

            <Card className="mb-6 bg-gray-900 border border-gray-700">
                <CardHeader className="text-white">Latest Trades & Chart</CardHeader>
                <CardContent className="h-[400px] overflow-auto">
                    {trades && trades.length > 0 && (
                        <div className="flex gap-6">
                            <ul className="w-1/3 text-[18px]">
                                {trades.map((trade, index) => (
                                    <li key={index} className="text-white">
                                        {new Date(parseInt(trade.time)).toLocaleString()} -
                                        <strong className="text-orange-400"> {trade.price} </strong> USDT
                                    </li>
                                ))}
                            </ul>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={trades} margin={{ left: 30 }}>
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={(time) => new Date(parseInt(time)).toLocaleTimeString()}
                                        fontSize={14}
                                        stroke="white"
                                    />
                                    <YAxis domain={['auto', 'auto']} fontSize={14} stroke="white" />
                                    <Tooltip contentStyle={{ fontSize: '14px', backgroundColor: 'black', color: 'white' }} />
                                    <Line type="monotone" dataKey="price" stroke="orange" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
