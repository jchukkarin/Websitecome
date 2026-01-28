import History from "@/components/income/History";
import { Suspense } from "react";

export default function HistoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <History />
        </Suspense>
    );
}
