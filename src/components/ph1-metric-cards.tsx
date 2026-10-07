const MetricCardsPhase1 = () => {
    const cards = [
        {label: "Total Stock", value: "12,480", status: "+8.2% from last month"},
        {label: "Inventory value", value: "₱184,250", status: "Across 248 unique items"},
        {label: "Outgoing deliveries", value: "24", status: "6 schedule for today"},
        {label: "Needs attention", value: "18", status: "12 low stock - 6 returns"},
    ];

    return (
        <ul className="grid grid-cols-[repeat(auto-fill,20rem)] justify-center gap-4 py-4 lg:grid-cols-4 lg:justify-stretch lg:gap-5 lg:py-6">
            {cards.map((card) => (
                <li
                    key={card.label}
                    className="flex h-45 w-full flex-col justify-evenly rounded-2xl bg-white px-4 shadow-sm lg:h-[118px] lg:rounded-[8px] lg:border lg:border-[#E1E8EA] lg:px-5"
                >
                    <p className="text-[16px] text-gray-600 lg:text-xs">{card.label}</p>
                    <h1 className="text-5xl font-semibold text-[#353535] lg:text-3xl">{card.value}</h1>
                    <p className="text-[14px] text-gray-600 lg:text-xs">{card.status}</p>
                </li>
            ))}
        </ul>
    );
};

export default MetricCardsPhase1;
