import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const InventoryPhase1 = () => {
    const tabs = ["All items", "Low stock", "Reserved", "Inspection"];
    const inventoryItems = [
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

    return (
        <section className="mt-4 w-full rounded-2xl border border-[#E1E8EA] bg-white px-4 py-6 shadow-sm lg:mt-8 lg:rounded-[8px] lg:px-5 lg:py-5">
            <header className="lg:flex lg:items-start lg:justify-between lg:gap-5">
                <div>
                    <h2 className="text-xl font-semibold leading-none text-[#0C1F26] lg:text-base">Inventory</h2>
                    <p className="mt-2 text-sm font-medium text-[#6D7C84] lg:text-xs">
                        Monitor quantities, availability, and item locations.
                    </p>
                </div>
                <button
                    type="button"
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
                        {inventoryItems.map((item) => (
                            <tr key={item.item} className="border-b border-[#DDE5E8]">
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
                <p className="text-sm font-medium text-[#6D7C84] lg:text-xs">Showing 5 of 248 items</p>
                <div className="flex items-center gap-4 text-[#6D7C84]">
                    <button type="button" aria-label="Previous page">
                        <ChevronLeft className="size-4" aria-hidden="true" />
                    </button>
                    <button type="button" aria-label="Next page">
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </footer>
        </section>
    );
};

export default InventoryPhase1;
