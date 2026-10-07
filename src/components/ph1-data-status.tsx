import { ChevronDown } from "lucide-react";

const DataStatusPhase1 = () => {
    const stockMovement = [
        {day: "Mon", received: 46, shipped: 32},
        {day: "Tue", received: 64, shipped: 44},
        {day: "Wed", received: 21, shipped: 38},
        {day: "Thu", received: 80, shipped: 56},
        {day: "Fri", received: 69, shipped: 48},
        {day: "Sat", received: 49, shipped: 93},
        {day: "Sun", received: 95, shipped: 70},
    ];
    const stockHealth = [
        {label: "In stock", value: 218, color: "#07887D", width: "72%"},
        {label: "Low stock", value: 12, color: "#7C8B8F", width: "18%"},
        {label: "Out of stock", value: 8, color: "#E2E9EC", width: "9%"},
        {label: "Reserved / inspection", value: 10, color: "transparent", width: "0%"},
    ];
    
    return (
        <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(250px,0.85fr)] lg:gap-5 lg:space-y-0">
            <section className="w-full rounded-2xl border border-[#E4EAEC] bg-white px-5 py-5 shadow-sm lg:rounded-[8px]">
                <header className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="text-2xl font-semibold leading-none text-[#22343A] lg:text-base">Stock movement</h2>
                        <button
                            type="button"
                            className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#7D8B91] lg:text-xs"
                            aria-label="Change stock movement date range"
                        >
                            Last 7 days
                            <ChevronDown className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex items-center gap-7">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-[3px] bg-[#07887D]" aria-hidden="true" />
                            <span className="text-base font-medium text-[#8A989E] lg:text-xs">Received</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-[3px] bg-[#BDDAD3]" aria-hidden="true" />
                            <span className="text-base font-medium text-[#8A989E] lg:text-xs">Shipped</span>
                        </div>
                    </div>
                </header>
                <main className="mt-8">
                    <div className="grid h-48 grid-cols-7 items-end gap-4 lg:h-[170px] lg:gap-5">
                        {stockMovement.map(({day, received, shipped}) => (
                            <div key={day} className="flex h-full min-w-0 flex-col justify-end">
                                <div className="flex h-full items-end justify-center gap-2">
                                    <span
                                        className="w-4 rounded-t-[5px] bg-[#07887D] sm:w-5"
                                        style={{height: `${received}%`}}
                                        aria-label={`${day} received ${received}`}
                                    />
                                    <span
                                        className="w-4 rounded-t-[5px] bg-[#BDDAD3] sm:w-5"
                                        style={{height: `${shipped}%`}}
                                        aria-label={`${day} shipped ${shipped}`}
                                    />
                                </div>
                                <p className="mt-3 text-center text-base font-medium text-[#8A989E] lg:text-xs">{day}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </section>
            <section className="w-full rounded-2xl border border-[#E4EAEC] bg-white px-5 py-5 shadow-sm lg:rounded-[8px]">
                <header>
                    <h2 className="text-2xl font-semibold leading-none text-[#22343A] lg:text-base">Stock health</h2>
                </header>
                <main className="mt-8">
                    <p className="text-5xl font-semibold leading-none text-[#22343A] lg:text-3xl">248</p>
                    <p className="mt-7 text-base font-medium text-[#8A989E] lg:mt-5 lg:text-xs">Unique items in your inventory</p>

                    <div
                        className="mt-6 flex h-4 overflow-hidden rounded-[4px]"
                        aria-label="Stock health status distribution"
                    >
                        {stockHealth
                            .filter(({width}) => width !== "0%")
                            .map(({label, color, width}) => (
                                <span
                                    key={label}
                                    className="border-r-[3px] border-white last:border-r-0"
                                    style={{backgroundColor: color, width}}
                                    aria-label={label}
                                />
                            ))}
                    </div>

                    <dl className="mt-7 space-y-6 lg:space-y-4">
                        {stockHealth.map(({label, value}) => (
                            <div key={label} className="flex items-center justify-between gap-4">
                                <dt className="text-base font-medium text-[#8A989E] lg:text-xs">{label}</dt>
                                <dd className="text-lg font-semibold text-[#22343A] lg:text-xs">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </main>
            </section>
        </div>
    );
};

export default DataStatusPhase1;
