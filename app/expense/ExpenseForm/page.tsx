import PawnHistory from "@/components/expense/ExpenseForm";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function PawnHistoryPage() {
    return (
        <div className="flex w-full min-h-screen">
            {/* Sidebar */}
            <div className="hidden md:block w-[300px] flex-shrink-0 bg-white border-r border-slate-100">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 bg-white min-h-screen">
                <PawnHistory />
            </main>
        </div>
    );
}
