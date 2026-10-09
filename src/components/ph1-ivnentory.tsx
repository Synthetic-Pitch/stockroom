import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Plus, RotateCcw, X } from "lucide-react";
import Papa from "papaparse";
import mechanicInventoryCsv from "../assets/csv/mechanic_inventory.csv?raw";

type InventoryStatus = "In stock" | "Low stock" | "Reserved" | "Inspection" | "Out of stock";
type InventoryTab = "All items" | "Low stock" | "Reserved" | "Inspection";
type SortKey = keyof InventoryItemRow;
type SortDirection = "asc" | "desc";
type FilterKey = "category" | "location" | "arrivalDate";

type InventoryItemRow = {
    item: string;
    category: string;
    location: string;
    quantity: string;
    status: InventoryStatus;
    unitPrice: string;
    bulkTotalValue: string;
    arrivalDate: string;
};

type SortConfig = {
    key: SortKey;
    direction: SortDirection;
};

type MechanicInventoryCsvRow = {
    SKU?: string;
    Item_Name?: string;
    Category?: string;
    Location?: string;
    Quantity?: string;
    Status?: string;
    Unit_Price_PHP?: string;
    Bulk_Total_Value_PHP?: string;
    Arrival_Date?: string;
};

const itemsPerPage = 15;
const inventoryStatuses: InventoryStatus[] = ["In stock", "Low stock", "Reserved", "Inspection", "Out of stock"];

const tabs: InventoryTab[] = ["All items", "Low stock", "Reserved", "Inspection"];

const filterKeys: FilterKey[] = ["category", "location", "arrivalDate"];

const columns: Array<{ key: SortKey; label: string; className: string }> = [
    { key: "item", label: "Item / SKU", className: "w-[24%]" },
    { key: "category", label: "Category", className: "w-[13%]" },
    { key: "location", label: "Location", className: "w-[11%]" },
    { key: "quantity", label: "Quantity", className: "w-[10%]" },
    { key: "status", label: "Status", className: "w-[11%]" },
    { key: "unitPrice", label: "Unit price", className: "w-[10%]" },
    { key: "bulkTotalValue", label: "Value", className: "w-[11%]" },
    { key: "arrivalDate", label: "Date recieve", className: "w-[10%]" },
];

const getNumericValue = (value: string) => Number(value.replace(/[^0-9.-]/g, "")) || 0;

const getUniqueOptions = (items: InventoryItemRow[], key: FilterKey) =>
    Array.from(new Set(items.map((item) => item[key]).filter(Boolean))).sort((firstOption, secondOption) =>
        firstOption.localeCompare(secondOption, undefined, { numeric: true }),
    );

const formatPeso = (value: string | undefined) => {
    const amount = Number(value) || 0;
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getInventoryStatus = (status: string | undefined): InventoryStatus => {
    const matchedStatus = inventoryStatuses.find((inventoryStatus) => inventoryStatus === status);
    return matchedStatus ?? "In stock";
};

const initialInventoryItems: InventoryItemRow[] = Papa.parse<MechanicInventoryCsvRow>(mechanicInventoryCsv, {
    header: true,
    skipEmptyLines: true,
}).data.map((row) => ({
    item: `${row.Item_Name ?? "Unnamed item"} - ${row.SKU ?? "No SKU"}`,
    category: row.Category ?? "Uncategorized",
    location: row.Location ?? "Unassigned",
    quantity: getNumericValue(row.Quantity ?? "0").toLocaleString(),
    status: getInventoryStatus(row.Status),
    unitPrice: formatPeso(row.Unit_Price_PHP),
    bulkTotalValue: formatPeso(row.Bulk_Total_Value_PHP),
    arrivalDate: row.Arrival_Date ?? "No date",
}));

const getSortValue = (item: InventoryItemRow, key: SortKey) => {
    if (key === "quantity" || key === "unitPrice" || key === "bulkTotalValue") return getNumericValue(item[key]);
    return item[key].toLowerCase();
};

const getStatusClassName = (status: InventoryStatus) => {
    if (status === "Low stock") return "text-[#B7791F]";
    if (status === "Reserved") return "text-[#4F46E5]";
    if (status === "Inspection") return "text-[#C05621]";
    if (status === "Out of stock") return "text-[#C53030]";
    return "text-[#007F74]";
};

const InventoryPhase1 = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItemRow[]>(initialInventoryItems);
    const [activeTab, setActiveTab] = useState<InventoryTab>("All items");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "item", direction: "asc" });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<FilterKey, string>>({
        category: "",
        location: "",
        arrivalDate: "",
    });

    // Form inputs state
    const [formData, setFormData] = useState({
        item: "",
        category: "Packaging",
        location: "",
        quantity: "",
        unitPrice: "",
        status: "In stock" as InventoryStatus,
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

    const filterOptions = useMemo(
        () => ({
            category: getUniqueOptions(inventoryItems, "category"),
            location: getUniqueOptions(inventoryItems, "location"),
            arrivalDate: getUniqueOptions(inventoryItems, "arrivalDate"),
        }),
        [inventoryItems],
    );

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const visibleItems = useMemo(() => {
        const filteredItems = (activeTab === "All items"
            ? inventoryItems
            : inventoryItems.filter((item) => item.status === activeTab)
        ).filter((item) =>
            filterKeys.every((key) => !filters[key] || item[key] === filters[key]),
        );

        return [...filteredItems].sort((firstItem, secondItem) => {
            const firstValue = getSortValue(firstItem, sortConfig.key);
            const secondValue = getSortValue(secondItem, sortConfig.key);
            const direction = sortConfig.direction === "asc" ? 1 : -1;

            if (firstValue > secondValue) return direction;
            if (firstValue < secondValue) return -direction;
            return 0;
        });
    }, [activeTab, filters, inventoryItems, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageStartIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedItems = visibleItems.slice(pageStartIndex, pageStartIndex + itemsPerPage);
    const firstVisibleItemNumber = visibleItems.length === 0 ? 0 : pageStartIndex + 1;
    const lastVisibleItemNumber = Math.min(pageStartIndex + paginatedItems.length, visibleItems.length);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTabChange = (tab: InventoryTab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleSort = (key: SortKey) => {
        setSortConfig((currentSort) => ({
            key,
            direction: currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
        }));
        setCurrentPage(1);
    };

    const handleFilterChange = (key: FilterKey, value: string) => {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [key]: value,
        }));
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            category: "",
            location: "",
            arrivalDate: "",
        });
        setCurrentPage(1);
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
            bulkTotalValue: `₱${(priceNum * quantityNum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            arrivalDate: new Date().toISOString().slice(0, 10),
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
        <section className="mt-4 w-full rounded-2xl bg-white px-5 py-6 shadow-sm lg:mt-8 lg:rounded-xl lg:px-6 lg:py-6">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#0C1F26] lg:text-lg">Inventory</h2>
                    <p className="mt-1.5 text-xs font-medium text-[#6D7C84]">
                        Monitor quantities, availability, and item locations across your workspace.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setIsFilterModalOpen(true)}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-semibold shadow-xs transition ${
                            activeFilterCount > 0
                                ? "bg-[#E8F5F3] text-[#07887D] hover:bg-[#D4EFEA]"
                                : "bg-[#F5F7F8] text-[#22343A] hover:bg-[#EAEFF1]"
                        }`}
                        aria-label="Filter inventory"
                    >
                        <Filter className="size-3.5 text-[#07887D]" />
                        <span>Filter</span>
                        {activeFilterCount > 0 && (
                            <span className="flex size-4 items-center justify-center rounded-full bg-[#07887D] text-[10px] font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#07887D] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#06766D]"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Add item
                    </button>
                </div>
            </header>

            {/* Tabs and Active Filters Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F4F5] pb-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        const count = tab === "All items" ? inventoryItems.length : inventoryItems.filter((item) => item.status === tab).length;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => handleTabChange(tab)}
                                className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition ${
                                    isActive
                                        ? "bg-[#DDF4F0] text-[#07887D] font-semibold"
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
                        {filters.category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#47a9a1] shadow-xs">
                                Category: {filters.category}
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange("category", "")}
                                    className="cursor-pointer text-[#07887D] hover:opacity-75"
                                    aria-label="Remove category filter"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {filters.location && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                Location: {filters.location}
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange("location", "")}
                                    className="cursor-pointer text-[#07887D] hover:opacity-75"
                                    aria-label="Remove location filter"
                                >
                                    <X className="size-3" />
                                </button>
                            </span>
                        )}
                        {filters.arrivalDate && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                Date: {filters.arrivalDate}
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange("arrivalDate", "")}
                                    className="cursor-pointer text-[#07887D] hover:opacity-75"
                                    aria-label="Remove arrival date filter"
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

            {/* Table */}
            <div className="mt-3 overflow-x-auto">
                <table className="min-w-[1060px] table-fixed text-left text-sm lg:text-xs">
                    <thead className="bg-[#F8FAFB] text-[#6D7C84]">
                        <tr>
                            {columns.map((column) => {
                                const isSorted = sortConfig.key === column.key;
                                return (
                                    <th key={column.key} className={column.className + " px-3.5 py-3 font-semibold"}>
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
                        {visibleItems.length > 0 ? (
                            paginatedItems.map((item, index) => (
                                <tr key={item.item + "-" + (pageStartIndex + index)} className="transition hover:bg-[#FAFBFB]">
                                    <td className="px-3.5 py-3.5 font-semibold">{item.item}</td>
                                    <td className="px-3.5 py-3.5">{item.category}</td>
                                    <td className="px-3.5 py-3.5">{item.location}</td>
                                    <td className="px-3.5 py-3.5">{item.quantity}</td>
                                    <td className={"px-3.5 py-3.5 font-semibold " + getStatusClassName(item.status)}>{item.status}</td>
                                    <td className="px-3.5 py-3.5">{item.unitPrice}</td>
                                    <td className="px-3.5 py-3.5">{item.bulkTotalValue}</td>
                                    <td className="px-3.5 py-3.5 text-[#6D7C84]">{item.arrivalDate}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-3 py-10 text-center font-medium text-[#6D7C84]">
                                    No inventory items found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <footer className="mt-5 flex items-center justify-between gap-4 border-t border-[#F0F4F5] pt-4">
                <p className="text-xs font-medium text-[#6D7C84]">
                    Showing {firstVisibleItemNumber}-{lastVisibleItemNumber} of {visibleItems.length} items
                    {activeTab !== "All items" ? ` in ${activeTab}` : ""}
                </p>
                <div className="flex items-center gap-3 text-[#6D7C84]">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={validCurrentPage === totalPages}
                        className="cursor-pointer rounded-md p-1.5 transition hover:bg-[#F3F5F6] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
                    >
                        <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                </div>
            </footer>

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsFilterModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="dashboard-filter-modal-title"
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="dashboard-filter-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Filter Inventory
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Filter items across category, location, and arrival dates.
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

                        {/* Modal Fields */}
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange("category", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Categories ({filterOptions.category.length})</option>
                                    {filterOptions.category.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Location</label>
                                <select
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange("location", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Locations ({filterOptions.location.length})</option>
                                    {filterOptions.location.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Arrival Date</label>
                                <select
                                    value={filters.arrivalDate}
                                    onChange={(e) => handleFilterChange("arrivalDate", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Dates ({filterOptions.arrivalDate.length})</option>
                                    {filterOptions.arrivalDate.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex items-center justify-between pt-2">
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                disabled={activeFilterCount === 0}
                                className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#7B8A91] transition hover:text-[#22343A] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset all
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(false)}
                                className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#06766D]"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="dashboard-add-item-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Add Inventory Item
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new item into the inventory table.
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
                        <form onSubmit={handleAddItem} className="mt-4 space-y-4">
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
                                    className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
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
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
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
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
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
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option>In stock</option>
                                    <option>Low stock</option>
                                    <option>Reserved</option>
                                    <option>Inspection</option>
                                    <option>Out of stock</option>
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="cursor-pointer rounded-lg px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#06766D]"
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
