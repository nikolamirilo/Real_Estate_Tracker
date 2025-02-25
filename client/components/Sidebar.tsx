import React from 'react';
import { Offer } from './MapView';
import Image from 'next/image';
import Filter from './Filter';

export const dynamic = "force-dynamic";

const Sidebar = ({ item, setFilteredItems, filteredItems }: { item: Offer, setFilteredItems:any, filteredItems:Offer[] }) => {
  return (
    <div className="z-50 h-screen fixed top-0 left-0 flex flex-col w-[25%] min-w-[200px] bg-clip-border rounded-xl bg-white text-gray-700 max-w-[30rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="flex flex-col overflow-y-auto gap-1 min-w-[200px] p-2 font-sans text-base font-normal text-gray-700">
        <div className={`p-4 border-2 rounded w-full gap-1 flex flex-col`}>
          <div className="w-full h-56 relative">
            <Image
              src={item.image}
              alt={item.street}
              layout="fill"
              objectFit="cover" 
              className="rounded-lg"
            />
          </div>

          <h2 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-gray-900">
            {item.street}
          </h2>
          <p className="text-gray-700 text-sm">{item.city_area}</p>
          <p className="text-gray-500 text-sm">{item.details}</p>
          <p className="font-bold text-md mt-2">
            Ukupna cena:{" "}
            {new Intl.NumberFormat("sr-RS", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(item.price))}
          </p>
          <p className="text-sm">
            Cena po kvadratu:{" "}
            {new Intl.NumberFormat("sr-RS", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(item.price_per_m2))}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <Filter onFilter={setFilteredItems} data={filteredItems} />
      </div>
    </div>
  );
};

export default Sidebar;