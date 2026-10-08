import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

type InventoryItemRow = {
    item: string;
    category: string;
    location: string;
    quantity: string;
    status: string;
    unitPrice: string;
};

const initialInventoryItems: InventoryItemRow[] = [
    {
        item: "Packing boxes - BX-104",
        category: "Packaging",
        location: "A-01-04",
        quantity: "1,240",
        status: "In stock",
        unitPrice: "₱22.40",
    },
    {
        item: "Nitrile gloves - GL-208",
        category: "Safety",
        location: "B-02-01",
        quantity: "48",
        status: "Low stock",
        unitPrice: "₱87.50",
    },
    {
        item: "Steel brackets - SB-012",
        category: "Hardware",
        location: "A-03-06",
        quantity: "620",
        status: "In stock",
        unitPrice: "₱120.80",
    },
    {
        item: "Thermal labels - TL-086",
        category: "Packaging",
        location: "C-01-02",
        quantity: "180",
        status: "Reserved",
        unitPrice: "₱50.00",
    },
    {
        item: "Safety goggles - SG-031",
        category: "Safety",
        location: "B-02-03",
        quantity: "0",
        status: "Out of stock",
        unitPrice: "₱340.75",
    },
];

const InventoryPhase1 = () => {
    const tabs = ["All items", "Low stock", "Reserved", "Inspection"];

    const [inventoryItems, setInventoryItems] = useState<InventoryItemRow[]>(initialInventoryItems);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form inputs state
    const [formData, setFormData] = useState({
        item: "",
        category: "Packaging",
        location: "",
        quantity: "",
        unitPrice: "",
        status: "In stock",
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

        const quantityNum = parseInt(formData.quantity, 10);
        if (!formData.item.trim() || !formData.location.trim() || !Number.isFinite(quantityNum) || quantityNum < 0) {
            return;
        }

        const priceNum = parseFloat(formData.unitPrice.replace(/[₱,]/g, "")) || 0;

        const newItem: InventoryItemRow = {
            item: formData.item.trim(),
            category: formData.category,
            location: formData.location.trim(),
            quantity: quantityNum.toLocaleString(),
            status: formData.status,
            unitPrice: `₱${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        };

        // Push new item into the inventory table (placed at top)
        setInventoryItems((prev) => [newItem, ...prev]);

        // Reset form & close modal
        setFormData({
            item: "",
            category: "Packaging",
            location: "",
            quantity: "",
            unitPrice: "",
            status: "In stock",
        });
        setIsAddModalOpen(false);
    };

    return (
        <section className="mt-4 w-full rounded-2xl border border-[#E1E8EA] bg-white px-4 py-6 shadow-sm lg:mt-8 lg:rounded-lg lg:px-5 lg:py-5">
            <header className="lg:flex lg:items-start lg:justify-between lg:gap-5">
                <div>
                    <h2 className="text-xl font-semibold leading-none text-[#0C1F26] lg:text-base">Inventory</h2>
                    <p className="mt-2 text-sm font-medium text-[#6D7C84] lg:text-xs">
                        Monitor quantities, availability, and item locations.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-5 flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-base font-semibold text-white lg:mt-0 lg:px-4 lg:py-2 lg:text-xs cursor-pointer"
                >
                    <Plus className="size-5 lg:size-4" aria-hidden="true" />
                    Add item
                </button>
            </header>

            <div className="mt-5 flex items-center gap-3 overflow-x-auto pb-1">
                {tabs.map((tab, index) => (
                    <button
                        key={tab}
                        type="button"
                        className={`shrink-0 rounded-[5px] px-3 py-2 text-sm font-medium lg:text-xs ${
                            index === 0 ? "bg-[#DDF4F0] text-[#07887D]" : "text-[#6D7C84]"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="mt-3 overflow-x-auto">
                <table className="min-w-[760px] table-fixed text-left text-sm lg:text-xs">
                    <thead className="bg-[#F3F5F6] text-[#6D7C84]">
                        <tr>
                            <th className="w-[27%] px-3 py-4 font-medium">Item / SKU</th>
                            <th className="w-[15%] px-3 py-4 font-medium">Category</th>
                            <th className="w-[15%] px-3 py-4 font-medium">Location</th>
                            <th className="w-[15%] px-3 py-4 font-medium">Quantity</th>
                            <th className="w-[15%] px-3 py-4 font-medium">Status</th>
                            <th className="w-[13%] px-3 py-4 font-medium">Unit price</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#001B26]">
                        {inventoryItems.map((item, index) => (
                            <tr key={`${item.item}-${index}`} className="border-b border-[#DDE5E8]">
                                <td className="px-3 py-4 font-semibold">{item.item}</td>
                                <td className="px-3 py-4">{item.category}</td>
                                <td className="px-3 py-4">{item.location}</td>
                                <td className="px-3 py-4">{item.quantity}</td>
                                <td className="px-3 py-4 text-[#007F74]">{item.status}</td>
                                <td className="px-3 py-4">{item.unitPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#6D7C84] lg:text-xs">Showing {inventoryItems.length} of 248 items</p>
                <div className="flex items-center gap-4 text-[#6D7C84]">
                    <button type="button" aria-label="Previous page">
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Next page">
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </footer>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsAddModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dashboard-add-item-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="dashboard-add-item-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Add Inventory Item
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new item into the inventory table.
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
                        <form onSubmit={handleAddItem} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Item / SKU <span className="text-red-500">*</span>
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
                                        <option>Packaging</option>
                                        <option>Safety</option>
                                        <option>Hardware</option>
                                        <option>Electronics</option>
                                        <option>Office</option>
                                        <option>Other</option>
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
                                        placeholder="e.g. A-01-04"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 1240"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Unit price (₱) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 22.40"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                >
                                    <option>In stock</option>
                                    <option>Low stock</option>
                                    <option>Reserved</option>
                                    <option>Out of stock</option>
                                </select>
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
        </section>
    );
};

export default InventoryPhase1;
