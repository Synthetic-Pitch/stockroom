import { ChevronDown, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type Customer = {
    name: string;
    contact: string;
    email: string;
    address: string;
    orders: string;
    lifetimeValue: string;
};

const metrics: Metric[] = [
    { label: "Active clients", value: "142", note: "Across your workspace" },
    { label: "Monthly volume", value: "₱312,400", note: "Across your workspace" },
];

const customers: Customer[] = [
    {
        name: "Meridian Retail",
        contact: "Taylor Brooks",
        email: "taylor@meridian.example",
        address: "42 Harbor Avenue",
        orders: "84",
        lifetimeValue: "₱92,400",
    },
    {
        name: "Eastside Studio",
        contact: "Jordan Lane",
        email: "jordan@eastside.example",
        address: "18 East Street",
        orders: "32",
        lifetimeValue: "₱28,650",
    },
    {
        name: "Northline Retail",
        contact: "Casey Reed",
        email: "casey@northline.example",
        address: "7 North Road",
        orders: "56",
        lifetimeValue: "₱61,200",
    },
    {
        name: "Pacific Works",
        contact: "Avery Gray",
        email: "avery@pacific.example",
        address: "24 Industrial Way",
        orders: "18",
        lifetimeValue: "₱14,900",
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

const Customers = () => {
    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Customers</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage client relationships and delivery preferences.
                        </p>
                    </div>
                    <PrimaryButton>Add customer</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-2 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-[8px] border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All customers</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search customers..."
                                className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                aria-label="Search customers"
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
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Customer</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Contact</th>
                                    <th className="w-[24%] px-3 py-4 font-medium lg:px-4">Email</th>
                                    <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Address</th>
                                    <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Orders</th>
                                    <th className="w-[18%] px-3 py-4 font-medium lg:px-4">Lifetime value</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#22343A]">
                                {customers.map((customer) => (
                                    <tr key={customer.name}>
                                        <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{customer.name}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.contact}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.email}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.address}</td>
                                        <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.orders}</td>
                                        <td className="px-3 py-4 font-medium lg:px-4 lg:py-5">{customer.lifetimeValue}</td>
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
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Meridian Retail - Account details</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Recent orders: DL-2048, 32 items / DL-2026, 48 items. Preferred carrier: Atlas. Loading dock B,
                        weekdays before 4 PM.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton>View customer</PrimaryButton>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Customers;
