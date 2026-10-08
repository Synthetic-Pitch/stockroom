import {
    Bell,
    Search,
    Settings,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import OverviewPhase1 from "../components/ph1-overview";
import MetricCardsPhase1 from "../components/ph1-metric-cards";
import DataStatusPhase1 from "../components/ph1-data-status";
import InventoryPhase1 from "../components/ph1-ivnentory";
import UpcomingRecently from "../components/ph1-upcoming-history";
import Navbar from "../components/navbar";

type SearchResult = {
    title: string;
    section: string;
    description: string;
    path: string;
    terms: string[];
};

type NotificationItem = {
    title: string;
    description: string;
    time: string;
    path: string;
    category: "stock" | "delivery" | "system";
    unread: boolean;
};

type DashboardSettings = {
    lowStockAlerts: boolean;
    deliveryUpdates: boolean;
    compactOverview: boolean;
};

type ActivePanel = "notifications" | "settings" | null;

const searchResults: SearchResult[] = [
    {
        title: "All inventory",
        section: "Inventory",
        description: "Browse SKUs, stock counts, locations, pricing, and reorder levels.",
        path: "/inventory",
        terms: ["inventory", "sku", "stock", "items", "packing boxes", "gloves", "brackets", "labels", "goggles"],
    },
    {
        title: "Low stock alerts",
        section: "Inventory",
        description: "Review items that need replenishment and request reorders.",
        path: "/inventory",
        terms: ["low stock", "out of stock", "reorder", "alerts", "nitrile gloves", "safety goggles"],
    },
    {
        title: "Warehouse locations",
        section: "Warehouse",
        description: "Check storage zones, bin locations, capacity, and warehouse activity.",
        path: "/warehouse",
        terms: ["warehouse", "locations", "storage", "bins", "capacity", "main", "east", "south"],
    },
    {
        title: "Deliveries",
        section: "Deliveries",
        description: "Coordinate incoming stock, outgoing shipments, ETAs, and carriers.",
        path: "/deliveries",
        terms: ["deliveries", "shipments", "eta", "carrier", "driver", "route", "dl-2048"],
    },
    {
        title: "Supply requests",
        section: "Supply Request",
        description: "Track replenishment requests, purchase needs, and supplier follow-ups.",
        path: "/supply-request",
        terms: ["supply", "request", "purchase", "supplier", "replenishment"],
    },
    {
        title: "Customers",
        section: "Customers",
        description: "Find customer records, orders, contacts, and account activity.",
        path: "/customers",
        terms: ["customers", "accounts", "contacts", "orders", "retail"],
    },
    {
        title: "Returns",
        section: "Returns",
        description: "Manage returned items, inspection status, and replacement workflows.",
        path: "/returns",
        terms: ["returns", "refund", "replacement", "inspection", "damaged"],
    },
    {
        title: "History & audit log",
        section: "History",
        description: "Search stock movements, staff actions, exports, and audit events.",
        path: "/history",
        terms: ["history", "audit", "events", "staff", "stock received", "order shipped", "sign-in"],
    },
];

const notifications: NotificationItem[] = [
    {
        title: "Nitrile gloves are below reorder level",
        description: "48 on hand against a reorder level of 100.",
        time: "5 min ago",
        path: "/inventory",
        category: "stock",
        unread: true,
    },
    {
        title: "Delivery DL-2048 is nearing its next stop",
        description: "Estimated arrival is still on track for 2:30 PM.",
        time: "18 min ago",
        path: "/deliveries",
        category: "delivery",
        unread: true,
    },
    {
        title: "Audit export is ready",
        description: "The latest stock movement report can be reviewed.",
        time: "1 hr ago",
        path: "/history",
        category: "system",
        unread: false,
    },
];

const getSearchText = (result: SearchResult) =>
    [result.title, result.section, result.description, ...result.terms].join(" ").toLowerCase();

type DashboardSearchProps = {
    query: string;
    results: SearchResult[];
    wrapperClassName: string;
    labelClassName: string;
    inputClassName: string;
    iconClassName: string;
    onQueryChange: (query: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const DashboardSearch = ({
    query,
    results,
    wrapperClassName,
    labelClassName,
    inputClassName,
    iconClassName,
    onQueryChange,
    onSubmit,
}: DashboardSearchProps) => {
    const shouldShowResults = query.trim().length > 0;

    return (
        <form className={wrapperClassName} onSubmit={onSubmit}>
            <label className={labelClassName}>
                <Search className={iconClassName} aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search anything..."
                    className={inputClassName}
                    aria-label="Search anything"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="search"
                />
            </label>

            {shouldShowResults && (
                <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-[#DDE5E8] bg-white shadow-lg">
                    {results.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto py-2">
                            {results.map((result) => (
                                <li key={result.section + "-" + result.title}>
                                    <Link
                                        to={result.path}
                                        className="block px-4 py-3 transition hover:bg-[#F3F5F6] focus:bg-[#F3F5F6] focus:outline-none"
                                    >
                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#07887D]">
                                            {result.section}
                                        </span>
                                        <span className="mt-1 block text-sm font-semibold text-[#22343A]">{result.title}</span>
                                        <span className="mt-1 block text-xs leading-5 text-[#7B8A91]">{result.description}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="px-4 py-4 text-sm font-medium text-[#7B8A91]">No matches found.</p>
                    )}
                </div>
            )}
        </form>
    );
};

type DashboardActionsProps = {
    activePanel: ActivePanel;
    settings: DashboardSettings;
    notificationItems: NotificationItem[];
    unreadCount: number;
    buttonClassName: string;
    iconClassName: string;
    panelClassName: string;
    onTogglePanel: (panel: Exclude<ActivePanel, null>) => void;
    onMarkAllRead: () => void;
    onToggleSetting: (setting: keyof DashboardSettings) => void;
};

const DashboardActions = ({
    activePanel,
    settings,
    notificationItems,
    unreadCount,
    buttonClassName,
    iconClassName,
    panelClassName,
    onTogglePanel,
    onMarkAllRead,
    onToggleSetting,
}: DashboardActionsProps) => {
    const settingRows: Array<{ key: keyof DashboardSettings; label: string; description: string }> = [
        {
            key: "lowStockAlerts",
            label: "Low stock alerts",
            description: "Show replenishment warnings in notifications.",
        },
        {
            key: "deliveryUpdates",
            label: "Delivery updates",
            description: "Show route and ETA notices as they arrive.",
        },
        {
            key: "compactOverview",
            label: "Compact overview",
            description: "Reduce dashboard spacing for faster scanning.",
        },
    ];

    return (
        <div className="relative flex shrink-0 items-center gap-5 lg:gap-6">
            <button
                type="button"
                className={buttonClassName}
                aria-label="Notifications"
                aria-expanded={activePanel === "notifications"}
                onClick={() => onTogglePanel("notifications")}
            >
                <Bell className={iconClassName} aria-hidden="true" />
                {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-[#E3564A] text-[10px] font-semibold leading-none text-white">
                        {unreadCount}
                    </span>
                )}
            </button>
            <button
                type="button"
                className={buttonClassName}
                aria-label="Settings"
                aria-expanded={activePanel === "settings"}
                onClick={() => onTogglePanel("settings")}
            >
                <Settings className={iconClassName} aria-hidden="true" />
            </button>

            {activePanel === "notifications" && (
                <section className={panelClassName} aria-label="Notifications panel">
                    <div className="flex items-center justify-between border-b border-[#E8EEF0] px-4 py-3">
                        <div>
                            <h2 className="text-sm font-semibold text-[#22343A]">Notifications</h2>
                            <p className="mt-1 text-xs text-[#7B8A91]">{unreadCount} unread updates</p>
                        </div>
                        <button
                            type="button"
                            onClick={onMarkAllRead}
                            className="text-xs font-semibold text-[#07887D] hover:text-[#066F66]"
                        >
                            Mark all read
                        </button>
                    </div>
                    <ul className="max-h-80 overflow-y-auto py-2">
                        {notificationItems.length > 0 ? (
                            notificationItems.map((notification) => (
                            <li key={notification.title}>
                                <Link
                                    to={notification.path}
                                    className="block px-4 py-3 transition hover:bg-[#F3F5F6] focus:bg-[#F3F5F6] focus:outline-none"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={
                                                "mt-1.5 size-2 shrink-0 rounded-full " +
                                                (notification.unread && unreadCount > 0 ? "bg-[#07887D]" : "bg-[#DDE5E8]")
                                            }
                                            aria-hidden="true"
                                        />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-semibold text-[#22343A]">{notification.title}</span>
                                            <span className="mt-1 block text-xs leading-5 text-[#7B8A91]">{notification.description}</span>
                                            <span className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-[#9AA6AB]">
                                                {notification.time}
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            ))
                        ) : (
                            <li className="px-4 py-5 text-sm font-medium text-[#7B8A91]">
                                No notifications for the current settings.
                            </li>
                        )}
                    </ul>
                </section>
            )}

            {activePanel === "settings" && (
                <section className={panelClassName} aria-label="Settings panel">
                    <div className="border-b border-[#E8EEF0] px-4 py-3">
                        <h2 className="text-sm font-semibold text-[#22343A]">Dashboard settings</h2>
                        <p className="mt-1 text-xs text-[#7B8A91]">Tune alerts and layout for this overview.</p>
                    </div>
                    <ul className="py-2">
                        {settingRows.map((setting) => (
                            <li key={setting.key} className="px-4 py-3">
                                <label className="flex cursor-pointer items-center justify-between gap-4">
                                    <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-[#22343A]">{setting.label}</span>
                                        <span className="mt-1 block text-xs leading-5 text-[#7B8A91]">{setting.description}</span>
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={settings[setting.key]}
                                        onChange={() => onToggleSetting(setting.key)}
                                        className="sr-only"
                                    />
                                    <span
                                        className={
                                            "flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition " +
                                            (settings[setting.key] ? "bg-[#07887D]" : "bg-[#D6E0E3]")
                                        }
                                    >
                                        <span
                                            className={
                                                "size-4 rounded-full bg-white shadow-sm transition " +
                                                (settings[setting.key] ? "translate-x-5" : "translate-x-0")
                                            }
                                        />
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);
    const [hasMarkedNotificationsRead, setHasMarkedNotificationsRead] = useState(false);
    const [settings, setSettings] = useState<DashboardSettings>({
        lowStockAlerts: true,
        deliveryUpdates: true,
        compactOverview: false,
    });

    const filteredSearchResults = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return [];

        return searchResults.filter((result) => getSearchText(result).includes(query));
    }, [searchQuery]);

    const visibleNotifications = useMemo(
        () =>
            notifications.filter((notification) => {
                if (notification.category === "stock") return settings.lowStockAlerts;
                if (notification.category === "delivery") return settings.deliveryUpdates;
                return true;
            }),
        [settings.deliveryUpdates, settings.lowStockAlerts],
    );

    const unreadCount = hasMarkedNotificationsRead
        ? 0
        : visibleNotifications.filter((notification) => notification.unread).length;

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const firstResult = filteredSearchResults[0];
        if (firstResult) {
            navigate(firstResult.path);
        }
    };

    const handleTogglePanel = (panel: Exclude<ActivePanel, null>) => {
        setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
    };

    const handleToggleSetting = (setting: keyof DashboardSettings) => {
        setSettings((currentSettings) => ({
            ...currentSettings,
            [setting]: !currentSettings[setting],
        }));
    };

    return (
        <div>
            {/* Mobile */}
            <section className="lg:hidden ">
                <Navbar />
                <main className="bg-[#F5F7F8]">
                    <section className="flex items-center gap-5 border-b border-[#DDE5E8] bg-white px-7 py-5">
                        <DashboardSearch
                            query={searchQuery}
                            results={filteredSearchResults}
                            wrapperClassName="relative min-w-0 flex-1"
                            labelClassName="flex min-w-0 flex-1 items-center gap-4 rounded-[9px] bg-[#F3F5F6] px-5 py-4 text-[#7B8A91]"
                            inputClassName="min-w-0 flex-1 bg-transparent text-[16px] font-medium outline-none placeholder:text-[#7B8A91]"
                            iconClassName="size-5 shrink-0"
                            onQueryChange={setSearchQuery}
                            onSubmit={handleSearchSubmit}
                        />
                        <DashboardActions
                            activePanel={activePanel}
                            settings={settings}
                            notificationItems={visibleNotifications}
                            unreadCount={unreadCount}
                            buttonClassName="relative shrink-0 text-[#7B8A91] transition hover:text-[#22343A]"
                            iconClassName="size-5"
                            panelClassName="absolute right-0 top-full z-40 mt-4 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-[#DDE5E8] bg-white text-left shadow-lg"
                            onTogglePanel={handleTogglePanel}
                            onMarkAllRead={() => setHasMarkedNotificationsRead(true)}
                            onToggleSetting={handleToggleSetting}
                        />
                    </section>
                    <div className={settings.compactOverview ? "px-4 py-2" : "px-4"}>
                        <OverviewPhase1 />
                        <MetricCardsPhase1 />
                        <DataStatusPhase1 />
                        <InventoryPhase1 />
                        <UpcomingRecently />
                    </div>
                </main>
            </section>
            {/* Desktop */}
            <section className="hidden min-h-screen bg-[#F4F7F8] font-sans text-[#22343A] lg:flex">
                <Navbar />
                <div className="min-w-0 flex-1">
                    <header className="flex h-18 items-center justify-between border-b border-[#DDE5E8] bg-white px-8">
                        <p className="text-xs font-medium text-[#7B8A91]">Workspace / Overview</p>
                        <div className="flex items-center gap-6">
                            <DashboardSearch
                                query={searchQuery}
                                results={filteredSearchResults}
                                wrapperClassName="relative w-72.5"
                                labelClassName="flex w-full items-center gap-3 rounded border border-[#E1E8EA] bg-[#FAFBFB] px-3 py-2 text-[#7B8A91]"
                                inputClassName="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#7B8A91]"
                                iconClassName="size-4 shrink-0"
                                onQueryChange={setSearchQuery}
                                onSubmit={handleSearchSubmit}
                            />
                            <DashboardActions
                                activePanel={activePanel}
                                settings={settings}
                                notificationItems={visibleNotifications}
                                unreadCount={unreadCount}
                                buttonClassName="relative text-[#7B8A91] transition hover:text-[#22343A]"
                                iconClassName="size-4"
                                panelClassName="absolute right-0 top-full z-40 mt-4 w-90 overflow-hidden rounded-lg border border-[#DDE5E8] bg-white text-left shadow-lg"
                                onTogglePanel={handleTogglePanel}
                                onMarkAllRead={() => setHasMarkedNotificationsRead(true)}
                                onToggleSetting={handleToggleSetting}
                            />
                        </div>
                    </header>

                    <main className={"mx-auto max-w-257.5 px-8 " + (settings.compactOverview ? "py-5" : "py-8")}>
                        <OverviewPhase1 />
                        <MetricCardsPhase1 />
                        <DataStatusPhase1 />
                        <InventoryPhase1 />
                        <UpcomingRecently />
                    </main>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
