import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Rocket } from "lucide-react";
import { TypographyH3 } from "@/components/ui/typography-h3";
import { TypographyP } from "@/components/ui/typography-p";
import { Button } from "@/components/ui/button";

const tools = [
    {
        value: "signals",
        icon: <TrendingUp size={18} />,
        title: "AI Signal Tool",
        description: "Receive real-time trading signals based on AI analysis. Make informed decisions with data-driven insights.",
        cardTitle: "How It Works",
        features: [
            "Analyzes market trends and price movements.",
            "Provides real-time buy and sell signals.",
            "Customizable risk levels for traders."
        ]
    },
    {
        value: "bot",
        icon: <Activity size={18} />,
        title: "Automated Trading Bot",
        description: "Let our AI-driven bot execute trades on your behalf, optimizing your portfolio and maximizing gains.",
        cardTitle: "Key Features",
        features: [
            "24/7 automated trading execution.",
            "Advanced risk management strategies.",
            "Integration with major crypto exchanges."
        ]
    }
];

export default function Home() {
    return (
        <div className="bg-black text-white min-h-screen flex flex-col items-center p-10">
            <div className="text-5xl font-bold flex items-center gap-4">
                <Rocket color="orange" size={40} />
                <TypographyH3 title="DeFiSeer AI" className="text-4xl" />
                <Rocket color="orange" size={40} />
            </div>
            <TypographyP className="mt-4 text-lg text-gray-400 text-center max-w-3xl" paragraph="AI-powered cryptocurrency price prediction and automated trading bot integration. Get ahead in the market with our intelligent analytics and automation tools." />
            <Button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 text-lg rounded-lg">
                Start Automating Your Trades
            </Button>
            <TypographyP className="mt-2 text-sm text-gray-500" paragraph="Loved by thousands of crypto traders worldwide!" />

            <Tabs defaultValue="signals" className="w-full max-w-4xl mt-12">
                <TabsList className="flex justify-center gap-6 bg-transparent">
                    {tools.map((tool) => (
                        <TabsTrigger key={tool.value} value={tool.value} className="flex items-center gap-2 w-full text-lg">
                            {tool.icon} {tool.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tools.map((tool) => (
                    <TabsContent key={tool.value} value={tool.value} className="p-6 border border-gray-700 rounded-lg">
                        <TypographyH3 title={tool.title} />
                        <TypographyP className="text-gray-400 mt-2 text-[18px]" paragraph={tool.description} />
                        <Card className="bg-gray-900 p-4 mt-4">
                            <CardHeader>
                                <CardTitle className="text-orange-500">{tool.cardTitle}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc list-inside text-gray-400">
                                    {tool.features.map((feature, index) => (
                                        <li key={index} className="text-[18px] items-center my-4">{feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}