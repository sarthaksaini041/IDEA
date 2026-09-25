import type { ModelView } from "../lib/catalog";
import { genRange, pcieLabel } from "../lib/catalog";

export function SpecSheet({ m }: { m: ModelView }) {
  const rows: [string, string][] = [
    ["CPU generations", genRange(m)],
    ["Typical CPUs", m.cpuList.map((c) => `${c.name} (${c.cores}C/${c.threads}T, ${c.tdpW} W)`).join("; ")],
    ["Chipset", m.chipset ?? "Not listed"],
    ["Memory", `${m.ram.slots}× ${m.ram.type} SO-DIMM, up to ${m.ram.speedMTs} MT/s, ${m.ram.maxOfficialGB} GB official maximum`],
    ["M.2 NVMe slots (storage)", String(m.storage.m2Nvme)],
    ['2.5" SATA bays', String(m.storage.sata25)],
    ["PCIe expansion", pcieLabel(m.pcieSlot)],
    ["Onboard Ethernet", m.nic ?? "Not listed"],
    ["Extra NIC option", m.extraNicOption ?? "None (USB adapter only)"],
    ["vPro / AMT", m.vpro === "some-skus" ? "On vPro CPU configurations" : m.vpro === "no" ? "No" : "Not listed"],
    ["Power adapters", m.psuW ? m.psuW.map((w) => `${w} W`).join(" or ") : "Not listed"],
    ["Idle power (measured)", m.idleW ? `${m.idleW} W at the wall` : "Not measured yet"],
  ];
  return (
    <div className="panel" style={{ padding: 0 }}>
      <table className="specs">
        <caption className="skip">Specifications for {m.name}</caption>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
