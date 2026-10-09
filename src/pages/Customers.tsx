import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import Papa from "papaparse";
import Navbar from "../components/navbar";
import customersListCsv from "../assets/csv/customers_list.csv?raw";

export type CustomerTier = "VIP" | "Regular" | "New";
type ClientTab = "All clients" | "VIP" | "Regular" | "New";
type SortKey = keyof CustomerRow;
type SortDirection = "asc" | "desc";
type FilterKey = "city" | "tier" | "valueRange";

export interface CustomerRow {
    customer: string;
    contact: string;
    email: string;
    address: string;
    totalOrderValue: string;
    firstOrderDate: string;
    previousOrderDate: string;
    tier: CustomerTier;
}

type CustomerCsvRow = {
    "Customer"?: string;
    "Contact"?: string;
    "Email"?: string;
    "Address"?: string;
    "Total Order Value"?: string;
    "First Order Date"?: string;
    "Previous Order Date"?: string;
};

const itemsPerPage = 15;
const tabs: ClientTab[] = ["All clients", "VIP", "Regular", "New"];

// All column headers mapped directly from customers_list.csv
const columns: Array<{ key: SortKey; label: string; minWidth: string }> = [
    { key: "customer", label: "Customer", minWidth: "min-w-[200px]" },
    { key: "contact", label: "Contact", minWidth: "min-w-[160px]" },
    { key: "email", label: "Email", minWidth: "min-w-[230px]" },
    { key: "address", label: "Address", minWidth: "min-w-[230px]" },
    { key: "totalOrderValue", label: "Total Order Value", minWidth: "min-w-[160px]" },
    { key: "firstOrderDate", label: "First Order Date", minWidth: "min-w-[140px]" },
    { key: "previousOrderDate", label: "Previous Order Date", minWidth: "min-w-[150px]" },
    { key: "tier", label: "Tier", minWidth: "min-w-[110px]" },
];

const getNumericValue = (val: string | number | undefined) =>
    Number(String(val ?? "").replace(/[^0-9.-]/g, "")) || 0;

const formatPeso = (val: string | number | undefined) => {
    const amount = getNumericValue(val);
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatCompactPeso = (val: string | number | undefined) => {
    const amount = getNumericValue(val);
    if (amount >= 1_000_000_000) {
        return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
    }
    if (amount >= 1_000_000) {
        return `₱${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (amount >= 100_000) {
        return `₱${(amount / 1_000).toFixed(1)}k`;
    }
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const getCustomerTier = (val: number): CustomerTier => {
    if (val >= 250000) return "VIP";
    if (val >= 100000) return "Regular";
    return "New";
};

const getCityFromAddress = (address: string): string => {
    const clean = (address ?? "").replace(/["']/g, "").trim();
    const parts = clean.split(",");
    if (parts.length > 1) {
        return parts[parts.length - 1].trim();
    }
    return clean || "Metro Manila";
};

// Map all columns from customers_list.csv
const initialCustomers: CustomerRow[] = Papa.parse<CustomerCsvRow>(customersListCsv, {
    header: true,
    skipEmptyLines: true,
}).data.map((row) => {
    const totalValNum = getNumericValue(row["Total Order Value"] ?? "0");
    return {
        customer: row["Customer"] ?? "Unnamed Customer",
        contact: row["Contact"] ?? "N/A",
        email: row["Email"] ?? "N/A",
        address: (row["Address"] ?? "").replace(/^"|"$/g, "").trim() || "N/A",
        totalOrderValue: formatPeso(totalValNum),
        firstOrderDate: row["First Order Date"] ?? "N/A",
        previousOrderDate: row["Previous Order Date"] ?? "N/A",
        tier: getCustomerTier(totalValNum),
    };
});

const getTierBadgeClass = (tier: CustomerTier) => {
    if (tier === "VIP") return "bg-emerald-50 text-emerald-700";
    if (tier === "Regular") return "bg-blue-50 text-blue-700";
    return "bg-amber-50 text-amber-700";
};

const Customers = () => {
    const [customerItems, setCustomerItems] = useState<CustomerRow[]>(initialCustomers);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<ClientTab>("All clients");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: "totalOrderValue",
        direction: "desc",
    });

    const [filters, setFilters] = useState<Record<FilterKey, string>>({
        city: "",
        tier: "",
        valueRange: "",
    });

    // Form inputs state for Add Customer modal
    const [formData, setFormData] = useState({
        customer: "",
        contact: "",
        email: "",
        address: "",
        totalOrderValue: "",
    });

    // Close modals on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsAddModalOpen(false);
                setIsFilterModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Filter options extracted dynamically from current customer dataset
    const filterOptions = useMemo(() => {
        const cities = Array.from(
            new Set(customerItems.map((c) => getCityFromAddress(c.address))),
        )
            .filter(Boolean)
            .sort();
        return {
            cities,
        };
    }, [customerItems]);

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    // Filter customers by activeTab, modal filters, and search query
    const filteredCustomers = useMemo(() => {
        return customerItems.filter((c) => {
            // Tab filter
            if (activeTab !== "All clients" && c.tier !== activeTab) {
                return false;
            }

            // Modal filters
            if (filters.city && getCityFromAddress(c.address) !== filters.city) {
                return false;
            }
            if (filters.tier && c.tier !== filters.tier) {
                return false;
            }
            if (filters.valueRange) {
                const val = getNumericValue(c.totalOrderValue);
                if (filters.valueRange === "over300" && val < 300000) return false;
                if (filters.valueRange === "100to300" && (val < 100000 || val > 300000)) return false;
                if (filters.valueRange === "under100" && val >= 100000) return false;
            }

            // Search query across all mapped columns
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                c.customer.toLowerCase().includes(q) ||
                c.contact.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.address.toLowerCase().includes(q) ||
                c.totalOrderValue.toLowerCase().includes(q) ||
                c.firstOrderDate.toLowerCase().includes(q) ||
                c.previousOrderDate.toLowerCase().includes(q) ||
                c.tier.toLowerCase().includes(q)
            );
        });
    }, [customerItems, activeTab, filters, searchQuery]);

    // Safe sorting
    const sortedCustomers = useMemo(() => {
        const items = [...filteredCustomers];
        items.sort((a, b) => {
            if (sortConfig.key === "totalOrderValue") {
                const valA = getNumericValue(a.totalOrderValue);
                const valB = getNumericValue(b.totalOrderValue);
                return sortConfig.direction === "asc" ? valA - valB : valB - valA;
            }

            const strA = (a[sortConfig.key] ?? "").toLowerCase();
            const strB = (b[sortConfig.key] ?? "").toLowerCase();

            if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
            if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return items;
    }, [filteredCustomers, sortConfig]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedCustomers.length / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageStartIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedCustomers = sortedCustomers.slice(pageStartIndex, pageStartIndex + itemsPerPage);
    const firstVisibleNumber = sortedCustomers.length === 0 ? 0 : pageStartIndex + 1;
    const lastVisibleNumber = Math.min(pageStartIndex + paginatedCustomers.length, sortedCustomers.length);

    // Handlers
    const handleTabChange = (tab: ClientTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSort = (key: SortKey) => {
        setSortConfig((cur) => ({
            key,
            direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc",
        }));
        setCurrentPage(1);
    };

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleFilterChange = (key: FilterKey, val: string) => {
        setFilters((prev) => ({ ...prev, [key]: val }));
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({ city: "", tier: "", valueRange: "" });
        setCurrentPage(1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCustomer = (e: FormEvent) => {
        e.preventDefault();

        if (
            !formData.customer.trim() ||
            !formData.contact.trim() ||
            !formData.email.trim() ||
            !formData.address.trim()
        ) {
            return;
        }

        const orderValueNum = parseFloat(formData.totalOrderValue.replace(/[^0-9.-]/g, "")) || 0;
        const todayStr = new Date().toISOString().slice(0, 10);

        const newCustomer: CustomerRow = {
            customer: formData.customer.trim(),
            contact: formData.contact.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            totalOrderValue: formatPeso(orderValueNum),
            firstOrderDate: todayStr,
            previousOrderDate: todayStr,
            tier: getCustomerTier(orderValueNum),
        };

        // Push new customer to top of the list
        setCustomerItems((prev) => [newCustomer, ...prev]);

        // Reset form & close modal
        setFormData({
            customer: "",
            contact: "",
            email: "",
            address: "",
            totalOrderValue: "",
        });
        setIsAddModalOpen(false);
    };

    // Live Metrics calculated from customer dataset
    const totalClientsCount = customerItems.length;
    const totalOrderVolume = customerItems.reduce((acc, c) => acc + getNumericValue(c.totalOrderValue), 0);
    const vipCount = customerItems.filter((c) => c.tier === "VIP").length;
    const avgAccountValue = totalClientsCount > 0 ? totalOrderVolume / totalClientsCount : 0;

    const metrics = [
        {
            label: "Total clients",
            value: totalClientsCount.toLocaleString(),
            fullValue: totalClientsCount.toLocaleString(),
            note: "Across your workspace",
        },
        {
            label: "VIP accounts",
            value: vipCount.toLocaleString(),
            fullValue: `${vipCount} accounts over ₱250k`,
            note: "Clients with orders ₱250k+",
        },
        {
            label: "Total order volume",
            value: formatCompactPeso(totalOrderVolume),
            fullValue: formatPeso(totalOrderVolume),
            note: "Cumulative client lifetime value",
        },
        {
            label: "Avg. client value",
            value: `₱${Math.round(avgAccountValue).toLocaleString()}`,
            fullValue: formatPeso(avgAccountValue),
            note: "Per active account",
        },
    ];

    // Identify top customer account dynamically
    const topCustomer = customerItems.reduce<CustomerRow | null>((top, c) => {
        if (!top || getNumericValue(c.totalOrderValue) > getNumericValue(top.totalOrderValue)) {
            return c;
        }
        return top;
    }, null);

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1100px] lg:px-8 lg:py-10">
                {/* Header */}
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Customers</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage client accounts, contact details, delivery addresses, and lifetime sales.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4 shrink-0" aria-hidden="true" />
                        Add customer
                    </button>
                </header>

                {/* Metrics */}
                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-4 lg:gap-5">
                    {metrics.map((metric) => (
                        <li
                            key={metric.label}
                            className="min-w-0 overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6"
                        >
                            <p className="truncate text-xs font-medium text-[#7B8A91] lg:text-sm">{metric.label}</p>
                            <p
                                title={metric.fullValue || metric.value}
                                className="mt-4 truncate text-xl font-semibold leading-tight tracking-tight text-[#22343A] sm:text-2xl lg:mt-5 lg:text-2xl xl:text-3xl"
                            >
                                {metric.value}
                            </p>
                            <p className="mt-4 truncate text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                {metric.note}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* Customer Records Table Section */}
                <section className="mt-5 rounded-xl bg-white px-4 py-6 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                    {/* Top Toolbar */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#0C1F26] lg:text-lg">All customers</h2>
                            <p className="mt-1 text-xs font-medium text-[#7B8A91]">
                                Complete data catalog with all 7 CSV attributes and client tiers. Scroll horizontally to review all columns.
                            </p>
                        </div>

                        {/* Search & Filter Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-lg bg-[#F5F7F8] px-3.5 py-2 text-[#9AA6AB] transition focus-within:bg-white focus-within:shadow-xs sm:w-[280px] sm:flex-none">
                                <Search className="size-4 shrink-0" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search customer, contact, city..."
                                    className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#22343A] outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                    aria-label="Search customers"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                />
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-xs transition ${
                                    activeFilterCount > 0
                                        ? "bg-[#E8F5F3] text-[#07887D] hover:bg-[#D4EFEA]"
                                        : "bg-[#F5F7F8] text-[#22343A] hover:bg-[#EAEFF1]"
                                }`}
                                aria-label="Filter customers"
                            >
                                <Filter className="size-3.5 text-[#07887D]" />
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="flex size-4 items-center justify-center rounded-full bg-[#07887D] text-[10px] font-bold text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tabs and Active Filters */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F4F5] pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                const count =
                                    tab === "All clients"
                                        ? customerItems.length
                                        : customerItems.filter((c) => c.tier === tab).length;

                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => handleTabChange(tab)}
                                        className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                            isActive
                                                ? "bg-[#DDF4F0] font-semibold text-[#07887D]"
                                                : "text-[#6D7C84] hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                        }`}
                                        aria-pressed={isActive}
                                    >
                                        {tab} <span className="ml-1 text-[10px] opacity-75">{count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                {filters.city && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        City: {filters.city}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("city", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove city filter"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.tier && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Tier: {filters.tier}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("tier", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove tier filter"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.valueRange && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Value:{" "}
                                        {filters.valueRange === "over300"
                                            ? "Over ₱300k"
                                            : filters.valueRange === "100to300"
                                              ? "₱100k - ₱300k"
                                              : "Under ₱100k"}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("valueRange", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove value filter"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="cursor-pointer text-[11px] font-semibold text-[#7B8A91] hover:text-[#22343A]"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Table with all columns mapped */}
                    <div className="mt-3 overflow-x-auto rounded-lg border border-[#F0F4F5]">
                        <table className="min-w-[1300px] table-auto text-left text-sm lg:text-xs">
                            <thead className="bg-[#F8FAFB] text-[#6D7C84]">
                                <tr>
                                    {columns.map((column) => {
                                        const isSorted = sortConfig.key === column.key;

                                        return (
                                            <th
                                                key={column.key}
                                                className={`${column.minWidth} px-3.5 py-3 font-semibold`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleSort(column.key)}
                                                    className="flex cursor-pointer items-center gap-1.5 text-left font-semibold outline-none transition hover:text-[#22343A]"
                                                    aria-label={`Sort by ${column.label}`}
                                                >
                                                    <span>{column.label}</span>
                                                    <ArrowUpDown
                                                        className={`size-3 shrink-0 ${isSorted ? "text-[#07887D]" : "text-[#B0BAC0]"}`}
                                                        aria-hidden="true"
                                                    />
                                                    {isSorted && (
                                                        <span className="text-[10px] font-bold text-[#07887D]">
                                                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                                                        </span>
                                                    )}
                                                </button>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F4F5] text-[#001B26]">
                                {sortedCustomers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-3.5 py-12 text-center font-medium text-[#7B8A91]"
                                        >
                                            No customers match your search or filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedCustomers.map((customer, index) => (
                                        <tr
                                            key={`${customer.customer}-${customer.email}-${index}`}
                                            className="transition hover:bg-[#FAFBFB]"
                                        >
                                            <td className="px-3.5 py-3.5 font-semibold text-[#22343A]">
                                                {customer.customer}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#22343A]">
                                                {customer.contact}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-mono text-xs text-[#486581]">
                                                {customer.email}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#55656C]">
                                                {customer.address}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-semibold text-[#22343A]">
                                                {customer.totalOrderValue}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">
                                                {customer.firstOrderDate}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">
                                                {customer.previousOrderDate}
                                            </td>
                                            <td className="px-3.5 py-3.5">
                                                <span
                                                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${getTierBadgeClass(
                                                        customer.tier,
                                                    )}`}
                                                >
                                                    {customer.tier}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <footer className="mt-5 flex items-center justify-between gap-4 border-t border-[#F0F4F5] pt-4">
                        <p className="text-xs font-medium text-[#6D7C84]">
                            Showing {firstVisibleNumber}-{lastVisibleNumber} of {sortedCustomers.length.toLocaleString()} clients
                            {activeTab !== "All clients" ? ` in ${activeTab}` : ""}
                            {searchQuery || activeFilterCount > 0 ? " (filtered)" : ""}
                        </p>
                        <div className="flex items-center gap-3 text-[#6D7C84]">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={validCurrentPage === 1}
                                className="cursor-pointer rounded-md p-1.5 transition hover:bg-[#F3F5F6] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="size-4" aria-hidden="true" />
                            </button>
                            <span className="text-xs font-semibold text-[#22343A]">
                                {validCurrentPage} / {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={validCurrentPage === totalPages}
                                className="cursor-pointer rounded-md p-1.5 transition hover:bg-[#F3F5F6] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Next page"
                            >
                                <ChevronRight className="size-4" aria-hidden="true" />
                            </button>
                        </div>
                    </footer>
                </section>

                {/* Top Customer / Featured Account overview */}
                {topCustomer && (
                    <section className="mt-5 rounded-xl bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                        <h2 className="text-base font-semibold leading-none lg:text-lg">
                            {topCustomer.customer} - Top account overview
                        </h2>
                        <p className="mt-4 text-xs font-medium leading-5 text-[#22343A] lg:text-sm">
                            Highest lifetime sales account ({topCustomer.totalOrderValue}). Contact: {topCustomer.contact} ({topCustomer.email}). Location: {topCustomer.address}.
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-5 flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                        >
                            <Plus className="size-4" aria-hidden="true" />
                            Add customer
                        </button>
                    </section>
                )}
            </main>

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsFilterModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="customer-filter-modal-title"
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="customer-filter-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Filter Customers
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Narrow down clients by city, account tier, and order value.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(false)}
                                className="cursor-pointer rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close filter modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Filter Fields */}
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">City / Location</label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange("city", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Cities ({filterOptions.cities.length})</option>
                                    {filterOptions.cities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Client Tier</label>
                                <select
                                    value={filters.tier}
                                    onChange={(e) => handleFilterChange("tier", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Tiers (3)</option>
                                    <option value="VIP">VIP (Over ₱250,000)</option>
                                    <option value="Regular">Regular (₱100,000 - ₱250,000)</option>
                                    <option value="New">New (Under ₱100,000)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Order Value Range</label>
                                <select
                                    value={filters.valueRange}
                                    onChange={(e) => handleFilterChange("valueRange", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Value Ranges</option>
                                    <option value="over300">Over ₱300,000</option>
                                    <option value="100to300">₱100,000 - ₱300,000</option>
                                    <option value="under100">Under ₱100,000</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex items-center justify-between border-t border-[#F0F4F5] pt-4">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="cursor-pointer text-xs font-semibold text-[#7B8A91] transition hover:text-[#22343A]"
                            >
                                Clear all filters
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(false)}
                                className="cursor-pointer rounded-lg bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#06766D]"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#F0F4F5] pb-4">
                            <div>
                                <h3 id="add-customer-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Add Customer
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter client details to push a new customer into the customer catalog.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="cursor-pointer rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCustomer} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Customer / Company name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customer"
                                    value={formData.customer}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Metro Auto Works"
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
                                        placeholder="e.g. Carlo Flores"
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
                                        placeholder="e.g. carlo@metroautoworks.example"
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
                                    placeholder="e.g. 81 Pioneer St, Mandaluyong"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Initial Order Value (₱)
                                </label>
                                <input
                                    type="text"
                                    name="totalOrderValue"
                                    value={formData.totalOrderValue}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 150000"
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
