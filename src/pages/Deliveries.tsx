import { ChevronDown, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type Delivery = {
    id: string;
    recipient: string;
    items: string;
    destination: string;
    carrier: string;
    eta: string;
};

const metrics: Metric[] = [
    { label: "Scheduled today", value: "6", note: "Across your workspace" },
    { label: "In transit", value: "14", note: "Across your workspace" },
    { label: "Delivered today", value: "4", note: "Across your workspace" },
];

const deliveries: Delivery[] = [
    {
        id: "DL-2048",
        recipient: "Meridian Retail",
        items: "32",
        destination: "East Coast",
        carrier: "Atlas - Sam Lee",
        eta: "Today 2:30 PM",
    },
    {
        id: "DL-2049",
        recipient: "Eastside Studio",
        items: "18",
        destination: "South District",
        carrier: "Swift - Ava Kim",
        eta: "Today 4 PM",
    },
    {
        id: "DL-2050",
        recipient: "Harbor Supply",
        items: "45",
        destination: "Main Warehouse",
        carrier: "Atlas - Ben Tan",
        eta: "Today 10:15 AM",
    },
    {
        id: "DL-2051",
        recipient: "Northline Retail",
        items: "24",
        destination: "North District",
        carrier: "Swift - Eli Wong",
        eta: "Tomorrow 9 AM",
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

const Deliveries = () => {
    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Deliveries</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Coordinate incoming stock and outgoing shipments.
                        </p>
                    </div>
                    <PrimaryButton>Schedule delivery</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All deliveries</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search deliveries..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search deliveries"
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
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Delivery ID</th>
                                    <th className="w-[22%] px-3 py-4 font-medium lg:px-4">Recipient / Supplier</th>
                                    <th className="w-[14%] px-3 py-4 font-medium lg:px-4">Items</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Destination</th>
                                    <th className="w-[22%] px-3 py-4 font-medium lg:px-4">Carrier / Driver</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">ETA</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {deliveries.map((delivery) => (
                                    <tr key={delivery.id}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{delivery.id}</td>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{delivery.recipient}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.items}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.destination}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.carrier}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.eta}</td>
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
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Active route - DL-2048</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Main Warehouse - East Coast Hub - Meridian Retail. Next stop 1:45 PM. Estimated arrival 2:30 PM.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>View tracking</PrimaryButton>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Deliveries;
