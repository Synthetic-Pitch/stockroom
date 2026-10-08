import { Archive, CornerUpLeft, Download, Truck } from "lucide-react";

const UpcomingRecently = () => {
    const deliveries = [
        {
            code: "DL-2048",
            detail: "Meridian Retail - 32 items",
            status: "Delivering",
        },
        {
            code: "DL-2049",
            detail: "Eastside Studio - 18 items",
            status: "Scheduled",
        },
        {
            code: "DL-2050",
            detail: "Harbor Supply - 45 items",
            status: "Arrived",
        },
    ];
    const activities = [
        {
            Icon: Download,
            title: "Stock received",
            detail: "240 units from Harbor Supply - 12 min ago",
        },
        {
            Icon: CornerUpLeft,
            title: "Return under inspection",
            detail: "RT-0086 - Damaged packaging - 38 min ago",
        },
        {
            Icon: Archive,
            title: "Supply request approved",
            detail: "SR-0124 - Drop off tomorrow, 10 AM",
        },
    ];

    return (
        <div className="space-y-5 py-5 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 lg:py-6">
            <section className="w-full rounded-2xl border border-[#E1E8EA] bg-white px-4 py-6 shadow-sm lg:rounded-lg lg:px-5">
                <h2 className="text-xl font-semibold leading-none text-[#22343A] lg:text-base">Upcoming deliveries</h2>
                <ul className="mt-6 space-y-6 lg:space-y-5">
                    {deliveries.map((delivery) => (
                        <li key={delivery.code} className="flex items-center gap-4">
                            <Truck className="size-6 shrink-0 text-[#07887D] lg:size-5" aria-hidden="true" />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-semibold leading-tight text-[#22343A] lg:text-sm">
                                    {delivery.code}
                                </h3>
                                <p className="truncate text-sm font-medium text-[#6D7C84] lg:text-xs">
                                    {delivery.detail}
                                </p>
                            </div>
                            <p className="shrink-0 text-sm font-medium text-[#007F74] lg:text-xs">{delivery.status}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="w-full rounded-2xl border border-[#E1E8EA] bg-white px-4 py-6 shadow-sm lg:rounded-lg lg:px-5">
                <h2 className="text-xl font-semibold leading-none text-[#22343A] lg:text-base">Recent activity</h2>
                <ul className="mt-6 space-y-6 lg:space-y-5">
                    {activities.map(({Icon, title, detail}) => (
                        <li key={title} className="flex items-start gap-4">
                            <Icon className="mt-1 size-6 shrink-0 text-[#07887D] lg:size-5" aria-hidden="true" />
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold leading-tight text-[#22343A] lg:text-sm">
                                    {title}
                                </h3>
                                <p className="text-sm font-medium text-[#6D7C84] lg:text-xs">{detail}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default UpcomingRecently;
