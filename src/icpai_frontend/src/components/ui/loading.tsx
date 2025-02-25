
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoading } from "@/context/loading-context";

const GlobalLoading = () => {
  const { isLoading } = useLoading();

  return (
    isLoading && (
      <div className={cn("fixed inset-0 flex items-center justify-center bg-black/50 z-50")}>
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    )
  );
};

export default GlobalLoading;
