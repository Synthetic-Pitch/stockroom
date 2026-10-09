import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Filter, Plus, Search, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import Navbar from "../components/navbar";
import supplyRequestsWorkflowCsv from "../assets/csv/supply_requests_workflow.csv?raw";

type RequestTab = "All requests" | "Pending review" | "Approved" | "In procurement" | "Fulfilled" | "Rejected";
type SortKey = keyof SupplyRequestRow;
type SortDirection = "asc" | "desc";
type FilterKey = "department" | "urgency" | "stage";

export interface SupplyRequestRow {
    request: string;
    requestedBy: string;
    department: string;
    item: string;
    quantity: string;
    proposedBudget: string;
    urgency: string;
    stage: string;
    requestDate: string;
}

type SupplyRequestCsvRow = {
    "Request"?: string;
    "Requested by"?: string;
    "Department"?: string;
    "Item"?: string;
    "Quantity"?: string;
    "Proposed Budget"?: string;
    "Urgency"?: string;
    "Stage"?: string;
    "Request Date"?: string;
};

const itemsPerPage = 15;
const tabs: RequestTab[] = [
    "All requests",
    "Pending review",
    "Approved",
    "In procurement",
    "Fulfilled",
    "Rejected",
];

// All 9 columns mapped directly from supply_requests_workflow.csv
const columns: Array<{ key: SortKey; label: string; minWidth: string }> = [
    { key: "request", label: "Request", minWidth: "min-w-[120px]" },
    { key: "requestedBy", label: "Requested by", minWidth: "min-w-[180px]" },
    { key: "department", label: "Department", minWidth: "min-w-[190px]" },
    { key: "item", label: "Item", minWidth: "min-w-[220px]" },
    { key: "quantity", label: "Quantity", minWidth: "min-w-[100px]" },
    { key: "proposedBudget", label: "Proposed Budget", minWidth: "min-w-[150px]" },
    { key: "urgency", label: "Urgency", minWidth: "min-w-[120px]" },
    { key: "stage", label: "Stage", minWidth: "min-w-[140px]" },
    { key: "requestDate", label: "Request Date", minWidth: "min-w-[130px]" },
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

// Map all 9 columns from supply_requests_workflow.csv
const initialRequests: SupplyRequestRow[] = Papa.parse<SupplyRequestCsvRow>(
    supplyRequestsWorkflowCsv,
    {
        header: true,
        skipEmptyLines: true,
    },
).data.map((row) => ({
    request: row["Request"] ?? "SR-0000",
    requestedBy: row["Requested by"] ?? "Unknown",
    department: row["Department"] ?? "General Maintenance",
    item: row["Item"] ?? "Unnamed item",
    quantity: getNumericValue(row["Quantity"] ?? "0").toLocaleString(),
    proposedBudget: formatPeso(row["Proposed Budget"]),
    urgency: row["Urgency"] ?? "Medium",
    stage: row["Stage"] ?? "Pending review",
    requestDate: row["Request Date"] ?? new Date().toISOString().slice(0, 10),
}));

const getUrgencyBadgeClass = (urgency: string) => {
    const u = (urgency ?? "").toLowerCase();
    if (u === "critical") return "bg-red-50 text-red-700";
    if (u === "high") return "bg-amber-50 text-amber-700";
    if (u === "medium") return "bg-blue-50 text-blue-700";
    if (u === "low") return "bg-gray-100 text-gray-700";
    return "bg-gray-100 text-gray-700";
};

const getStageBadgeClass = (stage: string) => {
    const s = (stage ?? "").toLowerCase();
    if (s === "approved") return "bg-emerald-50 text-emerald-700";
    if (s === "pending review") return "bg-amber-50 text-amber-700";
    if (s === "in procurement") return "bg-indigo-50 text-indigo-700";
    if (s === "fulfilled") return "bg-teal-50 text-teal-700";
    if (s === "rejected") return "bg-rose-50 text-rose-700";
    return "bg-gray-100 text-gray-700";
};

const SupplyRequest = () => {
    const location = useLocation();
    const locationState = location.state as { autoOpenCreate?: boolean } | null;
    const searchParams = new URLSearchParams(location.search);
    const shouldAutoOpen = Boolean(locationState?.autoOpenCreate || searchParams.get("action") === "create");

    const [requestItems, setRequestItems] = useState<SupplyRequestRow[]>(initialRequests);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(shouldAutoOpen);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<RequestTab>("All requests");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: "requestDate",
        direction: "desc",
    });

    const [filters, setFilters] = useState<Record<FilterKey, string>>({
        department: "",
        urgency: "",
        stage: "",
    });

    // Form inputs state
    const [formData, setFormData] = useState({
        requestedBy: "",
        department: "Body Shop & Fabrication",
        item: "",
        quantity: "",
        proposedBudget: "",
        urgency: "Medium",
        stage: "Pending review",
    });

    // Clear navigation state once opened to avoid re-triggering on manual navigation
    useEffect(() => {
        if (shouldAutoOpen) {
            window.history.replaceState({}, document.title);
        }
    }, [shouldAutoOpen]);

    // Close modals on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsCreateModalOpen(false);
                setIsFilterModalOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Filter options extracted dynamically from current dataset
    const filterOptions = useMemo(() => {
        const departments = Array.from(new Set(requestItems.map((r) => r.department))).filter(Boolean).sort();
        const urgencies = Array.from(new Set(requestItems.map((r) => r.urgency))).filter(Boolean).sort();
        const stages = Array.from(new Set(requestItems.map((r) => r.stage))).filter(Boolean).sort();
        return {
            department: departments,
            urgency: urgencies,
            stage: stages,
        };
    }, [requestItems]);

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    // Filter requests by activeTab, filter modal selections, and search query
    const filteredRequests = useMemo(() => {
        return requestItems.filter((req) => {
            // Tab filter
            if (activeTab !== "All requests" && req.stage.toLowerCase() !== activeTab.toLowerCase()) {
                return false;
            }

            // Modal filters
            if (filters.department && req.department !== filters.department) {
                return false;
            }
            if (filters.urgency && req.urgency !== filters.urgency) {
                return false;
            }
            if (filters.stage && req.stage !== filters.stage) {
                return false;
            }

            // Search query across all 9 mapped fields
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                req.request.toLowerCase().includes(q) ||
                req.requestedBy.toLowerCase().includes(q) ||
                req.department.toLowerCase().includes(q) ||
                req.item.toLowerCase().includes(q) ||
                req.quantity.toLowerCase().includes(q) ||
                req.proposedBudget.toLowerCase().includes(q) ||
                req.urgency.toLowerCase().includes(q) ||
                req.stage.toLowerCase().includes(q) ||
                req.requestDate.toLowerCase().includes(q)
            );
        });
    }, [requestItems, activeTab, filters, searchQuery]);

    // Safe sorting
    const sortedRequests = useMemo(() => {
        const items = [...filteredRequests];
        items.sort((a, b) => {
            if (sortConfig.key === "quantity" || sortConfig.key === "proposedBudget") {
                const valA = getNumericValue(a[sortConfig.key]);
                const valB = getNumericValue(b[sortConfig.key]);
                return sortConfig.direction === "asc" ? valA - valB : valB - valA;
            }

            const strA = (a[sortConfig.key] ?? "").toLowerCase();
            const strB = (b[sortConfig.key] ?? "").toLowerCase();

            if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
            if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
        return items;
    }, [filteredRequests, sortConfig]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(sortedRequests.length / itemsPerPage));
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const pageStartIndex = (validCurrentPage - 1) * itemsPerPage;
    const paginatedRequests = sortedRequests.slice(pageStartIndex, pageStartIndex + itemsPerPage);
    const firstVisibleNumber = sortedRequests.length === 0 ? 0 : pageStartIndex + 1;
    const lastVisibleNumber = Math.min(pageStartIndex + paginatedRequests.length, sortedRequests.length);

    // Handlers
    const handleTabChange = (tab: RequestTab) => {
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
        setFilters({ department: "", urgency: "", stage: "" });
        setCurrentPage(1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateRequest = (e: FormEvent) => {
        e.preventDefault();

        const quantityNum = parseInt(formData.quantity, 10);
        const budgetNum = parseFloat(formData.proposedBudget.replace(/[^0-9.-]/g, "")) || 0;
        if (!formData.requestedBy.trim() || !formData.item.trim() || !Number.isFinite(quantityNum) || quantityNum < 1) {
            return;
        }

        // Generate the next request ID (SR-0121, SR-0122, ...)
        const maxId = requestItems.reduce((max, row) => {
            const match = row.request.match(/^SR-(\d+)/);
            const numericId = match ? parseInt(match[1], 10) : 0;
            return numericId > max ? numericId : max;
        }, 0);

        const newRequest: SupplyRequestRow = {
            request: `SR-${String(maxId + 1).padStart(4, "0")}`,
            requestedBy: formData.requestedBy.trim(),
            department: formData.department.trim() || "General Maintenance",
            item: formData.item.trim(),
            quantity: quantityNum.toLocaleString(),
            proposedBudget: formatPeso(budgetNum),
            urgency: formData.urgency,
            stage: formData.stage,
            requestDate: new Date().toISOString().slice(0, 10),
        };

        // Push new request to top of list
        setRequestItems((prev) => [newRequest, ...prev]);

        // Reset form & close modal
        setFormData({
            requestedBy: "",
            department: "Body Shop & Fabrication",
            item: "",
            quantity: "",
            proposedBudget: "",
            urgency: "Medium",
            stage: "Pending review",
        });
        setIsCreateModalOpen(false);
    };

    // Live Metrics calculated from workflow records
    const pendingCount = requestItems.filter((r) => r.stage.toLowerCase().includes("pending")).length;
    const approvedCount = requestItems.filter((r) => r.stage.toLowerCase().includes("approved")).length;
    const fulfilledCount = requestItems.filter((r) => r.stage.toLowerCase().includes("fulfilled")).length;
    const totalBudget = requestItems.reduce((acc, r) => acc + getNumericValue(r.proposedBudget), 0);

    const metrics = [
        { label: "Pending review", value: pendingCount.toLocaleString(), note: "Awaiting supervisor approval" },
        { label: "Approved", value: approvedCount.toLocaleString(), note: "Ready for procurement queue" },
        { label: "Fulfilled", value: fulfilledCount.toLocaleString(), note: "Successfully dispatched" },
        {
            label: "Total budget",
            value: formatCompactPeso(totalBudget),
            fullValue: formatPeso(totalBudget),
            note: "Across all workflow requests",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1100px] lg:px-8 lg:py-10">
                {/* Header */}
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">Supply requests</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            Review replenishment needs, departments, approvals, and budget tracking.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4 shrink-0" aria-hidden="true" />
                        Create request
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
                                title={"fullValue" in metric ? (metric.fullValue as string) : metric.value}
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

                {/* Request Workflow Table Section */}
                <section className="mt-5 rounded-xl bg-white px-4 py-6 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                    {/* Top Toolbar */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#0C1F26] lg:text-lg">Request workflow</h2>
                            <p className="mt-1 text-xs font-medium text-[#7B8A91]">
                                Complete data catalog with all 9 attributes mapped from workflow records. Scroll horizontally to review all columns.
                            </p>
                        </div>

                        {/* Search & Filter Buttons */}
                        <div className="flex  items-center gap-2.5">
                            <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-lg bg-[#F5F7F8] px-3.5 py-2 text-[#9AA6AB] transition focus-within:bg-white focus-within:shadow-xs sm:w-[280px] sm:flex-none">
                                <Search className="size-4 shrink-0" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="Search request, user, item, dept..."
                                    className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#22343A] outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                    aria-label="Search supply requests"
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
                                aria-label="Filter supply requests"
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
                                    tab === "All requests"
                                        ? requestItems.length
                                        : requestItems.filter((r) => r.stage.toLowerCase() === tab.toLowerCase()).length;

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
                                {filters.department && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Dept: {filters.department}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("department", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove department filter"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.urgency && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Urgency: {filters.urgency}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("urgency", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove urgency filter"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {filters.stage && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5F3] px-2.5 py-1 text-[11px] font-semibold text-[#07887D] shadow-xs">
                                        Stage: {filters.stage}
                                        <button
                                            type="button"
                                            onClick={() => handleFilterChange("stage", "")}
                                            className="cursor-pointer text-[#07887D] hover:opacity-75"
                                            aria-label="Remove stage filter"
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

                    {/* Table with all 9 columns mapped */}
                    <div className="mt-3 overflow-x-auto rounded-lg border border-[#F0F4F5]">
                        <table className="min-w-[1240px] table-auto text-left text-sm lg:text-xs">
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
                                {sortedRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={columns.length}
                                            className="px-3.5 py-12 text-center font-medium text-[#7B8A91]"
                                        >
                                            No supply requests match your search or filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRequests.map((request) => (
                                        <tr
                                            key={request.request}
                                            className="transition hover:bg-[#FAFBFB]"
                                        >
                                            <td className="px-3.5 py-3.5 font-mono text-xs font-semibold text-[#22343A]">
                                                {request.request}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#22343A]">
                                                {request.requestedBy}
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#55656C]">
                                                {request.department}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#22343A]">
                                                {request.item}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-semibold text-[#22343A]">
                                                {request.quantity}
                                            </td>
                                            <td className="px-3.5 py-3.5 font-medium text-[#22343A]">
                                                {request.proposedBudget}
                                            </td>
                                            <td className="px-3.5 py-3.5">
                                                <span
                                                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${getUrgencyBadgeClass(
                                                        request.urgency,
                                                    )}`}
                                                >
                                                    {request.urgency}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-3.5">
                                                <span
                                                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${getStageBadgeClass(
                                                        request.stage,
                                                    )}`}
                                                >
                                                    {request.stage}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-3.5 text-[#6D7C84]">
                                                {request.requestDate}
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
                            Showing {firstVisibleNumber}-{lastVisibleNumber} of {sortedRequests.length.toLocaleString()} requests
                            {activeTab !== "All requests" ? ` in ${activeTab}` : ""}
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

                {/* Suggested replenishment section */}
                <section className="mt-5 rounded-xl bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-6 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Suggested replenishment</h2>
                    <p className="mt-4 text-xs font-medium leading-5 text-[#22343A] lg:text-sm">
                        High priority items flagged across departments: Nitrile gloves (240 units), Pneumatic Impact Gun (6 units), Brake Caliper Piston Press Tool (8 units).
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-5 flex cursor-pointer items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#06766D] lg:mt-6 lg:px-5 lg:py-4 lg:text-sm"
                    >
                        <Plus className="size-4" aria-hidden="true" />
                        Create request
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
                    aria-labelledby="supply-filter-modal-title"
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4">
                            <div>
                                <h3 id="supply-filter-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Filter Supply Requests
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Narrow down workflow requests by department, urgency, and stage.
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
                                <label className="block text-xs font-semibold text-[#22343A]">Department</label>
                                <select
                                    value={filters.department}
                                    onChange={(e) => handleFilterChange("department", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Departments ({filterOptions.department.length})</option>
                                    {filterOptions.department.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Urgency</label>
                                <select
                                    value={filters.urgency}
                                    onChange={(e) => handleFilterChange("urgency", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Urgencies ({filterOptions.urgency.length})</option>
                                    {filterOptions.urgency.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#22343A]">Stage</label>
                                <select
                                    value={filters.stage}
                                    onChange={(e) => handleFilterChange("stage", e.target.value)}
                                    className="mt-1.5 w-full cursor-pointer rounded-lg bg-[#F5F7F8] px-3.5 py-2.5 text-xs font-medium text-[#22343A] outline-none transition focus:bg-white focus:shadow-md"
                                >
                                    <option value="">All Stages ({filterOptions.stage.length})</option>
                                    {filterOptions.stage.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
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

            {/* Create Request Modal */}
            {isCreateModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                    onClick={() => setIsCreateModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="create-request-modal-title"
                >
                    <div
                        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#F0F4F5] pb-4">
                            <div>
                                <h3 id="create-request-modal-title" className="text-lg font-bold text-[#22343A]">
                                    Create Supply Request
                                </h3>
                                <p className="mt-1 text-xs text-[#7B8A91]">
                                    Enter details to push a new request into the supply request queue.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="cursor-pointer rounded-md p-1.5 text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateRequest} className="mt-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Requested by <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="requestedBy"
                                        value={formData.requestedBy}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. Alex Chen"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Department <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Body Shop & Fabrication</option>
                                        <option>Engine Repair</option>
                                        <option>Brake & Suspension</option>
                                        <option>General Maintenance</option>
                                        <option>Electrical & Diagnostics</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[#22343A]">
                                    Item <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="item"
                                    value={formData.item}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Nitrile gloves Heavy Duty 100pk"
                                    className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g. 240"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">
                                        Proposed Budget (₱)
                                    </label>
                                    <input
                                        type="text"
                                        name="proposedBudget"
                                        value={formData.proposedBudget}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 25000"
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Urgency</label>
                                    <select
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#22343A]">Stage</label>
                                    <select
                                        name="stage"
                                        value={formData.stage}
                                        onChange={handleInputChange}
                                        className="mt-1.5 w-full rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-3.5 py-2.5 text-xs text-[#22343A] outline-none transition focus:border-[#07887D] focus:bg-white"
                                    >
                                        <option>Pending review</option>
                                        <option>Approved</option>
                                        <option>In procurement</option>
                                        <option>Fulfilled</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="cursor-pointer rounded-[7px] border border-[#DDE5E8] px-4 py-2.5 text-xs font-semibold text-[#7B8A91] transition hover:bg-[#F3F5F6] hover:text-[#22343A]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2 rounded-[7px] bg-[#07887D] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#06766D]"
                                >
                                    <Plus className="size-4" />
                                    Create Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplyRequest;
