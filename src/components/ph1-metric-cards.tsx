const MetricCardsPhase1 = () => {
    const cards = [
        { label: "Total Stock", value: "12,480", status: "+8.2% from last month" },
        { label: "Inventory value", value: "₱184,250", status: "Across 248 unique items" },
        { label: "Outgoing deliveries", value: "24", status: "6 scheduled for today" },
        { label: "Needs attention", value: "18", status: "12 low stock - 6 returns" },
    ];

    return (
        <ul className="grid grid-cols-2 gap-3 py-4 lg:grid-cols-4 lg:gap-5 lg:py-6">
            {cards.map((card) => (
                <li
                    key={card.label}
                    className="min-w-0 overflow-hidden rounded-xl bg-white px-4 py-5 shadow-sm lg:px-5 lg:py-6"
                >
                    <p className="truncate text-xs font-medium text-[#7B8A91] lg:text-sm">{card.label}</p>
                    <h1 className="mt-4 truncate text-2xl font-semibold leading-tight text-[#22343A] sm:text-3xl lg:mt-5 lg:text-3xl">
                        {card.value}
                    </h1>
                    <p className="mt-4 truncate text-[10px] font-medium text-[#7B8A91] lg:mt-5 lg:text-xs">
                        {card.status}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default MetricCardsPhase1;
