import Projects from "@/components/project/Projects";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function ProjectPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans text-gray-900">
            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">

                {/* Sidebar */}
                <div className="hidden md:block md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
                    <Sidebar />
                </div>

                {/* Main Content */}
                <main className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-3rem)]">
                    <Projects />
                </main>

            </div>
        </div>
    );
}