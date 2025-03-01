import React from 'react';
import { Offer } from './MapView';
import Image from 'next/image';
import Filter from './Filter';
import { formatCurrency } from '@/helpers/client';

export const dynamic = "force-dynamic";

const Sidebar = ({ item, setFilteredItems, filteredItems }: { item: Offer, setFilteredItems: any, filteredItems: Offer[] }) => {
  return (
    <div className="z-50 lg:h-screen overflow-y-auto lg:fixed lg:top-0 lg:left-0 flex flex-col lg:w-[30%] lg:min-w-[200px] bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 lg:max-w-[30rem] p-4 lg:shadow-2xl lg:shadow-blue-gray-900/10">
      {/* Custom Scrollbar Styling */}
      <style jsx>{`
        .sidebar::-webkit-scrollbar {
          width: 8px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <div className="sidebar flex flex-col gap-2 min-w-[200px] font-sans text-base font-normal text-gray-700">
        {/* Item Card */}
        <div className={`hidden lg:flex p-2 border border-gray-200 rounded-lg w-full flex-col shadow-sm bg-white hover:shadow-md transition-shadow duration-300`}>
          <div 
            className="w-full h-56 relative cursor-pointer rounded-lg overflow-hidden"
            onClick={() => window.open(item.link, "_blank")}
          >
            <Image
              src={item.image}
              unoptimized
              alt={item.street}
              layout="fill"
              objectFit="cover"
              className="rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h2 className="mt-4 block antialiased tracking-normal font-sans text-xl font-bold leading-snug text-gray-900">
            {item.street}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{item.city_area}</p>
          <p className="text-gray-500 text-sm mt-1">{item.details}</p>
          <p className="font-bold text-md mt-2">
            Ukupna cena:{" "}
            {formatCurrency(item.price)}
          </p>
          <p className="text-sm mt-1">
            Cena po kvadratu:{" "}
            {formatCurrency(item.price_per_m2)}
          </p>
          {item.is_match === false && (
            <span className="text-sm text-blue-500 mt-2">
              PS: Pin na mapi ne pokazuje tačnu lokaciju jer je došlo do greške pri obradi.
            </span>
          )}
        </div>

        {/* Filter Component */}
        <div className="mb-4">
          <Filter onFilter={setFilteredItems} data={filteredItems} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;