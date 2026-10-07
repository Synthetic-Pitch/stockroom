import { ChevronDown, Plus, Search } from "lucide-react";
import Navbar from "../components/navbar";

const Inventory = () => {
    const metrics = [
        {label: "Total SKUs", value: "248", note: "Across your workspace"},
        {label: "In stock", value: "218", note: "Across your workspace"},
        {label: "Low stock", value: "12", note: "Across your workspace"},
        {label: "Out of stock", value: "8", note: "Across your workspace"},
    ];

    const inventoryItems = [
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
                        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Add new item
                    </button>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-4 lg:gap-5">
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

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All inventory</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
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
                                {inventoryItems.map((item) => (
                                    <tr key={item.item}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{item.item}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.category}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.location}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.onHand}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.allocated}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.reorder}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.price}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{item.value}</td>
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
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Low stock alerts</h2>
                    <p className="mt-5 text-xs font-medium text-[#22343A] lg:mt-7 lg:text-sm">
                        12 items need replenishment. Nitrile gloves: 48 on hand. Safety goggles: 0 on hand.
                    </p>
                    <button
                        type="button"
                        className="mt-5 flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Request reorder
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Inventory;
