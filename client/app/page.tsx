import DataView from "@/components/DataView";

export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function Page() {
  const res = await fetch("https://realestatetrackerbackend-0ngudte9.b4a.run/properties", {cache: "no-store"})
  const data = await res.json()
  if(data)
  return (
    <main className="relative flex flex-row">
        <DataView data={data} />
    </main>
  )
}
