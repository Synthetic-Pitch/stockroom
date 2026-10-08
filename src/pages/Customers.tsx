import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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

const initialCustomers: Customer[] = [
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
        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
    >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const Customers = () => {
    const [customerItems, setCustomerItems] = useState<Customer[]>(initialCustomers);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Form inputs state
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        address: "",
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

    const handleAddCustomer = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.contact.trim() || !formData.email.trim() || !formData.address.trim()) {
            return;
        }

        const newCustomer: Customer = {
            name: formData.name.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            orders: "0",
            lifetimeValue: "₱0",
        };

        // Push new customer into the list (placed at top of the customer table)
        setCustomerItems((prev) => [newCustomer, ...prev]);
        
        // Reset form & close modal
        setFormData({
            name: "",
            contact: "",
            email: "",
            address: "",
        });
        setIsAddModalOpen(false);
    };

    // Filter customers based on search query
    const filteredCustomers = customerItems.filter((customer) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            customer.name.toLowerCase().includes(query) ||
            customer.contact.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.address.toLowerCase().includes(query)
        );
    });

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
                    <PrimaryButton onClick={() => setIsAddModalOpen(true)}>Add customer</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-2 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">All customers</h2>

                    <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                            <Search className="size-4 shrink-0" aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Search customers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                            className="flex items-center justify-between rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] lg:w-[190px] lg:text-sm"
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
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-6 text-center text-[#7B8A91] lg:px-4">
                                            No customers found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer, index) => (
                                        <tr key={`${customer.name}-${index}`}>
                                            <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5">{customer.name}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.contact}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.email}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.address}</td>
                                            <td className="px-3 py-4 lg:px-4 lg:py-5">{customer.orders}</td>
                                            <td className="px-3 py-4 font-medium lg:px-4 lg:py-5">{customer.lifetimeValue}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        Showing {filteredCustomers.length} records - Scroll to see all columns
                    </p>
                </section>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
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

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsAddModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="add-customer-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl border border-[#DDE5E8] bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E1E8EA] pb-4">
                            <div>
                                <h3 id="add-customer-modal-title" className="text-lg font-semibold text-[#22343A]">
                                    Add Customer
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new customer into the customer list.
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
                        <form onSubmit={handleAddCustomer} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Customer name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Harbor Supply"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Contact person <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Taylor Brooks"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. taylor@harbor.example"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. 42 Harbor Avenue"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
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
                                    Add Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
