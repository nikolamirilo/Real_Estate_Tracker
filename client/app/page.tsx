import DataView from "@/components/DataView";
import MapView from "@/components/MapView";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function Page() {
  const res = await fetch("http://localhost:5000/properties", {cache: "no-store"})
  const data = await res.json()
  if(data)
  return (
    <main className="relative flex flex-row">
        <DataView data={data} />
    </main>
  )
}
