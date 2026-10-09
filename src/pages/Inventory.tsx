import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Plus, RotateCcw, Search, X } from "lucide-react";
import Papa from "papaparse";
import Navbar from "../components/navbar";
import mechanicInventoryItemsCsv from "../assets/csv/mechanic_inventory_items.csv?raw";

type InventoryStatus = "In stock" | "Low stock" | "Reserved" | "Inspection" | "Out of stock";
type InventoryTab = "All items" | "In stock" | "Low stock" | "Reserved" | "Inspection";
type SortKey = keyof InventoryItemRow;
type SortDirection = "asc" | "desc";
type FilterKey = "category" | "condition" | "location" | "itemSource";

export interface InventoryItemRow {
    itemName: string;
    sku: string;
    serialNumber: string;
    category: string;
    condition: string;
    location: string;
    quantity: string;
    reorderPoint: string;
    status: InventoryStatus;
    unitPrice: string;
    value: string;
    dateReceived: string;
    dateInspect: string;
    dateApproved: string;
    inspectedBy: string;
    itemSource: string;
}

type SortConfig = {
    key: SortKey;
    direction: SortDirection;
};

type MechanicInventoryItemsCsvRow = {
    "Item Name"?: string;
    "SKU"?: string;
    "Serial Number"?: string;
    "Category"?: string;
    "Condition"?: string;
    "Location"?: string;
    "Quantity"?: string;
    "Reorder Point"?: string;
    "Status"?: string;
    "Unit Price"?: string;
    "Value"?: string;
    "Date Recieved"?: string;
    "Date Inspect"?: string;
    "Date Approved"?: string;
    "Inspected by"?: string;
    "item source"?: string;
};

const itemsPerPage = 15;
const inventoryStatuses: InventoryStatus[] = ["In stock", "Low stock", "Reserved", "Inspection", "Out of stock"];
const tabs: InventoryTab[] = ["All items", "In stock", "Low stock", "Reserved", "Inspection"];
const filterKeys: FilterKey[] = ["category", "condition", "location", "itemSource"];

// All 16 headers mapped directly from mechanic_inventory_items.csv
const columns: Array<{ key: SortKey; label: string; minWidth: string }> = [
    { key: "itemName", label: "Item Name", minWidth: "min-w-[220px]" },
    { key: "sku", label: "SKU", minWidth: "min-w-[150px]" },
    { key: "serialNumber", label: "Serial Number", minWidth: "min-w-[150px]" },
    { key: "category", label: "Category", minWidth: "min-w-[180px]" },
    { key: "condition", label: "Condition", minWidth: "min-w-[130px]" },
    { key: "location", label: "Location", minWidth: "min-w-[110px]" },
    { key: "quantity", label: "Quantity", minWidth: "min-w-[100px]" },
    { key: "reorderPoint", label: "Reorder Point", minWidth: "min-w-[120px]" },
    { key: "status", label: "Status", minWidth: "min-w-[120px]" },
    { key: "unitPrice", label: "Unit Price", minWidth: "min-w-[120px]" },
    { key: "value", label: "Value", minWidth: "min-w-[130px]" },
    { key: "dateReceived", label: "Date Received", minWidth: "min-w-[130px]" },
    { key: "dateInspect", label: "Date Inspect", minWidth: "min-w-[130px]" },
    { key: "dateApproved", label: "Date Approved", minWidth: "min-w-[130px]" },
    { key: "inspectedBy", label: "Inspected By", minWidth: "min-w-[160px]" },
    { key: "itemSource", label: "Item Source", minWidth: "min-w-[190px]" },
];

const getNumericValue = (val: string | undefined) => Number(String(val ?? "").replace(/[^0-9.-]/g, "")) || 0;

const formatPeso = (val: string | undefined) => {
    const amount = Number(String(val ?? "").replace(/[^0-9.-]/g, "")) || 0;
    return `₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getInventoryStatus = (status: string | undefined): InventoryStatus => {
    const matched = inventoryStatuses.find((s) => s.toLowerCase() === (status ?? "").toLowerCase());
    return matched ?? "In stock";
};

// Map all 16 columns from mechanic_inventory_items.csv
const initialInventoryItems: InventoryItemRow[] = Papa.parse<MechanicInventoryItemsCsvRow>(
    mechanicInventoryItemsCsv,
    {
        header: true,
        skipEmptyLines: true,
    },
).data.map((row) => ({
    itemName: row["Item Name"] ?? "Unnamed item",
    sku: row["SKU"] ?? "N/A",
    serialNumber: row["Serial Number"] ?? "N/A",
    category: row["Category"] ?? "Uncategorized",
    condition: row["Condition"] ?? "Standard",
    location: row["Location"] ?? "Unassigned",
    quantity: getNumericValue(row["Quantity"] ?? "0").toLocaleString(),
    reorderPoint: getNumericValue(row["Reorder Point"] ?? "0").toLocaleString(),
    status: getInventoryStatus(row["Status"]),
    unitPrice: formatPeso(row["Unit Price"]),
    value: formatPeso(row["Value"]),
    dateReceived: row["Date Recieved"] ?? "No date",
    dateInspect: row["Date Inspect"] ?? "N/A",
    dateApproved: row["Date Approved"] ?? "N/A",
    inspectedBy: row["Inspected by"] ?? "N/A",
    itemSource: row["item source"] ?? "N/A",
}));

const getSortValue = (item: InventoryItemRow, key: SortKey) => {
    if (key === "quantity" || key === "reorderPoint" || key === "unitPrice" || key === "value") {
        return getNumericValue(item[key]);
    }
    const val = item[key];
    return typeof val === "string" ? val.toLowerCase() : "";
};

const getStatusClassName = (status: InventoryStatus) => {
    if (status === "Low stock") return "text-[#B7791F]";
    if (status === "Reserved") return "text-[#4F46E5]";
    if (status === "Inspection") return "text-[#C05621]";
    if (status === "Out of stock") return "text-[#C53030]";
    return "text-[#007F74]";
};

const getConditionBadgeClass = (condition: string) => {
    if (condition.includes("Brand New")) return "bg-emerald-50 text-emerald-700";
    if (condition.includes("Refurbished")) return "bg-blue-50 text-blue-700";
    if (condition.includes("Used")) return "bg-amber-50 text-amber-700";
    if (condition.includes("Damaged") || condition.includes("Defective")) return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-700";
};

const getUniqueOptions = (items: InventoryItemRow[], key: FilterKey) =>
    Array.from(new Set(items.map((item) => item[key]).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
    );

const Inventory = () => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItemRow[]>(initialInventoryItems);
    const [activeTab, setActiveTab] = useState<InventoryTab>("All items");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "itemName", direction: "asc" });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [filters, setFilters] = useState<Record<FilterKey, string>>({
        category: "",
        condition: "",
        location: "",
        itemSource: "",
    });

    // Form inputs state for Add Item
    const [formData, setFormData] = useState({
        itemName: "",
        sku: "",
        serialNumber: "",
        category: "Hand Tools",
        condition: "Brand New",
        location: "",
        quantity: "",
        reorderPoint: "10",
        unitPrice: "",
        status: "In stock" as InventoryStatus,
        itemSource: "",
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
            condition: getUniqueOptions(inventoryItems, "condition"),
            location: getUniqueOptions(inventoryItems, "location"),
            itemSource: getUniqueOptions(inventoryItems, "itemSource"),
        }),
        [inventoryItems],
    );

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    // Filter and sort items across all fields
    const visibleItems = useMemo(() => {
        const search = searchQuery.trim().toLowerCase();

        const filtered = inventoryItems.filter((item) => {
            // Tab status filter
            if (activeTab !== "All items" && item.status !== activeTab) {
                return false;
            }

            // Key-based modal filters
            const matchesModalFilters = filterKeys.every(
                (key) => !filters[key] || item[key] === filters[key],
            );
            if (!matchesModalFilters) return false;

            // Search query filter across all relevant fields
            if (search) {
                const matchesSearch =
                    item.itemName.toLowerCase().includes(search) ||
                    item.sku.toLowerCase().includes(search) ||
                    item.serialNumber.toLowerCase().includes(search) ||
                    item.category.toLowerCase().includes(search) ||
                    item.condition.toLowerCase().includes(search) ||
                    item.location.toLowerCase().includes(search) ||
                    item.status.toLowerCase().includes(search) ||
                    item.inspectedBy.toLowerCase().includes(search) ||
                    item.itemSource.toLowerCase().includes(search);
                if (!matchesSearch) return false;
            }

            return true;
        });

        return [...filtered].sort((a, b) => {
            const firstVal = getSortValue(a, sortConfig.key);
            const secondVal = getSortValue(b, sortConfig.key);
            const dir = sortConfig.direction === "asc" ? 1 : -1;

            if (firstVal > secondVal) return dir;
            if (firstVal < secondVal) return -dir;
            return 0;
        });
    }, [activeTab, filters, inventoryItems, searchQuery, sortConfig]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageStartIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedItems = visibleItems.slice(pageStartIndex, pageStartIndex + itemsPerPage);
    const firstVisibleNumber = visibleItems.length === 0 ? 0 : pageStartIndex + 1;
    const lastVisibleNumber = Math.min(pageStartIndex + paginatedItems.length, visibleItems.length);

    // Handlers
    const handleTabChange = (tab: InventoryTab) => {
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
        setFilters({ category: "", condition: "", location: "", itemSource: "" });
        setCurrentPage(1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleAddItem = (e: FormEvent) => {
        e.preventDefault();

        const qtyNum = parseInt(formData.quantity, 10);
        if (!formData.itemName.trim() || !formData.location.trim() || !Number.isFinite(qtyNum) || qtyNum < 0) {
            return;
        }

        const priceNum = parseFloat(formData.unitPrice.replace(/[₱,]/g, "")) || 0;
        const reorderNum = parseInt(formData.reorderPoint, 10) || 0;
        const totalVal = priceNum * qtyNum;

        const newItem: InventoryItemRow = {
            itemName: formData.itemName.trim(),
            sku: formData.sku.trim() || "HT-" + Math.floor(100 + Math.random() * 900),
            serialNumber: formData.serialNumber.trim() || "LOT-2026-" + Math.floor(1000 + Math.random() * 9000),
            category: formData.category,
            condition: formData.condition,
            location: formData.location.trim(),
            quantity: qtyNum.toLocaleString(),
            reorderPoint: reorderNum.toLocaleString(),
            status: formData.status,
            unitPrice: `₱${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            value: `₱${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            dateReceived: new Date().toISOString().slice(0, 10),
            dateInspect: "Pending",
            dateApproved: "Pending",
            inspectedBy: "Pending Inspection",
            itemSource: formData.itemSource.trim() || "Direct Distributor",
        };

        setInventoryItems((prev) => [newItem, ...prev]);

        setFormData({
            itemName: "",
            sku: "",
            serialNumber: "",
            category: "Hand Tools",
            condition: "Brand New",
            location: "",
            quantity: "",
            reorderPoint: "10",
            unitPrice: "",
            status: "In stock",
            itemSource: "",
        });
        setIsAddModalOpen(false);
    };

    // Live Metrics calculated from catalog
    const totalCount = inventoryItems.length;
    const inStockCount = inventoryItems.filter((i) => i.status === "In stock").length;
    const lowStockCount = inventoryItems.filter((i) => i.status === "Low stock").length;
    const inspectionCount = inventoryItems.filter((i) => i.status === "Inspection").length;

    const metrics = [
        { label: "Total SKUs", value: totalCount.toLocaleString(), note: "Across your workspace" },
        { label: "In stock", value: inStockCount.toLocaleString(), note: "Ready for fulfillment" },
        { label: "Low stock", value: lowStockCount.toLocaleString(), note: "Replenishment recommended" },
        { label: "Inspection", value: inspectionCount.toLocaleString(), note: "Pending quality approval" },
    ];

    const lowStockSample = inventoryItems.filter((i) => i.status === "Low stock").slice(0, 3);

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1100px] lg:px-8 lg:py-10">
                {/* Header */}
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Inventory</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Manage every SKU, stock level, inspection status, and storage location.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Add new item
                    </button>
                </header>

                {/* Metrics */}
                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-4 lg:gap-5">
                    {metrics.map((metric) => (
                        <li
                            key={metric.label}
                            className="min-w-0 overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6"
                        >
                            <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{metric.label}</p>
                            <p className="mt-4 break-words text-2xl font-semibold leading-tight text-[#22343A] lg:mt-5 lg:text-4xl">
                                {metric.value}
                            </p>
                            <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">
                                {metric.note}
                            </p>
                        </li>
                    ))}
                </ul>

                {/* All Inventory Section */}
                <section className="mt-5 rounded-xl bg-white px-4 py-6 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                    {/* Top Toolbar */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#0C1F26] lg:text-lg">All inventory</h2>
                            <p className="mt-1 text-xs font-medium text-[#7B8A91]">
                                Complete data catalog with all 16 attributes mapped. Scroll horizontally to review all columns.
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
                                    placeholder="Search by SKU, item, serial, source..."
                                    className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#22343A] outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                    aria-label="Search inventory"
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
                        </div>
                    </div>

                    {/* Tabs and Active Filters */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#F0F4F5] pb-3">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                const count =
                                    tab === "All items"
                                        ? inventoryItems.length
                                        : inventoryItems.filter((i) => i.status === tab).length;

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
                                {filters.category && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
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
                                {filters.condition && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Condition: {filters.condition}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("condition", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove condition filter"
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
                                {filters.itemSource && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Source: {filters.itemSource}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("itemSource", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove source filter"
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

                    {/* Table with all 16 columns mapped */}
                    <div className="mt-3 overflow-x-auto rounded-lg border border-[#F0F4F5]">
                        <table className="min-w-[2100px] table-auto text-left text-sm lg:text-xs">
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
                                {visibleItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-3.5 py-12 text-center font-medium text-[#7B8A91]">
                                            No inventory items match your search or filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedItems.map((item, index) => (
                                        <tr
                                            key={`${item.sku}-${item.itemName}-${pageStartIndex + index}`}
                                            className="transition hover:bg-[#FAFBFB]"
                                        >
                                            <td className="px-3.5 py-3.5 font-semibold text-[#22343A]">{item.itemName}</td>
                                            <td className="px-3.5 py-3.5 font-mono text-[11px] font-medium text-[#486581]">
                                                {item.sku}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-mono text-[11px] text-[#627D98]">
                                                {item.serialNumber}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#55656C]">{item.category}</td>
                                            <td className="px-3.5 py-3.5">
                                                <span
                                                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${getConditionBadgeClass(
                                                        item.condition,
                                                    )}`}
                                                >
                                                    {item.condition}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#55656C]">{item.location}</td>
                                            <td className="px-3.5 py-3.5 font-semibold text-[#22343A]">{item.quantity}</td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">{item.reorderPoint}</td>
                                            <td className={`px-3.5 py-3.5 font-semibold ${getStatusClassName(item.status)}`}>
                                                {item.status}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#22343A]">{item.unitPrice}</td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#22343A]">{item.value}</td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">{item.dateReceived}</td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">{item.dateInspect}</td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">{item.dateApproved}</td>
                                            <td className="px-3.5 py-3.5 text-[#55656C]">{item.inspectedBy}</td>
                                            <td className="px-3.5 py-3.5 text-[#55656C]">{item.itemSource}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <footer className="mt-5 flex items-center justify-between gap-4 border-t border-[#F0F4F5] pt-4">
                        <p className="text-xs font-medium text-[#6D7C84]">
                            Showing {firstVisibleNumber}-{lastVisibleNumber} of {visibleItems.length.toLocaleString()} items
                            {activeTab !== "All items" ? ` in ${activeTab}` : ""}
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

                {/* Low Stock Alerts */}
                <section className="mt-5 rounded-xl bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Low stock alerts</h2>
                    <p className="mt-4 text-xs font-medium text-[#22343A] lg:text-sm">
                        {lowStockCount} items currently need replenishment.
                        {lowStockSample.length > 0 &&
                            ` ${lowStockSample.map((i) => `${i.itemName}: ${i.quantity} on hand (reorder at ${i.reorderPoint})`).join(", ")}.`}
                    </p>
                    <button
                        type="button"
                        onClick={() => handleTabChange("Low stock")}
                        className="mt-5 flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        View low stock items
                    </button>
                </section>
            </main>

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsFilterModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="inventory-filter-modal-title"
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="inventory-filter-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Filter Inventory
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Narrow down catalog by category, condition, location, and suppliers.
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
                                <label className="block text-xs font-semibold text-[#22343A]">Condition</label>
                                <select
                                    value={filters.condition}
                                    onChange={(e) => handleFilterChange("condition", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Conditions ({filterOptions.condition.length})</option>
                                    {filterOptions.condition.map((opt) => (
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
                                <label className="block text-xs font-semibold text-[#22343A]">Item Source / Supplier</label>
                                <select
                                    value={filters.itemSource}
                                    onChange={(e) => handleFilterChange("itemSource", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Suppliers ({filterOptions.itemSource.length})</option>
                                    {filterOptions.itemSource.map((opt) => (
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
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="modal-title" className="text-lg font-bold text-[#22343A]">
                                    Add New Inventory Item
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to record a new item into All inventory catalog.
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

                        {/* Form */}
                        <form onSubmit={handleAddItem} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Item Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Breaker Bar 24in"
                                    className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        placeholder="e.g. HT-BKB-24I-615"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Serial Number</label>
                                    <input
                                        type="text"
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g. LOT-2026-5120"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
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
                                        {filterOptions.category.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    >
                                        {filterOptions.condition.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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
                                        placeholder="e.g. H-06-04"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Item Source / Supplier</label>
                                    <input
                                        type="text"
                                        name="itemSource"
                                        value={formData.itemSource}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Oriental Tools & Equipment"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Reorder Point</label>
                                    <input
                                        type="number"
                                        name="reorderPoint"
                                        min="0"
                                        value={formData.reorderPoint}
                                        onChange={handleInputChange}
                                        placeholder="10"
                                        className="mt-1.5 w-full rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Unit Price (₱) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0.00"
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
                                    {inventoryStatuses.map((st) => (
                                        <option key={st} value={st}>
                                            {st}
                                        </option>
                                    ))}
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
        </div>
    );
};

export default Inventory;
