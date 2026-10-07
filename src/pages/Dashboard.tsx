import {
    Bell,
    Search,
    Settings,
} from "lucide-react";
import OverviewPhase1 from "../components/ph1-overview";
import MetricCardsPhase1 from "../components/ph1-metric-cards";
import DataStatusPhase1 from "../components/ph1-data-status";
import InventoryPhase1 from "../components/ph1-ivnentory";
import UpcomingRecently from "../components/ph1-upcoming-history";
import Navbar from "../components/navbar";

const Dashboard = () => {
    return (
        <div>
            {/* Mobile */}
            <section className="lg:hidden ">
                <Navbar />
                <main className="bg-[#F5F7F8]">
                    <section className="flex items-center gap-5 border-b border-[#DDE5E8] bg-white px-7 py-5">
                        <label className="flex min-w-0 flex-1 items-center gap-4 rounded-[9px] bg-[#F3F5F6] px-5 py-4 text-[#7B8A91]">
                            <Search className="size-5 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search anything..."
                                className="min-w-0 flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#7B8A91]"
                                aria-label="Search anything"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="search"
                            />
                        </label>
                        <button type="button" className="shrink-0 text-[#7B8A91]" aria-label="Notifications">
                            <Bell className="size-5" aria-hidden="true" />
                        </button>
                        <button type="button" className="shrink-0 text-[#7B8A91]" aria-label="Settings">
                            <Settings className="size-5" aria-hidden="true" />
                        </button>
                    </section>
                    <div className="px-4">
                    <OverviewPhase1 />
                    <MetricCardsPhase1/>
                    <DataStatusPhase1/>
                    <InventoryPhase1/>
                    <UpcomingRecently/>
                    </div>
                </main>
            </section>
            {/* Desktop */}
            <section className="hidden min-h-screen bg-[#F4F7F8] font-sans text-[#22343A] lg:flex">
                <Navbar />
                <div className="min-w-0 flex-1">
                    <header className="flex h-[72px] items-center justify-between border-b border-[#DDE5E8] bg-white px-8">
                        <p className="text-xs font-medium text-[#7B8A91]">Workspace / Overview</p>
                        <div className="flex items-center gap-6">
                            <label className="flex w-[290px] items-center gap-3 rounded-[4px] border border-[#E1E8EA] bg-[#FAFBFB] px-3 py-2 text-[#7B8A91]">
                                <Search className="size-4 shrink-0" aria-hidden="true" />
                                <input
                                    type="search"
                                    placeholder="Search anything..."
                                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#7B8A91]"
                                    aria-label="Search anything"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    enterKeyHint="search"
                                />
                            </label>
                            <button type="button" className="text-[#7B8A91]" aria-label="Notifications">
                                <Bell className="size-4" aria-hidden="true" />
                            </button>
                            <button type="button" className="text-[#7B8A91]" aria-label="Settings">
                                <Settings className="size-4" aria-hidden="true" />
                            </button>
                        </div>
                    </header>

                    <main className="mx-auto max-w-[1030px] px-8 py-8">
                        <OverviewPhase1 />
                        <MetricCardsPhase1 />
                        <DataStatusPhase1 />
                        <InventoryPhase1 />
                        <UpcomingRecently />
                    </main>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
