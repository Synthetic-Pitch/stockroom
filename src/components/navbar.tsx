import {
    Box,
    Inbox,
    Layers,
    LayoutGrid,
    Package,
    RotateCcw,
    RotateCcwClock,
    Truck,
    User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../assets/imgs/profile1x1_enhanced.png";

const Navbar = () => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const navItems = [
        {id: "overview", label: "Overview", value: "", Icon: LayoutGrid, url: "/dashboard"},
        {id: "inventory", label: "Inventory", value: "248", Icon: Package, url: "/inventory"},
        {id: "warehouse", label: "Warehouses", value: "3", Icon: Box, url: "/warehouse"},
        {id: "deliveries", label: "Deliveries", value: "24", Icon: Truck, url: "/deliveries"},
        {id: "supply-request", label: "Supply requests", value: "8", Icon: Inbox, url: "/supply-request"},
        {id: "customers", label: "Customers", value: "", Icon: User, url: "/customers"},
        {id: "returns", label: "Returns", value: "6", Icon: RotateCcw, url: "/returns"},
        {id: "history", label: "History", value: "", Icon: RotateCcwClock, url: "/history"},
    ];

    return (
        <>
            <nav className="overflow-x-hidden bg-[#172b32] px-4 py-3 font-poppins text-white lg:hidden">
                <div className="flex h-1/2 items-center gap-4 text-2xl">
                    <Layers aria-hidden="true" className="size-7 shrink-0" />
                    <p>stockroom</p>
                </div>
                <ul className="flex h-1/2 w-full flex-wrap justify-center gap-6 pb-2 pt-8">
                    {navItems.map(({id, Icon, label, url}) => {
                        const isSelected = pathname === url;

                        return (
                            <li key={id}>
                                <button
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => navigate(url)}
                                    className={`flex min-w-max items-center gap-2 rounded-md px-3 py-1 transition-colors ${
                                        isSelected ? "bg-[#28504F]" : "hover:bg-[#28504f4f]"
                                    }`}
                                >
                                    <Icon className="size-5" aria-hidden="true" />
                                    <span className="text-[14px]">{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <aside className="hidden w-[232px] shrink-0 flex-col bg-[#172B32] px-5 py-6 text-white lg:flex">
                <div className="flex items-center gap-3 text-2xl font-semibold">
                    <Layers className="size-7" aria-hidden="true" />
                    <span>stockroom</span>
                </div>

                <section className="mt-8 rounded-[7px] bg-[#244047] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8FA4AA]">
                        Atlas operations
                    </p>
                    <p className="mt-2 text-sm font-semibold">Main warehouse</p>
                </section>

                <div className="mt-7">
                    <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-[#8FA4AA]">
                        Workspace
                    </p>
                    <nav className="mt-3 space-y-1" aria-label="Workspace sections">
                        {navItems.map(({id, label, value, Icon, url}) => {
                            const isSelected = pathname === url;

                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => navigate(url)}
                                    aria-pressed={isSelected}
                                    className={`flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-sm transition-colors ${
                                        isSelected ? "bg-[#28504F] text-white" : "text-[#C7D3D7] hover:bg-[#244047]"
                                    }`}
                                >
                                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                                    <span className="min-w-0 flex-1">{label}</span>
                                    {value && <span className="text-xs text-[#9FB1B6]">{value}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>
                
                <section className="mt-16 rounded-[7px] bg-[#244047] px-4 py-4">
                    <p className="text-sm font-semibold">Everything in its place.</p>
                    <p className="mt-2 text-xs leading-5 text-[#B5C5C9]">
                        Your warehouse is 87% full. Keep an eye on incoming stock.
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#173137]">
                        <span className="block h-full w-[87%] rounded-full bg-[#07887D]" />
                    </div>
                </section>

                <section className="mt-7 flex items-center gap-3">
                    <div className="size-9 overflow-hidden rounded-full bg-[#6B8A91]">
                        <img src={profile} alt="" className="h-full w-full object-cover scale-[.95]" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">Reymark Dequito</p>
                        <p className="text-xs text-[#9FB1B6]">Warehouse manager</p>
                    </div>
                </section>
            </aside>
        </>
    );
};

export default Navbar;
