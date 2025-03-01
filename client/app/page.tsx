import DataView from "@/components/DataView";
import { FaRegSadCry } from "react-icons/fa";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Page() {
  try {
    const res = await fetch("https://realestatetrackerbackend-0ngudte9.b4a.run/properties");

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    return (
      <main className="relative flex flex-row">
        <DataView data={data} />
      </main>
    );
  } catch (error) {
    console.error(error);

    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen">
        <p className="font-semibold text-2xl max-w-[35rem] text-center mb-10">Greška pri učitavanju podataka. Pokušajte ponovo kasnije.</p>
        <FaRegSadCry className="animate-bounce" size={150}/>
      </main>
    );
  }
}
