import { useState, type FormEvent, useEffect } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import Navbar from "../components/navbar";

export interface InventoryItem {
    item: string;
    category: string;
    location: string;
    onHand: string;
    allocated: string;
    reorder: string;
    price: string;
    value: string;
}

const initialInventoryItems: InventoryItem[] = [
    {
        item: "Packing boxes - BX-104",
        category: "Packaging",
        location: "Main A-01",
        onHand: "1,240",
        allocated: "120",
        reorder: "200",
        price: "₱2.40",
        value: "₱2,976",
    },
    {
        item: "Nitrile gloves - GL-208",
        category: "Safety",
        location: "East B-02",
        onHand: "48",
        allocated: "24",
        reorder: "100",
        price: "₱8.50",
        value: "₱408",
    },
    {
        item: "Steel brackets - SB-012",
        category: "Hardware",
        location: "Main A-03",
        onHand: "620",
        allocated: "80",
        reorder: "150",
        price: "₱4.80",
        value: "₱2,976",
    },
    {
        item: "Thermal labels - TL-086",
        category: "Packaging",
        location: "South C-01",
        onHand: "180",
        allocated: "100",
        reorder: "80",
        price: "₱12",
        value: "₱2,160",
    },
    {
        item: "Safety goggles - SG-031",
        category: "Safety",
        location: "East B-03",
        onHand: "0",
        allocated: "0",
        reorder: "60",
        price: "₱6.75",
        value: "₱40",
    },
];

const categories = ["Packaging", "Safety", "Hardware", "Electronics", "Office", "Other"];

const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        item: "",
        category: "Packaging",
        location: "",
        onHand: "",
        allocated: "0",
        reorder: "",
        price: "",
    });

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isAddModalOpen) {
                setIsAddModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isAddModalOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.item.trim() || !formData.location.trim()) {
            return;
        }

        const onHandNum = parseFloat(formData.onHand.replace(/,/g, "")) || 0;
        const allocatedNum = parseFloat(formData.allocated.replace(/,/g, "")) || 0;
        const reorderNum = parseFloat(formData.reorder.replace(/,/g, "")) || 0;
        const priceNum = parseFloat(formData.price.replace(/[₱,]/g, "")) || 0;
        const totalValue = onHandNum * priceNum;

        const newItem: InventoryItem = {
            item: formData.item.trim(),
            category: formData.category.trim() || "General",
            location: formData.location.trim(),
            onHand: onHandNum.toLocaleString(),
            allocated: allocatedNum.toLocaleString(),
            reorder: reorderNum.toLocaleString(),
            price: `₱${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            value: `₱${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        };

        // Push new item into the inventory list (placed at top of All inventory table)
        setInventoryItems((prev) => [newItem, ...prev]);

        // Reset form & close modal
        setFormData({
            item: "",
            category: "Packaging",
            location: "",
            onHand: "",
            allocated: "0",
            reorder: "",
            price: "",
        });
        setIsAddModalOpen(false);
    };

    const metrics = [
        { label: "Total SKUs", value: String(243 + inventoryItems.length), note: "Across your workspace" },
        { label: "In stock", value: "218", note: "Across your workspace" },
        { label: "Low stock", value: "12", note: "Across your workspace" },
        { label: "Out of stock", value: "8", note: "Across your workspace" },
    ];

    // Filter items based on search query
    const filteredItems = inventoryItems.filter((item) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.item.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Inventory</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage every SKU, stock level, and storage location.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Add new item
                    </button>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-4 lg:gap-5">
                    {metrics.map((metric) => (
                        <li
                            key={metric.label}
                            className="rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6"
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

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All inventory</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search inventory..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search inventory"
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
                                    <th className="w-[24%] px-3 py-4 font-medium lg:px-4">Item / SKU</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Category</th>
                                    <th className="w-[14%] px-3 py-4 font-medium lg:px-4">Location</th>
                                    <th className="w-[12%] px-3 py-4 font-medium lg:px-4">On hand</th>
                                    <th className="w-[12%] px-3 py-4 font-medium lg:px-4">Allocated</th>
                                    <th className="w-[12%] px-3 py-4 font-medium lg:px-4">Reorder</th>
                                    <th className="w-[10%] px-3 py-4 font-medium lg:px-4">Price</th>
                                    <th className="w-[10%] px-3 py-4 font-medium lg:px-4">Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-8 text-center text-xs text-[#7B8A91] lg:text-sm">
                                            No inventory items found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, index) => (
                                        <tr key={`${item.item}-${index}`} className="border-b border-[#F0F4F5] last:border-b-0">
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{item.item}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.category}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.location}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.onHand}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.allocated}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.reorder}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.price}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{item.value}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {filteredItems.length} {filteredItems.length === 1 ? "record" : "records"}{" "}
                        {searchQuery ? "(filtered)" : "- Scroll to see all columns"}
                    </p>
                </section>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Low stock alerts</h2>
                    <p className="mt-5 text-xs font-medium text-[#22343A] lg:mt-7 lg:text-sm">
                        12 items need replenishment. Nitrile gloves: 48 on hand. Safety goggles: 0 on hand.
                    </p>
                    <button
                        type="button"
                        className="mt-5 flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Request reorder
                    </button>
                </section>
            </main>

            {/* Add New Item Modal */}
            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsAddModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Add New Inventory Item
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new SKU into All inventory.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddItem} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Item name / SKU <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="item"
                                    value={formData.item}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Packing boxes - BX-104"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Main A-01"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        On Hand <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="onHand"
                                        min="0"
                                        value={formData.onHand}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Allocated</label>
                                    <input
                                        type="number"
                                        name="allocated"
                                        min="0"
                                        value={formData.allocated}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Reorder Point</label>
                                    <input
                                        type="number"
                                        name="reorder"
                                        min="0"
                                        value={formData.reorder}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Unit Price (₱) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0.00"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Estimated Total Value</label>
                                    <div className="mt-1.5 flex h-[38px] items-center rounded-md border border-[#E1E8EA] bg-[#F3F5F6] px-3.5 text-xs font-semibold text-[#07887D]">
                                        ₱
                                        {(
                                            (parseFloat(formData.onHand) || 0) * (parseFloat(formData.price) || 0)
                                        ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="cursor-pointer rounded-[7px] border border-[#DDE5E8] px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#06766D]"
                                >
                                    <Plus className="size-4" />
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
