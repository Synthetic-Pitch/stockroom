import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
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

const initialRequests: SupplyRequestRow[] = [
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
    <li className="rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6">
        <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{label}</p>
        <p className="mt-4 text-2xl font-semibold leading-none text-[#22343A] lg:mt-5 lg:text-4xl">{value}</p>
        <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">{note}</p>
    </li>
);

const PrimaryButton = ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
    >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const SupplyRequest = () => {
    const location = useLocation();
    const locationState = location.state as { autoOpenCreate?: boolean } | null;
    const searchParams = new URLSearchParams(location.search);
    const shouldAutoOpen = Boolean(locationState?.autoOpenCreate || searchParams.get("action") === "create");

    const [requestItems, setRequestItems] = useState<SupplyRequestRow[]>(initialRequests);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(shouldAutoOpen);
    const [searchQuery, setSearchQuery] = useState("");

    // Form inputs state
    const [formData, setFormData] = useState({
        requestedBy: "",
        item: "",
        quantity: "",
        urgency: "Normal",
        stage: "Pending review",
    });

    // Clear navigation state once opened to avoid re-triggering on manual navigation
    useEffect(() => {
        if (shouldAutoOpen) {
            window.history.replaceState({}, document.title);
        }
    }, [shouldAutoOpen]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isCreateModalOpen) {
                setIsCreateModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCreateModalOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateRequest = (e: FormEvent) => {
        e.preventDefault();

        const quantityNum = parseInt(formData.quantity, 10);
        if (!formData.requestedBy.trim() || !formData.item.trim() || !Number.isFinite(quantityNum) || quantityNum < 1) {
            return;
        }

        // Generate the next request ID (SR-0126, SR-0127, ...)
        const maxId = requestItems.reduce((max, row) => {
            const match = row.request.match(/^SR-(\d+)/);
            const numericId = match ? parseInt(match[1], 10) : 0;
            return numericId > max ? numericId : max;
        }, 0);

        const newRequest: SupplyRequestRow = {
            request: `SR-${String(maxId + 1).padStart(4, "0")}`,
            requestedBy: formData.requestedBy.trim(),
            item: formData.item.trim(),
            quantity: String(quantityNum),
            urgency: formData.urgency,
            stage: formData.stage,
        };

        // Push new request into the queue (placed at top of the request list)
        setRequestItems((prev) => [newRequest, ...prev]);

        // Reset form & close modal
        setFormData({
            requestedBy: "",
            item: "",
            quantity: "",
            urgency: "Normal",
            stage: "Pending review",
        });
        setIsCreateModalOpen(false);
    };

    // Calculate metrics
    const pendingCount = requestItems.filter((r) => r.stage.toLowerCase().includes("pending")).length + 6;
    const approvedCount = requestItems.filter((r) => r.stage.toLowerCase().includes("approved")).length + 10;

    const metrics: Metric[] = [
        { label: "Pending approval", value: String(pendingCount), note: "Across your workspace" },
        { label: "Approved", value: String(approvedCount), note: "Across your workspace" },
        { label: "Fulfilled this month", value: "45", note: "Across your workspace" },
    ];

    // Filter requests
    const filteredRequests = requestItems.filter((req) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            req.request.toLowerCase().includes(q) ||
            req.requestedBy.toLowerCase().includes(q) ||
            req.item.toLowerCase().includes(q) ||
            req.urgency.toLowerCase().includes(q) ||
            req.stage.toLowerCase().includes(q)
        );
    });

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
                    <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>Create request</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Request workflow</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                            className="flex cursor-pointer items-center justify-between rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] lg:w-[190px] lg:text-sm"
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
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-8 text-center text-xs text-[#7B8A91] lg:text-sm">
                                            No supply requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.request} className="border-b border-[#F0F4F5] last:border-b-0">
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{request.request}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{request.requestedBy}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{request.item}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{request.quantity}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{request.urgency}</td>
                                            <td className="px-3 py-4 font-medium text-[#07887D] lg:px-4 lg:py-5">{request.stage}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {filteredRequests.length} {filteredRequests.length === 1 ? "record" : "records"}{" "}
                        {searchQuery ? "(filtered)" : "- Scroll to see all columns"}
                    </p>
                </section>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Suggested replenishment</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Nitrile gloves - Suggested order: 240 units. Sample estimate based on four weeks of usage.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>Review pending requests</PrimaryButton>
                    </div>
                </section>
            </main>

            {/* Create Request Modal */}
            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsCreateModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-request-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="create-request-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Create Supply Request
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new request into the supply request queue.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="cursor-pointer rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRequest} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Requested by <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="requestedBy"
                                    value={formData.requestedBy}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Alex Chen"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Item <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="item"
                                        value={formData.item}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Nitrile gloves"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 240"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Urgency</label>
                                    <select
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>High</option>
                                        <option>Normal</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Stage</label>
                                    <select
                                        name="stage"
                                        value={formData.stage}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Pending review</option>
                                        <option>Approved</option>
                                        <option>On hold</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="cursor-pointer rounded-[7px] border border-[#DDE5E8] px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#06766D]"
                                >
                                    <Plus className="size-4" />
                                    Create Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplyRequest;
