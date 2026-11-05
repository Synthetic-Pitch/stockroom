import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Plus, Save, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/navbar";

type StockPolicy = {
    item: string;
    sku: string;
    onHand: number;
    averageDailyUse: number;
    leadTime: number;
    bufferDays: number;
    supplier: string;
};

const initialPolicies: StockPolicy[] = [
    { item: "Nitrile gloves", sku: "GL-208", onHand: 48, averageDailyUse: 12, leadTime: 6, bufferDays: 3, supplier: "Pacific Rim Auto Parts" },
    { item: "Breaker Bar 24in", sku: "HT-BKB-24I-615", onHand: 5, averageDailyUse: 2, leadTime: 9, bufferDays: 4, supplier: "Kabuayan Tool Distro" },
    { item: "Penetrating Oil Spray 400ml", sku: "WS-SPR-PNT-832", onHand: 10, averageDailyUse: 3, leadTime: 7, bufferDays: 3, supplier: "Metro Tools Import Co." },
    { item: "Safety goggles", sku: "SG-031", onHand: 36, averageDailyUse: 4, leadTime: 5, bufferDays: 2, supplier: "Oriental Tools & Equipment" },
    { item: "Thermal labels", sku: "TL-086", onHand: 220, averageDailyUse: 18, leadTime: 4, bufferDays: 2, supplier: "Apex Automotive Supplies Inc." },
];

const safetyStock = (policy: StockPolicy) => Math.ceil(policy.averageDailyUse * policy.bufferDays);
const reorderPoint = (policy: StockPolicy) => Math.ceil(policy.averageDailyUse * (policy.leadTime + policy.bufferDays));

const SafetyStock = () => {
    const [policies, setPolicies] = useState(initialPolicies);
    const [showOnlyAtRisk, setShowOnlyAtRisk] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newPolicy, setNewPolicy] = useState({ item: "", sku: "", onHand: "", averageDailyUse: "", leadTime: "5", bufferDays: "2", supplier: "" });

    const atRisk = useMemo(() => policies.filter((policy) => policy.onHand <= reorderPoint(policy)), [policies]);
    const visiblePolicies = showOnlyAtRisk ? atRisk : policies;
    const totalRecommended = atRisk.reduce((total, policy) => total + Math.max(reorderPoint(policy) * 2 - policy.onHand, 0), 0);

    const updatePolicy = (index: number, field: "leadTime" | "bufferDays", value: string) => {
        const parsed = Math.max(0, Number(value) || 0);
        setPolicies((current) => current.map((policy, policyIndex) => policyIndex === index ? { ...policy, [field]: parsed } : policy));
        setSaved(false);
    };

    const addPolicy = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPolicies((current) => [...current, {
            item: newPolicy.item, sku: newPolicy.sku || "NEW-SKU", onHand: Number(newPolicy.onHand) || 0,
            averageDailyUse: Number(newPolicy.averageDailyUse) || 1, leadTime: Number(newPolicy.leadTime) || 0,
            bufferDays: Number(newPolicy.bufferDays) || 0, supplier: newPolicy.supplier || "Unassigned supplier",
        }]);
        setNewPolicy({ item: "", sku: "", onHand: "", averageDailyUse: "", leadTime: "5", bufferDays: "2", supplier: "" });
        setIsAdding(false);
    };

    return <div className="min-h-screen bg-[#F4F7F8] font-sans text-[#22343A] lg:flex">
        <Navbar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:mx-auto lg:max-w-[1220px] lg:px-8 lg:py-10">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div><div className="flex items-center gap-2 text-[#07887D]"><ShieldCheck className="size-5" /><span className="text-xs font-bold uppercase tracking-[.16em]">Inventory resilience</span></div><h1 className="mt-3 text-3xl font-semibold lg:text-4xl">Safety stock</h1><p className="mt-3 max-w-xl text-sm text-[#7B8A91]">Protect essential inventory from supplier delays and unexpected demand. Tune the buffer for each item, then save the policy.</p></div>
                <button type="button" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 2600); }} className="flex w-fit items-center gap-2 rounded-lg bg-[#07887D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#06766D]"><Save className="size-4" />{saved ? "Policies saved" : "Save changes"}</button>
            </header>

            <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Items monitored" value={String(policies.length)} note="Active safety policies" />
                <Metric label="Need attention" value={String(atRisk.length)} note="At or below reorder point" accent="amber" />
                <Metric label="Recommended order" value={totalRecommended.toLocaleString() + " units"} note="To restore target coverage" accent="red" />
                <Metric label="Policy coverage" value="92%" note="Of critical consumables" accent="green" />
            </section>

            {saved && <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#9AD8D2] bg-[#E8F5F3] px-4 py-3 text-sm font-medium text-[#06766D]"><CheckCircle2 className="size-4" />Safety-stock policies updated.</div>}

            <section className="mt-6 rounded-xl border border-[#DDE5E8] bg-white p-4 shadow-sm lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-semibold">Policy settings</h2><p className="mt-1 text-xs text-[#7B8A91]">Safety stock = average daily usage × buffer days.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setShowOnlyAtRisk((current) => !current)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${showOnlyAtRisk ? "border-[#07887D] bg-[#E8F5F3] text-[#06766D]" : "border-[#DDE5E8] text-[#52646A]"}`}><SlidersHorizontal className="size-4" />{showOnlyAtRisk ? "Showing at risk" : "Show at risk"}</button><button type="button" onClick={() => setIsAdding((current) => !current)} className="flex items-center gap-2 rounded-lg bg-[#22343A] px-3 py-2 text-xs font-semibold text-white"><Plus className="size-4" />Add policy</button></div></div>
                {isAdding && <form onSubmit={addPolicy} className="mt-5 grid gap-3 rounded-lg bg-[#F4F7F8] p-4 md:grid-cols-4"><input required value={newPolicy.item} onChange={(event) => setNewPolicy({ ...newPolicy, item: event.target.value })} placeholder="Item name" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input value={newPolicy.sku} onChange={(event) => setNewPolicy({ ...newPolicy, sku: event.target.value })} placeholder="SKU" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input required type="number" min="0" value={newPolicy.onHand} onChange={(event) => setNewPolicy({ ...newPolicy, onHand: event.target.value })} placeholder="On hand" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input required type="number" min="1" value={newPolicy.averageDailyUse} onChange={(event) => setNewPolicy({ ...newPolicy, averageDailyUse: event.target.value })} placeholder="Daily use" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input type="number" min="0" value={newPolicy.leadTime} onChange={(event) => setNewPolicy({ ...newPolicy, leadTime: event.target.value })} placeholder="Lead time" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input type="number" min="0" value={newPolicy.bufferDays} onChange={(event) => setNewPolicy({ ...newPolicy, bufferDays: event.target.value })} placeholder="Buffer days" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><input value={newPolicy.supplier} onChange={(event) => setNewPolicy({ ...newPolicy, supplier: event.target.value })} placeholder="Supplier" className="rounded-md border border-[#DDE5E8] bg-white px-3 py-2 text-sm outline-none focus:border-[#07887D]"/><button className="rounded-md bg-[#07887D] px-3 py-2 text-sm font-semibold text-white">Create policy</button></form>}
                <div className="mt-5 overflow-x-auto"><table className="min-w-[940px] w-full text-left text-sm"><thead className="border-y border-[#E8EEF0] bg-[#F8FAFA] text-xs font-semibold text-[#7B8A91]"><tr><th className="px-4 py-3">Item</th><th className="px-3 py-3">On hand</th><th className="px-3 py-3">Daily use</th><th className="px-3 py-3">Lead time</th><th className="px-3 py-3">Buffer</th><th className="px-3 py-3">Safety stock</th><th className="px-3 py-3">Reorder point</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{visiblePolicies.map((policy) => { const risk = policy.onHand <= reorderPoint(policy); const index = policies.indexOf(policy); return <tr key={policy.sku} className="border-b border-[#EEF2F3]"><td className="px-4 py-4"><p className="font-semibold">{policy.item}</p><p className="mt-1 text-xs text-[#7B8A91]">{policy.sku} · {policy.supplier}</p></td><td className="px-3 py-4 font-semibold">{policy.onHand}</td><td className="px-3 py-4">{policy.averageDailyUse} / day</td><td className="px-3 py-4"><input aria-label={`Lead time for ${policy.item}`} type="number" min="0" value={policy.leadTime} onChange={(event) => updatePolicy(index, "leadTime", event.target.value)} className="w-16 rounded border border-[#DDE5E8] px-2 py-1.5 text-sm outline-none focus:border-[#07887D]" /> <span className="text-xs text-[#7B8A91]">days</span></td><td className="px-3 py-4"><input aria-label={`Buffer days for ${policy.item}`} type="number" min="0" value={policy.bufferDays} onChange={(event) => updatePolicy(index, "bufferDays", event.target.value)} className="w-16 rounded border border-[#DDE5E8] px-2 py-1.5 text-sm outline-none focus:border-[#07887D]" /> <span className="text-xs text-[#7B8A91]">days</span></td><td className="px-3 py-4 font-semibold">{safetyStock(policy)}</td><td className="px-3 py-4 font-semibold">{reorderPoint(policy)}</td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${risk ? "bg-[#FFF3E8] text-[#B45309]" : "bg-[#E8F5F3] text-[#06766D]"}`}>{risk ? <AlertTriangle className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}{risk ? "Reorder now" : "Covered"}</span></td></tr>; })}</tbody></table></div>
                {visiblePolicies.length === 0 && <div className="py-12 text-center text-sm text-[#7B8A91]">All monitored items are above their reorder point.</div>}
            </section>
        </main>
    </div>;
};

const Metric = ({ label, value, note, accent = "default" }: { label: string; value: string; note: string; accent?: "default" | "amber" | "red" | "green" }) => <article className="rounded-xl border border-[#DDE5E8] bg-white p-5 shadow-sm"><p className="text-sm font-medium text-[#7B8A91]">{label}</p><p className={`mt-3 text-2xl font-semibold ${accent === "amber" ? "text-[#B45309]" : accent === "red" ? "text-[#C2413A]" : accent === "green" ? "text-[#07887D]" : "text-[#22343A]"}`}>{value}</p><p className="mt-2 text-xs text-[#7B8A91]">{note}</p></article>;

export default SafetyStock;
