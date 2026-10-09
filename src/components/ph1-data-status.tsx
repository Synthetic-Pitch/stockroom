import { useState } from "react";
import { ChevronDown } from "lucide-react";

type MovementTooltip = {
    day: string;
    type: "Received" | "Shipped";
    value: number;
    change: number;
    x: number;
    y: number;
};

const formatChange = (change: number) => (change > 0 ? "+" : "") + change + "%";

const DataStatusPhase1 = () => {
    const [movementTooltip, setMovementTooltip] = useState<MovementTooltip | null>(null);

    const stockMovement = [
        { day: "Mon", received: 46, receivedChange: 2, shipped: 32, shippedChange: -4 },
        { day: "Tue", received: 64, receivedChange: 8, shipped: 44, shippedChange: 3 },
        { day: "Wed", received: 21, receivedChange: -12, shipped: 38, shippedChange: 6 },
        { day: "Thu", received: 80, receivedChange: 14, shipped: 56, shippedChange: -2 },
        { day: "Fri", received: 69, receivedChange: -5, shipped: 48, shippedChange: 4 },
        { day: "Sat", received: 49, receivedChange: 7, shipped: 93, shippedChange: 18 },
        { day: "Sun", received: 95, receivedChange: 22, shipped: 70, shippedChange: -8 },
    ];
    const stockHealth = [
        {label: "In stock", value: 218, color: "#07887D", width: "72%"},
        {label: "Low stock", value: 12, color: "#7C8B8F", width: "18%"},
        {label: "Out of stock", value: 8, color: "#E2E9EC", width: "9%"},
        {label: "Reserved / inspection", value: 10, color: "transparent", width: "0%"},
    ];

    const showMovementTooltip = (
        event: React.MouseEvent<HTMLSpanElement>,
        tooltip: Omit<MovementTooltip, "x" | "y">,
    ) => {
        setMovementTooltip({
            ...tooltip,
            x: event.clientX,
            y: event.clientY,
        });
    };

    const moveMovementTooltip = (event: React.MouseEvent<HTMLSpanElement>) => {
        setMovementTooltip((currentTooltip) =>
            currentTooltip ? { ...currentTooltip, x: event.clientX, y: event.clientY } : currentTooltip,
        );
    };

    return (
        <div className="space-y-4 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(250px,0.85fr)] lg:gap-5 lg:space-y-0">
            <section className="w-full rounded-2xl border border-[#E4EAEC] bg-white px-5 py-5 shadow-sm lg:rounded-lg">
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
                        {stockMovement.map(({day, received, receivedChange, shipped, shippedChange}) => (
                            <div key={day} className="flex h-full min-w-0 flex-col justify-end">
                                <div className="flex h-full items-end justify-center gap-2">
                                    <span
                                        className="w-4 cursor-pointer rounded-t-[5px] bg-[#07887D] transition-opacity hover:opacity-80 sm:w-5"
                                        style={{height: received + "%"}}
                                        aria-label={day + " received " + received + " records, " + formatChange(receivedChange)}
                                        onMouseEnter={(event) =>
                                            showMovementTooltip(event, {
                                                day,
                                                type: "Received",
                                                value: received,
                                                change: receivedChange,
                                            })
                                        }
                                        onMouseMove={moveMovementTooltip}
                                        onMouseLeave={() => setMovementTooltip(null)}
                                    />
                                    <span
                                        className="w-4 cursor-pointer rounded-t-[5px] bg-[#BDDAD3] transition-opacity hover:opacity-80 sm:w-5"
                                        style={{height: shipped + "%"}}
                                        aria-label={day + " shipped " + shipped + " records, " + formatChange(shippedChange)}
                                        onMouseEnter={(event) =>
                                            showMovementTooltip(event, {
                                                day,
                                                type: "Shipped",
                                                value: shipped,
                                                change: shippedChange,
                                            })
                                        }
                                        onMouseMove={moveMovementTooltip}
                                        onMouseLeave={() => setMovementTooltip(null)}
                                    />
                                </div>
                                <p className="mt-3 text-center text-base font-medium text-[#8A989E] lg:text-xs">{day}</p>
                            </div>
                        ))}
                    </div>
                </main>
                {movementTooltip && (
                    <div
                        className="pointer-events-none fixed z-50 rounded-lg border border-[#DDE5E8] bg-white px-3 py-2 text-xs shadow-lg"
                        style={{
                            left: movementTooltip.x + 14,
                            top: movementTooltip.y + 14,
                        }}
                    >
                        <p className="font-semibold text-[#22343A]">
                            {movementTooltip.day} {movementTooltip.type}
                        </p>
                        <p className="mt-1 text-[#7B8A91]">{movementTooltip.value} records</p>
                        <p
                            className={
                                "mt-1 font-semibold " +
                                (movementTooltip.change >= 0 ? "text-[#07887D]" : "text-[#C53030]")
                            }
                        >
                            {formatChange(movementTooltip.change)} vs previous period
                        </p>
                    </div>
                )}
            </section>
            <section className="w-full rounded-2xl border border-[#E4EAEC] bg-white px-5 py-5 shadow-sm lg:rounded-lg">
                <header>
                    <h2 className="text-2xl font-semibold leading-none text-[#22343A] lg:text-base">Stock health</h2>
                </header>
                <main className="mt-8">
                    <p className="text-5xl font-semibold leading-none text-[#22343A] lg:text-3xl">248</p>
                    <p className="mt-7 text-base font-medium text-[#8A989E] lg:mt-5 lg:text-xs">Unique items in your inventory</p>

                    <div
                        className="mt-6 flex h-4 overflow-hidden rounded"
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
