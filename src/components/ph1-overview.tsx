
const OverviewPhase1 = () => {
    return (
        <div className="relative flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 className="py-6 text-3xl font-semibold text-[#353535] lg:py-0 lg:text-3xl">Overview</h1>
                <p className="text-[14px] text-gray-600 lg:mt-3 lg:text-sm">
                    Here's what's happening in your warehouse today.
                </p>
            </div>
            <button className="flex cursor-pointer justify-center gap-2 rounded-2xl bg-[#127F74] px-4 py-4 text-white lg:rounded-[7px] lg:px-5 lg:py-3 lg:text-sm lg:font-semibold">
                <span>+</span> Request supply
            </button>
        </div>
    );
};

export default OverviewPhase1;
