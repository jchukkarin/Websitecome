import InCome from "@/components/income/InCome";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function IncomePage() {
    return (
        <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block w-[300px] flex-shrink-0 bg-white border-r border-slate-100">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 bg-white min-h-screen">
                <InCome />
            </main>
        </div>
    );
}