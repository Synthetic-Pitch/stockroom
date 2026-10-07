import { ChevronDown, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type SupplyRequestRow = {
    request: string;
    requestedBy: string;
    item: string;
    quantity: string;
    urgency: string;
    stage: string;
};

const metrics: Metric[] = [
    { label: "Pending approval", value: "8", note: "Across your workspace" },
    { label: "Approved", value: "12", note: "Across your workspace" },
    { label: "Fulfilled this month", value: "45", note: "Across your workspace" },
];

const requests: SupplyRequestRow[] = [
    {
        request: "SR-0124",
        requestedBy: "Alex Chen",
        item: "Nitrile gloves",
        quantity: "240",
        urgency: "High",
        stage: "Pending review",
    },
    {
        request: "SR-0125",
        requestedBy: "Jamie Davis",
        item: "Safety goggles",
        quantity: "120",
        urgency: "High",
        stage: "Pending review",
    },
    {
        request: "SR-0123 - PO-408",
        requestedBy: "Morgan Lee",
        item: "Packing boxes",
        quantity: "500",
        urgency: "Normal",
        stage: "Approved",
    },
    {
        request: "SR-0121 - PO-406",
        requestedBy: "Alex Chen",
        item: "Thermal labels",
        quantity: "200",
        urgency: "Normal",
        stage: "Approved",
    },
    {
        request: "SR-0119",
        requestedBy: "Jamie Davis",
        item: "Steel brackets",
        quantity: "100",
        urgency: "Low",
        stage: "On hold",
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

const SupplyRequest = () => {
    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Supply requests</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Review replenishment needs and keep purchasing moving.
                        </p>
                    </div>
                    <PrimaryButton>Create request</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Request workflow</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search supply requests..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search supply requests"
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
                        <table className="min-w-[760px] table-fixed text-left text-xs lg:min-w-[920px] lg:text-sm">
                            <thead className="bg-[#F3F5F6] text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                <tr>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Request</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Requested by</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Item</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Quantity</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Urgency</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Stage</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {requests.map((request) => (
                                    <tr key={request.request}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{request.request}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{request.requestedBy}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{request.item}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{request.quantity}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{request.urgency}</td>
                                        <td className="px-3 py-4 font-medium text-[#07887D] lg:px-4 lg:py-5">{request.stage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing 5 sample records - Scroll to see all columns
                    </p>
                </section>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Suggested replenishment</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Nitrile gloves - Suggested order: 240 units. Sample estimate based on four weeks of usage.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>Review pending requests</PrimaryButton>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SupplyRequest;
