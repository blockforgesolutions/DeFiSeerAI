import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useEffect, useState } from "react";

interface Trade {
    time: number; // Timestamp in milliseconds
    close: number; // Assuming 'close' is the price field
}

export default function ICPChart() {
    const [trades, setTrades] = useState<Trade[]>([]);

    const fetchTrades = async () => {
        try {
            const response = await fetch('https://min-api.cryptocompare.com/data/v2/histoday?fsym=ICP&tsym=USDT&limit=30');
            const data = await response.json();
            console.log(data);

            // Ensure data has a correct format
            setTrades(data.Data.Data.map((item: any) => ({
                time: item.time,
                close: item.close // Use 'close' price
            })));
        } catch (error) {
            console.error('Error fetching trades:', error);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    // Format the timestamp into a readable date string
    const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString();

    return (
        <Card className=" bg-gray-900 border border-gray-700">
            <CardHeader className="text-white text-lg">ICP/USD Last 25 Trades & Chart</CardHeader>
            <CardContent className="h-[350px] overflow-auto">
                {trades.length > 0 && (
                    <ResponsiveContainer width="100%" height={250} className={""}>
                        <LineChart data={trades} margin={{ left: 30 }}>
                            <XAxis
                                dataKey="time"
                                tickFormatter={formatDate} // Format the timestamp as a date
                                fontSize={14}
                                stroke="white"
                            />
                            <YAxis domain={['auto', 'auto']} fontSize={14} stroke="white" />
                            <Tooltip
                                contentStyle={{ fontSize: '14px', backgroundColor: 'black', color: 'white' }}
                                labelFormatter={formatDate} // Format the tooltip's timestamp as a date
                            />
                            <Line type="monotone" dataKey="close" stroke="orange" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
