import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
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

const initialDeliveries: Delivery[] = [
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
    <li className="min-w-0 overflow-hidden rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6">
        <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{label}</p>
        <p className="mt-4 break-words text-2xl font-semibold leading-tight text-[#22343A] lg:mt-5 lg:text-4xl">{value}</p>
        <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">{note}</p>
    </li>
);

const PrimaryButton = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
    >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const statusOptions = ["All statuses", "Today", "Tomorrow", "Later"];

// Derive delivery window from the ETA text
const getDeliveryWindow = (eta: string): string => {
    const value = eta.toLowerCase();
    if (value.includes("today")) return "Today";
    if (value.includes("tomorrow")) return "Tomorrow";
    return "Later";
};

const Deliveries = () => {
    const [deliveryItems, setDeliveryItems] = useState<Delivery[]>(initialDeliveries);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // Ref for the status dropdown (used to close it on outside click)
    const statusRef = useRef<HTMLDivElement>(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        recipient: "",
        items: "",
        destination: "",
        carrier: "",
        eta: "",
    });

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isScheduleModalOpen) {
                setIsScheduleModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isScheduleModalOpen]);

    // Close status dropdown on outside click or Escape (only while it's open)
    useEffect(() => {
        if (!isStatusOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
                setIsStatusOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsStatusOpen(false);
        };

        window.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isStatusOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleScheduleDelivery = (e: FormEvent) => {
        e.preventDefault();

        const itemsNum = parseInt(formData.items, 10);
        if (
            !formData.recipient.trim() ||
            !formData.destination.trim() ||
            !formData.carrier.trim() ||
            !formData.eta.trim() ||
            !Number.isFinite(itemsNum) ||
            itemsNum < 1
        ) {
            return;
        }

        // Generate the next delivery ID (DL-2052, DL-2053, ...)
        const maxId = deliveryItems.reduce((max, row) => {
            const match = row.id.match(/^DL-(\d+)/);
            const numericId = match ? parseInt(match[1], 10) : 0;
            return numericId > max ? numericId : max;
        }, 0);

        const newDelivery: Delivery = {
            id: `DL-${String(maxId + 1).padStart(4, "0")}`,
            recipient: formData.recipient.trim(),
            items: String(itemsNum),
            destination: formData.destination.trim(),
            carrier: formData.carrier.trim(),
            eta: formData.eta.trim(),
        };

        // Push new delivery into the schedule (placed at top of the delivery list)
        setDeliveryItems((prev) => [newDelivery, ...prev]);

        // Reset form & close modal
        setFormData({
            recipient: "",
            items: "",
            destination: "",
            carrier: "",
            eta: "",
        });
        setIsScheduleModalOpen(false);
    };

    // Filter deliveries based on selected status and search query
    const filteredDeliveries = deliveryItems.filter((delivery) => {
        // Status filter (derived from ETA: Today / Tomorrow / Later)
        if (statusFilter !== "All statuses" && getDeliveryWindow(delivery.eta) !== statusFilter) {
            return false;
        }
        // Search filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            delivery.id.toLowerCase().includes(q) ||
            delivery.recipient.toLowerCase().includes(q) ||
            delivery.destination.toLowerCase().includes(q) ||
            delivery.carrier.toLowerCase().includes(q) ||
            delivery.eta.toLowerCase().includes(q) ||
            delivery.items.toLowerCase().includes(q)
        );
    });

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
                    <PrimaryButton onClick={() => setIsScheduleModalOpen(true)}>Schedule delivery</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All deliveries</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                        <div className="relative w-full lg:w-[190px]" ref={statusRef}>
                            <button
                                type="button"
                                onClick={() => setIsStatusOpen((prev) => !prev)}
                                aria-haspopup="true"
                                aria-expanded={isStatusOpen}
                                aria-label="Filter by status"
                                className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] outline-none transition focus:border-[#07887D] lg:text-sm"
                            >
                                {statusFilter}
                                <ChevronDown
                                    className={`size-4 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                />
                            </button>

                            {isStatusOpen && (
                                <ul className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border border-[#E1E8EA] bg-white py-1 shadow-lg">
                                    {statusOptions.map((status) => (
                                        <li key={status}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStatusFilter(status);
                                                    setIsStatusOpen(false);
                                                }}
                                                aria-pressed={statusFilter === status}
                                                className={`block w-full cursor-pointer px-4 py-2.5 text-left text-xs transition hover:bg-[#F3F5F6] lg:text-sm ${
                                                    statusFilter === status
                                                        ? "font-semibold text-[#07887D]"
                                                        : "text-[#22343A]"
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                                {filteredDeliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-8 text-center text-xs text-[#7B8A91] lg:text-sm">
                                            No deliveries found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDeliveries.map((delivery) => (
                                        <tr key={delivery.id}>
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{delivery.id}</td>
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{delivery.recipient}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.items}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.destination}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.carrier}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{delivery.eta}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {filteredDeliveries.length} {filteredDeliveries.length === 1 ? "record" : "records"}{" "}
                        {searchQuery || statusFilter !== "All statuses" ? "(filtered)" : "- Scroll to see all columns"}
                    </p>
                </section>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Active route - DL-2048</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Main Warehouse - East Coast Hub - Meridian Retail. Next stop 1:45 PM. Estimated arrival 2:30 PM.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>View tracking</PrimaryButton>
                    </div>
                </section>
            </main>

            {/* Schedule Delivery Modal */}
            {isScheduleModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsScheduleModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="schedule-delivery-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="schedule-delivery-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Schedule Delivery
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new delivery into the schedule.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsScheduleModalOpen(false)}
                                className="rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleScheduleDelivery} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Recipient / Supplier <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="recipient"
                                    value={formData.recipient}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Meridian Retail"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Items <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="items"
                                        value={formData.items}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 32"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        ETA <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="eta"
                                        value={formData.eta}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Today 2:30 PM"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Destination <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. East Coast"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Carrier / Driver <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="carrier"
                                    value={formData.carrier}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Atlas - Sam Lee"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="cursor-pointer rounded-[7px] border border-[#DDE5E8] px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#06766D]"
                                >
                                    <Plus className="size-4" />
                                    Schedule Delivery
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deliveries;
