import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Papa from "papaparse";
import Navbar from "../components/navbar";

type Metric = {
    label: string;
    value: string;
    note: string;
};

type AuditEvent = {
    date: string;
    timestamp: string;
    user: string;
    event: string;
    skuOrder: string;
    change: string;
    previousNew: string;
    ipLocation: string;
};

const metrics: Metric[] = [
    { label: "Events today", value: "128", note: "Across your workspace" },
    { label: "Stock movements", value: "42", note: "Across your workspace" },
    { label: "Active staff", value: "12", note: "Across your workspace" },
];

const auditEvents: AuditEvent[] = [
    {
        date: "2026-10-09",
        timestamp: "Oct 9 - 9:14 AM",
        user: "Jamie Davis",
        event: "User sign-in",
        skuOrder: "Workspace",
        change: "-",
        previousNew: "-",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        date: "2026-10-09",
        timestamp: "Oct 9 - 9:31 AM",
        user: "Alex Chen",
        event: "Stock received",
        skuOrder: "PK-310",
        change: "+120",
        previousNew: "480 / 600",
        ipLocation: "192.0.2.24 - Cebu",
    },
    {
        date: "2026-10-09",
        timestamp: "Oct 9 - 11:05 AM",
        user: "Morgan Lee",
        event: "Order shipped",
        skuOrder: "DL-2048",
        change: "-18",
        previousNew: "288 / 270",
        ipLocation: "192.0.2.31 - Singapore",
    },
    {
        date: "2026-10-08",
        timestamp: "Oct 8 - 10:03 AM",
        user: "Alex Chen",
        event: "User sign-in",
        skuOrder: "Workspace",
        change: "-",
        previousNew: "-",
        ipLocation: "192.0.2.24 - Cebu",
    },
    {
        date: "2026-10-08",
        timestamp: "Oct 8 - 2:12 PM",
        user: "Jamie Davis",
        event: "Order shipped",
        skuOrder: "BX-104",
        change: "-60",
        previousNew: "1,240 / 1,180",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        date: "2026-10-08",
        timestamp: "Oct 8 - 4:45 PM",
        user: "Taylor Kim",
        event: "Stock adjustment",
        skuOrder: "GL-208",
        change: "+4",
        previousNew: "48 / 52",
        ipLocation: "192.0.2.40 - Davao",
    },
    {
        date: "2026-10-07",
        timestamp: "Oct 7 - 11:47 AM",
        user: "Taylor Kim",
        event: "Stock adjustment",
        skuOrder: "SR-55",
        change: "-12",
        previousNew: "96 / 84",
        ipLocation: "192.0.2.40 - Davao",
    },
    {
        date: "2026-10-07",
        timestamp: "Oct 7 - 3:28 PM",
        user: "Morgan Lee",
        event: "Stock received",
        skuOrder: "BX-104",
        change: "+400",
        previousNew: "840 / 1,240",
        ipLocation: "192.0.2.31 - Singapore",
    },
    {
        date: "2026-10-06",
        timestamp: "Oct 6 - 10:42 AM",
        user: "Jamie Davis",
        event: "Stock received",
        skuOrder: "BX-104",
        change: "+240",
        previousNew: "1,000 / 1,240",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        date: "2026-10-06",
        timestamp: "Oct 6 - 10:26 AM",
        user: "Alex Chen",
        event: "Order shipped",
        skuOrder: "DL-2048",
        change: "-32",
        previousNew: "320 / 288",
        ipLocation: "192.0.2.24 - Cebu",
    },
    {
        date: "2026-10-06",
        timestamp: "Oct 6 - 10:08 AM",
        user: "Morgan Lee",
        event: "Stock adjustment",
        skuOrder: "GL-208",
        change: "-6",
        previousNew: "54 / 48",
        ipLocation: "192.0.2.31 - Singapore",
    },
    {
        date: "2026-10-06",
        timestamp: "Oct 6 - 9:56 AM",
        user: "Jamie Davis",
        event: "User sign-in",
        skuOrder: "Workspace",
        change: "-",
        previousNew: "-",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        date: "2026-10-05",
        timestamp: "Oct 5 - 1:19 PM",
        user: "Alex Chen",
        event: "Stock received",
        skuOrder: "GL-208",
        change: "+30",
        previousNew: "24 / 54",
        ipLocation: "192.0.2.24 - Cebu",
    },
    {
        date: "2026-10-05",
        timestamp: "Oct 5 - 5:02 PM",
        user: "Jamie Davis",
        event: "Order shipped",
        skuOrder: "PK-310",
        change: "-45",
        previousNew: "525 / 480",
        ipLocation: "192.0.2.18 - Manila",
    },
    {
        date: "2026-10-02",
        timestamp: "Oct 2 - 9:52 AM",
        user: "Taylor Kim",
        event: "Stock received",
        skuOrder: "DL-2048",
        change: "+150",
        previousNew: "170 / 320",
        ipLocation: "192.0.2.40 - Davao",
    },
    {
        date: "2026-10-02",
        timestamp: "Oct 2 - 4:40 PM",
        user: "Morgan Lee",
        event: "User sign-in",
        skuOrder: "Workspace",
        change: "-",
        previousNew: "-",
        ipLocation: "192.0.2.31 - Singapore",
    },
];

const MetricCard = ({ label, value, note }: Metric) => (
    <li className="min-w-0 overflow-hidden rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6">
        <p className="text-xs font-medium text-[#7B8A91] lg:text-sm">{label}</p>
        <p className="mt-4 break-words text-2xl font-semibold leading-tight text-[#22343A] lg:mt-5 lg:text-4xl">{value}</p>
        <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">{note}</p>
    </li>
);

const PrimaryButton = ({
    children,
    onClick,
    disabled = false,
}: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-3 rounded-[7px] bg-[#07887D] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#06766D] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#07887D] lg:px-5 lg:py-4 lg:text-sm"
    >
        <Plus className="size-4 shrink-0" aria-hidden="true" />
        {children}
    </button>
);

const monthLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const padDatePart = (value: number) => String(value).padStart(2, "0");

const toISODate = (date: Date) =>
    `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;

const formatDayLabel = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

type CalendarCardProps = {
    eventDates: Set<string>;
    selectedDate: string | null;
    onSelectDate: (isoDate: string) => void;
};

const CalendarCard = ({ eventDates, selectedDate, onSelectDate }: CalendarCardProps) => {
    const todayISO = toISODate(new Date());
    const [view, setView] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const firstWeekday = new Date(view.year, view.month, 1).getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();

    const handlePrevMonth = () =>
        setView((prev) =>
            prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 },
        );

    const handleNextMonth = () =>
        setView((prev) =>
            prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 },
        );

    const handleToday = () => {
        const now = new Date();
        setView({ year: now.getFullYear(), month: now.getMonth() });
        onSelectDate(toISODate(now));
    };

    return (
        <section className="min-w-0 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:px-5 lg:py-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold leading-none lg:text-lg">Calendar</h2>
                <button
                    type="button"
                    onClick={handleToday}
                    className="cursor-pointer text-xs font-semibold text-[#07887D] transition-colors hover:text-[#06766D] lg:text-sm"
                >
                    Today
                </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 lg:mt-5">
                <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                    className="flex cursor-pointer items-center justify-center rounded-md border border-[#E1E8EA] bg-[#F5F7F8] p-2 text-[#22343A] transition-colors hover:border-[#07887D] hover:text-[#07887D]"
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <p className="text-sm font-semibold lg:text-base">
                    {monthLabels[view.month]} {view.year}
                </p>
                <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                    className="flex cursor-pointer items-center justify-center rounded-md border border-[#E1E8EA] bg-[#F5F7F8] p-2 text-[#22343A] transition-colors hover:border-[#07887D] hover:text-[#07887D]"
                >
                    <ChevronRight className="size-4" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 lg:mt-4">
                {weekdayLabels.map((weekday) => (
                    <span key={weekday} className="pb-1 text-center text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                        {weekday}
                    </span>
                ))}
                {Array.from({ length: firstWeekday }, (_, index) => (
                    <span key={`blank-${index}`} aria-hidden="true" />
                ))}
                {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const isoDate = `${view.year}-${padDatePart(view.month + 1)}-${padDatePart(day)}`;
                    const isSelected = selectedDate === isoDate;
                    const isToday = isoDate === todayISO;
                    const hasEvents = eventDates.has(isoDate);

                    return (
                        <button
                            key={isoDate}
                            type="button"
                            onClick={() => onSelectDate(isoDate)}
                            aria-pressed={isSelected}
                            aria-label={`Select ${monthLabels[view.month]} ${day}, ${view.year}`}
                            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border py-2.5 text-xs font-medium transition-colors lg:text-sm ${
                                isSelected
                                    ? "border-[#07887D] bg-[#07887D] text-white"
                                    : isToday
                                      ? "border-[#B7DED9] bg-[#E8F5F4] text-[#07887D]"
                                      : "border-transparent text-[#22343A] hover:border-[#E1E8EA] hover:bg-[#F3F5F6]"
                            }`}
                        >
                            {day}
                            <span
                                className={`size-1 rounded-full ${
                                    hasEvents ? (isSelected ? "bg-white" : "bg-[#07887D]") : "bg-transparent"
                                }`}
                                aria-hidden="true"
                            />
                        </button>
                    );
                })}
            </div>
        </section>
    );
};

const statusOptions = ["All statuses", "Stock received", "Order shipped", "Stock adjustment", "User sign-in"];

const History = () => {
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Ref for the status dropdown (used to close it on outside click)
    const statusRef = useRef<HTMLDivElement>(null);

    // Close status dropdown on outside click or Escape (only while it's open)
    useEffect(() => {
        if (!isStatusOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
                setIsStatusOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsStatusOpen(false);
        };

        window.addEventListener("mousedown", handleOutsideClick);
        window.addEventListener("keydown", handleEscape);
        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isStatusOpen]);

    // Days that have at least one audit event (used to mark the calendar)
    const eventDates = new Set(auditEvents.map((auditEvent) => auditEvent.date));

    // Toggle the selected calendar day (clicking the same day again clears it)
    const handleSelectDate = (isoDate: string) => {
        setSelectedDate((prev) => (prev === isoDate ? null : isoDate));
    };

    // Filter audit events by selected calendar day and status (event type)
    const filteredEvents = auditEvents.filter((auditEvent) => {
        const matchesDay = !selectedDate || auditEvent.date === selectedDate;
        const matchesStatus = statusFilter === "All statuses" || auditEvent.event === statusFilter;
        return matchesDay && matchesStatus;
    });

    // CSV export unlocks only after the user sorts the list by picking a day in the calendar
    const canExportCsv = Boolean(selectedDate) && filteredEvents.length > 0;

    // Download every row currently shown in the activity log as a CSV file
    const handleExportCsv = () => {
        if (!selectedDate || filteredEvents.length === 0) return;

        const rows = filteredEvents.map((auditEvent) => ({
            Timestamp: auditEvent.timestamp,
            User: auditEvent.user,
            Event: auditEvent.event,
            "SKU / Order": auditEvent.skuOrder,
            Change: auditEvent.change,
            "Previous / New": auditEvent.previousNew,
            "IP / Location": auditEvent.ipLocation,
        }));

        const csv = Papa.unparse(rows, { header: true });

        // BOM keeps Excel from mangling non-ASCII characters
        const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `audit-log-${selectedDate}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filterNote = [
        selectedDate ? `for ${formatDayLabel(selectedDate)}` : "",
        statusFilter !== "All statuses" ? "(filtered)" : "",
        !selectedDate && statusFilter === "All statuses" ? "- Scroll to see all columns" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="min-h-screen bg-[#F4F7F8] lg:flex">
            <Navbar />

            <main className="min-w-0 flex-1 px-3 py-5 text-[#22343A] lg:mx-auto lg:max-w-[1030px] lg:px-8 lg:py-10">
                <header className="flex flex-col items-start gap-4 lg:flex-row lg:justify-between lg:gap-6">
                    <div>
                        <h1 className="text-3xl font-semibold leading-none lg:text-4xl">History & audit log</h1>
                        <p className="mt-3 text-xs font-medium text-[#7B8A91] lg:mt-5 lg:text-base">
                            A transparent record of stock movements and staff activity.
                        </p>
                    </div>
                    <PrimaryButton>Export audit log</PrimaryButton>
                </header>

                <ul className="mt-5 grid grid-cols-2 gap-3 lg:mt-9 lg:grid-cols-3 lg:gap-5">
                    {metrics.map((metric) => (
                        <MetricCard key={metric.label} {...metric} />
                    ))}
                </ul>

                <div className="mt-5 grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:mt-7 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                    <CalendarCard eventDates={eventDates} selectedDate={selectedDate} onSelectDate={handleSelectDate} />

                    <section className="min-w-0 rounded-lg border border-[#DDE5E8] bg-white px-3 py-5 shadow-sm lg:px-5 lg:py-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-base font-semibold leading-none lg:text-lg">Activity log</h2>
                                <p className="mt-2 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                    {selectedDate
                                        ? `History for ${formatDayLabel(selectedDate)}`
                                        : "Showing every recorded day - select a day in the calendar to view its history."}
                                </p>
                            </div>
                            {selectedDate && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedDate(null)}
                                    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#E1E8EA] bg-[#F5F7F8] px-3 py-1.5 text-[10px] font-semibold text-[#22343A] transition-colors hover:border-[#07887D] hover:text-[#07887D] lg:text-xs"
                                >
                                    Clear day
                                    <X className="size-3" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 lg:mt-6 lg:flex-row">
                            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-[#9AA6AB]">
                                <Search className="size-4 shrink-0" aria-hidden="true" />
                                <input
                                    type="search"
                                    placeholder="Search history & audit log..."
                                    className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9AA6AB] lg:text-sm"
                                    aria-label="Search history and audit log"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    enterKeyHint="search"
                                />
                            </label>
                            <div className="relative w-full lg:w-[190px]" ref={statusRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsStatusOpen((prev) => !prev)}
                                    aria-haspopup="true"
                                    aria-expanded={isStatusOpen}
                                    aria-label="Filter by status"
                                    className="flex w-full cursor-pointer items-center justify-between rounded-md border border-[#E1E8EA] bg-[#F5F7F8] px-4 py-3 text-xs font-medium text-[#9AA6AB] outline-none transition focus:border-[#07887D] lg:text-sm"
                                >
                                    {statusFilter}
                                    <ChevronDown
                                        className={`size-4 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
                                        aria-hidden="true"
                                    />
                                </button>

                                {isStatusOpen && (
                                    <ul className="absolute right-0 top-full z-10 mt-1 w-full overflow-hidden rounded-md border border-[#E1E8EA] bg-white py-1 shadow-lg">
                                        {statusOptions.map((status) => (
                                            <li key={status}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setIsStatusOpen(false);
                                                    }}
                                                    aria-pressed={statusFilter === status}
                                                    className={`block w-full cursor-pointer px-4 py-2.5 text-left text-xs transition hover:bg-[#F3F5F6] lg:text-sm ${
                                                        statusFilter === status
                                                            ? "font-semibold text-[#07887D]"
                                                            : "text-[#22343A]"
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 overflow-x-auto lg:mt-5">
                            <table className="min-w-[860px] table-fixed text-left text-xs lg:min-w-[960px] lg:text-sm">
                                <thead className="bg-[#F3F5F6] text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                                    <tr>
                                        <th className="w-[20%] px-3 py-4 font-medium lg:px-4">Timestamp</th>
                                        <th className="w-[16%] px-3 py-4 font-medium lg:px-4">User</th>
                                        <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Event</th>
                                        <th className="w-[16%] px-3 py-4 font-medium lg:px-4">SKU / Order</th>
                                        <th className="w-[14%] px-3 py-4 font-medium lg:px-4">Change</th>
                                        <th className="w-[16%] px-3 py-4 font-medium lg:px-4">Previous / New</th>
                                        <th className="w-[18%] px-3 py-4 font-medium lg:px-4">IP / Location</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#22343A]">
                                    {filteredEvents.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-3 py-8 text-center text-xs text-[#7B8A91] lg:text-sm">
                                                {selectedDate
                                                    ? `No audit events found for ${formatDayLabel(selectedDate)}.`
                                                    : "No audit events found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredEvents.map((auditEvent) => (
                                            <tr key={`${auditEvent.timestamp}-${auditEvent.event}`}>
                                                <td className="px-3 py-4 font-semibold lg:px-4 lg:py-5 ">{auditEvent.timestamp}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.user}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.event}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.skuOrder}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.change}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.previousNew}</td>
                                                <td className="px-3 py-4 lg:px-4 lg:py-1">{auditEvent.ipLocation}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <p className="mt-4 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                            Showing {filteredEvents.length} records {filterNote}
                        </p>
                    </section>
                </div>

                <section className="mt-5 rounded-lg border border-[#DDE5E8] bg-white px-4 py-5 shadow-sm lg:mt-7 lg:px-5 lg:py-6">
                    <h2 className="text-base font-semibold leading-none lg:text-lg">Compliance-ready exports</h2>
                    <p className="mt-5 text-xs font-medium leading-5 text-[#22343A] lg:mt-7 lg:text-sm">
                        Filter by date, event, and staff member. Export CSV for accounting or PDF for audit review.
                    </p>
                    <div className="mt-5 lg:mt-6">
                        <PrimaryButton onClick={handleExportCsv} disabled={!canExportCsv}>
                            Export CSV
                        </PrimaryButton>
                        <p className="mt-3 text-[10px] font-medium text-[#7B8A91] lg:text-xs">
                            {!selectedDate
                                ? "Select a date in the calendar first - CSV export unlocks once a day is chosen."
                                : filteredEvents.length === 0
                                  ? "No records match the current filters, so there is nothing to export."
                                  : `Downloads all ${filteredEvents.length} record${filteredEvents.length === 1 ? "" : "s"} shown for ${formatDayLabel(selectedDate)}.`}
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default History;
