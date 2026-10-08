import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type ReturnRow = {
    id: string;
    customer: string;
    skuQuantity: string;
    reason: string;
    inspectionStatus: string;
    action: string;
};

const metrics: Metric[] = [
    { label: "Pending inspection", value: "6", note: "Across your workspace" },
    { label: "Approved resolutions", value: "18", note: "Across your workspace" },
    { label: "Return rate", value: "1.4%", note: "Across your workspace" },
];

const initialReturns: ReturnRow[] = [
    {
        id: "RT-0086",
        customer: "Meridian Retail",
        skuQuantity: "BX-104 - 12",
        reason: "Damaged in transit",
        inspectionStatus: "Under inspection",
        action: "Review photos",
    },
    {
        id: "RT-0085",
        customer: "Eastside Studio",
        skuQuantity: "GL-208 - 6",
        reason: "Wrong item sent",
        inspectionStatus: "Awaiting arrival",
        action: "Issue replacement",
    },
    {
        id: "RT-0084",
        customer: "Northline Retail",
        skuQuantity: "SG-031 - 4",
        reason: "Defective",
        inspectionStatus: "Under inspection",
        action: "Approve refund",
    },
    {
        id: "RT-0083",
        customer: "Pacific Works",
        skuQuantity: "SB-012 - 8",
        reason: "Damaged in transit",
        inspectionStatus: "Restocked",
        action: "Restock item",
    },
];

const MetricCard = ({ label, value, note }: Metric) => (
    <li className="rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6">
        <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{label}</p>
        <p className="mt-4 text-2xl font-semibold leading-none text-[#22343A] lg:mt-5 lg:text-4xl">{value}</p>
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

const Returns = () => {
    const [returnItems, setReturnItems] = useState<ReturnRow[]>(initialReturns);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        customer: "",
        sku: "",
        quantity: "",
        reason: "Damaged in transit",
        inspectionStatus: "Awaiting arrival",
        action: "Review photos",
    });

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

    const handleCreateReturn = (e: FormEvent) => {
        e.preventDefault();

        const quantityNum = parseInt(formData.quantity, 10);
        if (!formData.customer.trim() || !formData.sku.trim() || !Number.isFinite(quantityNum) || quantityNum < 1) {
            return;
        }

        // Generate the next return ID (RT-0087, RT-0088, ...)
        const maxId = returnItems.reduce((max, item) => {
            const numericId = parseInt(item.id.replace(/\D/g, ""), 10) || 0;
            return numericId > max ? numericId : max;
        }, 0);

        const newReturn: ReturnRow = {
            id: `RT-${String(maxId + 1).padStart(4, "0")}`,
            customer: formData.customer.trim(),
            skuQuantity: `${formData.sku.trim()} - ${quantityNum}`,
            reason: formData.reason,
            inspectionStatus: formData.inspectionStatus,
            action: formData.action,
        };

        // Push new return into the queue (placed at top of RMA processing queue)
        setReturnItems((prev) => [newReturn, ...prev]);

        // Reset form & close modal
        setFormData({
            customer: "",
            sku: "",
            quantity: "",
            reason: "Damaged in transit",
            inspectionStatus: "Awaiting arrival",
            action: "Review photos",
        });
        setIsCreateModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Returns</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Inspect returned goods and resolve each case.
                        </p>
                    </div>
                    <PrimaryButton onClick={() => setIsCreateModalOpen(true)}>Create return</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">RMA processing queue</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search returns..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search returns"
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
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Return ID</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Customer</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">SKU / Quantity</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Reason</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Inspection status</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {returnItems.map((returnItem) => (
                                    <tr key={returnItem.id}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{returnItem.id}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{returnItem.customer}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{returnItem.skuQuantity}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{returnItem.reason}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{returnItem.inspectionStatus}</td>
                                        <td className="px-3 py-4 font-medium text-[#07887D] lg:px-4 lg:py-5">{returnItem.action}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {returnItems.length} records - Scroll to see all columns
                    </p>
                </section>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Inspection workspace - RT-0086</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Packing boxes - 12 units. Review damaged-goods photos and select Restock, Repair, or Disposal.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>Review inspection</PrimaryButton>
                    </div>
                </section>
            </main>

            {/* Create Return Modal */}
            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsCreateModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-return-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="create-return-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Create Return
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new return into the RMA processing queue.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateReturn} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Customer <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Meridian Retail"
                                    className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        SKU <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. BX-104"
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
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
                                        placeholder="e.g. 12"
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">Reason</label>
                                <select
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                >
                                    <option>Damaged in transit</option>
                                    <option>Wrong item sent</option>
                                    <option>Defective</option>
                                    <option>Missing parts</option>
                                    <option>Changed mind</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Inspection status</label>
                                    <select
                                        name="inspectionStatus"
                                        value={formData.inspectionStatus}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Awaiting arrival</option>
                                        <option>Under inspection</option>
                                        <option>Restocked</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Action</label>
                                    <select
                                        name="action"
                                        value={formData.action}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Review photos</option>
                                        <option>Issue replacement</option>
                                        <option>Approve refund</option>
                                        <option>Restock item</option>
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
                                    Create Return
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Returns;
