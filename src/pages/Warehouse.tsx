import { ChevronDown, Plus, Search } from "lucide-react";
import Navbar from "../components/navbar";

const Warehouse = () => {
    const metrics = [
        {label: "Active warehouses", value: "3", note: "Across your workspace", highlighted: true},
        {label: "Capacity used", value: "82%", note: "Across your workspace"},
        {label: "Stock stored", value: "12,480", note: "Across your workspace"},
    ];

    const warehouses = [
        {
            name: "Main Warehouse",
            address: "18 Pioneer Road",
            manager: "Jamie Davis",
            contact: "555-0140",
            capacity: "82%",
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

    return (
        <div className="min-h-dvh bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Warehouses</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage people, capacity, and stock across your network.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Transfer stock
                    </button>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <li
                            key={metric.label}
                            className={`rounded-[8px] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6 `}
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
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All warehouses</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
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
                            className="flex items-center justify-between rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] lg:w-[190px] lg:text-sm"
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
                                {warehouses.map((warehouse) => (
                                    <tr key={warehouse.name}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{warehouse.name}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.address}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.manager}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.contact}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.capacity}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{warehouse.skus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing 3 sample records - Scroll to see all columns
                    </p>
                </section>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Zones and aisles</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Zone A - Packaging / Zone B - Safety gear / Zone C - Hardware
                    </p>
                    <button
                        type="button"
                        className="mt-5 flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Initiate transfer
                    </button>
                </section>
            </main>
        </div>
    );
};

export default Warehouse;
