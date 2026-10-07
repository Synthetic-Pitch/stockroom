import { ChevronDown, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type AuditEvent = {
    timestamp: string;
    user: string;
    event: string;
    skuOrder: string;
    change: string;
    previousNew: string;
    ipLocation: string;
};

const metrics: Metric[] = [
    { label: "Events today", value: "128", note: "Across your workspace" },
    { label: "Stock movements", value: "42", note: "Across your workspace" },
    { label: "Active staff", value: "12", note: "Across your workspace" },
];

const auditEvents: AuditEvent[] = [
    {
        timestamp: "Oct 6 - 10:42 AM",
        user: "Jamie Davis",
        event: "Stock received",
        skuOrder: "BX-104",
        change: "+240",
        previousNew: "1,000 / 1,240",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        timestamp: "Oct 6 - 10:26 AM",
        user: "Alex Chen",
        event: "Order shipped",
        skuOrder: "DL-2048",
        change: "-32",
        previousNew: "320 / 288",
        ipLocation: "192.0.2.24 - Cebu",
    },
    {
        timestamp: "Oct 6 - 10:08 AM",
        user: "Morgan Lee",
        event: "Stock adjustment",
        skuOrder: "GL-208",
        change: "-6",
        previousNew: "54 / 48",
        ipLocation: "192.0.2.31 - Singapore",
    },
    {
        timestamp: "Oct 6 - 9:56 AM",
        user: "Jamie Davis",
        event: "User sign-in",
        skuOrder: "Workspace",
        change: "-",
        previousNew: "-",
        ipLocation: "192.0.2.18 - Manila",
    },
];

const MetricCard = ({ label, value, note }: Metric) => (
    <li className="rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6">
        <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{label}</p>
        <p className="mt-4 text-2xl font-semibold leading-none text-[#22343A] lg:mt-5 lg:text-4xl">{value}</p>
        <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">{note}</p>
    </li>
);

const PrimaryButton = ({ children }: { children: ReactNode }) => (
    <button
        type="button"
        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
    >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const History = () => {
    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">History & audit log</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            A transparent record of stock movements and staff activity.
                        </p>
                    </div>
                    <PrimaryButton>Export audit log</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Activity log</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search history & audit log..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search history and audit log"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="search"
                            />
                        </label>
                        <button
                            type="button"
                            className="flex items-center justify-between rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] lg:w-[190px] lg:text-sm"
                        >
                            All statuses
                            <ChevronDown className="size-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-4 overflow-x-auto lg:mt-5">
                        <table className="min-w-[860px] table-fixed text-left text-xs lg:min-w-[960px] lg:text-sm">
                            <thead className="bg-[#F3F5F6] text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                <tr>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Timestamp</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">User</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Event</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">SKU / Order</th>
                                    <th className="w-[14%] px-3 py-4 font-medium lg:px-4">Change</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Previous / New</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">IP / Location</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {auditEvents.map((auditEvent) => (
                                    <tr key={`${auditEvent.timestamp}-${auditEvent.event}`}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{auditEvent.timestamp}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.user}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.event}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.skuOrder}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.change}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.previousNew}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{auditEvent.ipLocation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing 4 sample records - Scroll to see all columns
                    </p>
                </section>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Compliance-ready exports</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Filter by date, event, and staff member. Export CSV for accounting or PDF for audit review.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>Export CSV</PrimaryButton>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default History;
