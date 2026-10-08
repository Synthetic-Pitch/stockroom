import { useState, useEffect, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Plus, Search, X } from "lucide-react";
import Navbar from "../components/navbar";

interface WarehouseData {
    name: string;
    address: string;
    manager: string;
    contact: string;
    capacity: string;
    skus: string;
}

interface StockTransfer {
    id: string;
    item: string;
    fromWarehouse: string;
    toWarehouse: string;
    quantity: number;
    manager: string;
    date: string;
    status: "Completed" | "In transit" | "Pending";
}

const initialWarehouses: WarehouseData[] = [
    {
        name: "Main Warehouse",
        address: "18 Pioneer Road",
        manager: "Jamie Davis",
        contact: "555-0140",
        capacity: "87%",
        skus: "184",
    },
    {
        name: "East Coast Hub",
        address: "42 Harbor Avenue",
        manager: "Alex Chen",
        contact: "555-0162",
        capacity: "76%",
        skus: "96",
    },
    {
        name: "South Depot",
        address: "7 Industrial Drive",
        manager: "Morgan Lee",
        contact: "555-0193",
        capacity: "88%",
        skus: "72",
    },
];

const initialTransfers: StockTransfer[] = [
    {
        id: "TR-1042",
        item: "Packing boxes - BX-104",
        fromWarehouse: "Main Warehouse",
        toWarehouse: "East Coast Hub",
        quantity: 200,
        manager: "Jamie Davis",
        date: "Today, 10:15 AM",
        status: "In transit",
    },
    {
        id: "TR-1041",
        item: "Steel brackets - SB-012",
        fromWarehouse: "South Depot",
        toWarehouse: "Main Warehouse",
        quantity: 120,
        manager: "Morgan Lee",
        date: "Yesterday, 3:45 PM",
        status: "Completed",
    },
    {
        id: "TR-1040",
        item: "Thermal labels - TL-086",
        fromWarehouse: "East Coast Hub",
        toWarehouse: "South Depot",
        quantity: 80,
        manager: "Alex Chen",
        date: "Oct 5, 11:20 AM",
        status: "Completed",
    },
];

const popularItems = [
    "Packing boxes - BX-104",
    "Nitrile gloves - GL-208",
    "Steel brackets - SB-012",
    "Thermal labels - TL-086",
    "Safety goggles - SG-031",
];

const Warehouse = () => {
    const [warehouses] = useState<WarehouseData[]>(initialWarehouses);
    const [transfers, setTransfers] = useState<StockTransfer[]>(initialTransfers);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        item: popularItems[0],
        customItem: "",
        fromWarehouse: "Main Warehouse",
        toWarehouse: "East Coast Hub",
        quantity: "50",
        manager: "Jamie Davis",
        notes: "",
    });

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isTransferModalOpen) {
                setIsTransferModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTransferModalOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "fromWarehouse") {
                const found = warehouses.find((w) => w.name === value);
                if (found) {
                    updated.manager = found.manager;
                }
            }
            return updated;
        });
        setFormError(null);
    };

    const handleTransferStock = (e: FormEvent) => {
        e.preventDefault();

        const selectedItem =
            formData.item === "Custom" ? formData.customItem.trim() : formData.item.trim();

        if (!selectedItem) {
            setFormError("Please enter or select an item / SKU to transfer.");
            return;
        }

        if (formData.fromWarehouse === formData.toWarehouse) {
            setFormError("Source and destination warehouses cannot be the same.");
            return;
        }

        const qtyNum = parseInt(formData.quantity, 10);
        if (isNaN(qtyNum) || qtyNum <= 0) {
            setFormError("Please specify a valid quantity greater than 0.");
            return;
        }

        const newTransfer: StockTransfer = {
            id: `TR-${1043 + transfers.length}`,
            item: selectedItem,
            fromWarehouse: formData.fromWarehouse,
            toWarehouse: formData.toWarehouse,
            quantity: qtyNum,
            manager: formData.manager.trim() || "Jamie Davis",
            date: `Today, ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
            status: "In transit",
        };

        // Push new transfer to the top of transfers list
        setTransfers((prev) => [newTransfer, ...prev]);

        // Success notification
        setSuccessMessage(
            `Transfer #${newTransfer.id} of ${qtyNum.toLocaleString()} units of ${selectedItem} from ${formData.fromWarehouse} to ${formData.toWarehouse} initiated.`
        );

        // Reset form & close modal
        setFormData({
            item: popularItems[0],
            customItem: "",
            fromWarehouse: "Main Warehouse",
            toWarehouse: "East Coast Hub",
            quantity: "50",
            manager: "Jamie Davis",
            notes: "",
        });
        setFormError(null);
        setIsTransferModalOpen(false);
    };

    // Calculate dynamic stock stored metric
    const totalTransferred = transfers.reduce((acc, t) => acc + t.quantity, 0);
    const stockStored = (12480 + totalTransferred).toLocaleString();

    const metrics = [
        { label: "Active warehouses", value: String(warehouses.length), note: "Across your workspace", highlighted: true },
        { label: "Capacity used", value: "82%", note: "Across your workspace" },
        { label: "Stock stored", value: stockStored, note: "Across your workspace" },
    ];

    // Filter warehouses by search query
    const filteredWarehouses = warehouses.filter((wh) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            wh.name.toLowerCase().includes(q) ||
            wh.address.toLowerCase().includes(q) ||
            wh.manager.toLowerCase().includes(q) ||
            wh.contact.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                {/* Header */}
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Warehouses</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage people, capacity, and stock across your network.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsTransferModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Transfer stock
                    </button>
                </header>

                {/* Success Notification Banner */}
                {successMessage && (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-[8px] border border-[#07887D]/20 bg-[#E8F5F3] px-4 py-3 text-xs font-medium text-[#07887D] lg:text-sm">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-4 shrink-0 text-[#07887D]" />
                            <span>{successMessage}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccessMessage(null)}
                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                            aria-label="Dismiss message"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                {/* Metrics */}
                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <li
                            key={metric.label}
                            className="rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6"
                        >
                            <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{metric.label}</p>
                            <p className="mt-4 text-2xl font-semibold leading-none text-[#22343A] lg:mt-5 lg:text-4xl">
                                {metric.value}
                            </p>
                            <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">
                                {metric.note}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* All Warehouses Section */}
                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All warehouses</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search warehouses..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search warehouses"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="search"
                            />
                        </label>
                        <button
                            type="button"
                            className="flex cursor-pointer items-center justify-between rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] lg:w-[190px] lg:text-sm"
                        >
                            All statuses
                            <ChevronDown className="size-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-4 overflow-x-auto lg:mt-5">
                        <table className="min-w-[680px] table-fixed text-left text-xs lg:min-w-[920px] lg:text-sm">
                            <thead className="bg-[#F3F5F6] text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                <tr>
                                    <th className="w-[22%] px-3 py-4 font-medium lg:px-4">Warehouse</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Address</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Manager</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Contact</th>
                                    <th className="w-[14%] px-3 py-4 font-medium lg:px-4">Capacity</th>
                                    <th className="w-[10%] px-3 py-4 font-medium lg:px-4">SKUs</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {filteredWarehouses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-8 text-center text-xs text-[#7B8A91] lg:text-sm">
                                            No warehouses matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredWarehouses.map((warehouse) => (
                                        <tr key={warehouse.name} className="border-b border-[#F0F4F5] last:border-b-0">
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{warehouse.name}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.address}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.manager}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.contact}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.capacity}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.skus}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {filteredWarehouses.length} {filteredWarehouses.length === 1 ? "record" : "records"}{" "}
                        {searchQuery ? "(filtered)" : "- Scroll to see all columns"}
                    </p>
                </section>

                {/* Recent Transfers Section */}
                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold leading-none lg:text-lg">Recent stock transfers</h2>
                            <p className="mt-1 text-xs text-[#7B8A91]">
                                Movements and inventory transfers between warehouses.
                            </p>
                        </div>
                        <span className="rounded-full bg-[#E8F5F3] px-3 py-1 text-xs font-semibold text-[#07887D]">
                            {transfers.length} transfers
                        </span>
                    </div>

                    <div className="mt-4 overflow-x-auto lg:mt-5">
                        <table className="min-w-[680px] table-fixed text-left text-xs lg:min-w-[920px] lg:text-sm">
                            <thead className="bg-[#F3F5F6] text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                <tr>
                                    <th className="w-[14%] px-3 py-3 font-medium lg:px-4">Transfer ID</th>
                                    <th className="w-[26%] px-3 py-3 font-medium lg:px-4">Item / SKU</th>
                                    <th className="w-[18%] px-3 py-3 font-medium lg:px-4">From</th>
                                    <th className="w-[18%] px-3 py-3 font-medium lg:px-4">To</th>
                                    <th className="w-[10%] px-3 py-3 font-medium lg:px-4">Quantity</th>
                                    <th className="w-[14%] px-3 py-3 font-medium lg:px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {transfers.map((t) => (
                                    <tr key={t.id} className="border-b border-[#F0F4F5] last:border-b-0">
                                        <td className="px-3 py-3 font-semibold text-[#07887D] lg:px-4 lg:py-4">{t.id}</td>
                                        <td className="px-3 py-3 font-medium lg:px-4 lg:py-4">{t.item}</td>
                                        <td className="px-3 py-3 lg:px-4 lg:py-4">{t.fromWarehouse}</td>
                                        <td className="px-3 py-3 lg:px-4 lg:py-4">{t.toWarehouse}</td>
                                        <td className="px-3 py-3 font-semibold lg:px-4 lg:py-4">{t.quantity.toLocaleString()}</td>
                                        <td className="px-3 py-3 lg:px-4 lg:py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold lg:text-xs ${
                                                    t.status === "Completed"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : t.status === "In transit"
                                                        ? "bg-[#E8F5F3] text-[#07887D]"
                                                        : "bg-amber-50 text-amber-700"
                                                }`}
                                            >
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Zones and Aisles Section */}
                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Zones and aisles</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Zone A - Packaging / Zone B - Safety gear / Zone C - Hardware
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsTransferModalOpen(true)}
                        className="mt-5 flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Initiate transfer
                    </button>
                </section>
            </main>

            {/* Transfer Stock Modal */}
            {isTransferModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsTransferModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="transfer-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="transfer-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Transfer Stock
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Move inventory items between warehouses across your workspace.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsTransferModalOpen(false)}
                                className="cursor-pointer rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Error Message */}
                        {formError && (
                            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
                                {formError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleTransferStock} className="mt-5 space-y-4">
                            {/* Item Selection */}
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Item / SKU to transfer <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="item"
                                    value={formData.item}
                                    onChange={handleInputChange}
                                    className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                >
                                    {popularItems.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                    <option value="Custom">+ Custom SKU...</option>
                                </select>
                                {formData.item === "Custom" && (
                                    <input
                                        type="text"
                                        name="customItem"
                                        value={formData.customItem}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter custom SKU / Item name"
                                        className="mt-2 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                )}
                            </div>

                            {/* Source and Destination Warehouses */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        From (Origin) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="fromWarehouse"
                                        value={formData.fromWarehouse}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        {warehouses.map((w) => (
                                            <option key={w.name} value={w.name}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        To (Destination) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="toWarehouse"
                                        value={formData.toWarehouse}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        {warehouses.map((w) => (
                                            <option key={w.name} value={w.name}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Quantity and Manager */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="50"
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Authorized Manager
                                    </label>
                                    <input
                                        type="text"
                                        name="manager"
                                        value={formData.manager}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Jamie Davis"
                                        className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Transfer Notes / Reason (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Replenish low stock / Regional rebalance"
                                    className="mt-1.5 w-full rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsTransferModalOpen(false)}
                                    className="cursor-pointer rounded-[7px] border border-[#DDE5E8] px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#06766D]"
                                >
                                    <ArrowRight className="size-4" />
                                    Confirm Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouse;
