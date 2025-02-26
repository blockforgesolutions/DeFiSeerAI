import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { icpai_backend } from "../../../../declarations/icpai_backend";
import LastPredictions from "@/components/dashboard/last-predictions";
import ICPChart from "@/components/dashboard/chart";
import GetSignal from "@/components/dashboard/get-signal";
import { TooltipProvider } from "@/components/ui/tooltip";

interface Signal {
    price: string;
    signal: string;
    confidence: string;
}

interface Trade {
    time: number; // Timestamp in milliseconds
    price: number;
}

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [signalDetails, setSignalDetails] = useState<Signal | null>(null);
    const [recentPredictions, setRecentPredictions] = useState<Signal[]>([]);

    const fetchSignal = async () => {
        setLoading(true);
        const response = await icpai_backend.getSignal();
        const parsedSignal = parseSignal(response);
        setSignalDetails(parsedSignal);

        setRecentPredictions((prev) => [parsedSignal, ...prev].slice(0, 5));

        setLoading(false);
    };


    const parseSignal = (signalString: string): Signal => {
        const parts = signalString.split("\n");
        return {
            price: parts[0].split(":")[1]?.trim(),
            signal: parts[1].split(":")[1]?.trim(),
            confidence: parts[2].split(":")[1]?.trim(),
        };
    };

   

    return (
        <div className="min-h-screen text-white p-10">
            <h1 className="text-4xl font-bold text-orange-500 mb-6">DeFiSeer AI</h1>

            <TooltipProvider>
                <GetSignal fetchSignal={fetchSignal} loading={loading} signalDetails={signalDetails} />
            </TooltipProvider>

            <Separator className="border-gray-700 mb-6" />

            <ICPChart />

            <Separator className="border-gray-700 mb-6 mt-6" />

            <LastPredictions recentPredictions={recentPredictions} />
        </div>
    );
};

export default Dashboard;
