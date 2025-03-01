import React, { useState } from 'react';
import { Offer } from './MapView';
import Image from 'next/image';
import { formatCurrency } from '@/helpers/client';

const ListView = ({ data }: { data: Offer[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col w-full bg-clip-border rounded-xl bg-white text-gray-700 p-4 shadow-blue-gray-900/5 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 font-sans text-base font-normal text-gray-700 overflow-y-auto">
                {data
                    ?.sort((a, b) => Number(b.is_match) - Number(a.is_match))
                    .map((item, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`p-2 cursor-pointer flex-col md:flex-row relative flex h-[350px] lg:h-[180px] overflow-clip rounded bg-white shadow-smooth shadow-xl`}
                        >
                            {/* Overlay covering the entire card */}
                            {hoveredIndex === i && (
                                <div className="absolute inset-0 z-10 transition  ease-in-out delay-150 duration-300 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the parent div's onClick from firing
                                            window.open(item.link, "_blank");
                                        }}
                                        className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 hover:scale-[1.02] transition ease-in-out"
                                    >
                                        Pogledaj ponudu
                                    </button>
                                </div>
                            )}

                            {/* Image */}
                            <div className="w-full lg:w-1/2 lg:h-full h-48 relative">
                                <Image
                                    src={item.image}
                                    alt={item.street}
                                    unoptimized
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col w-full md:w-2/3 md:pl-4 mt-4 md:mt-0">
                                <h3 className="font-semibold text-lg">{item.street}</h3>
                                <p className="text-gray-700 text-sm">{item.city_area}</p>
                                <p className="text-gray-500 text-sm">{item.details}</p>
                                <p className="font-bold text-md mt-2">
                                    Ukupna cena: {formatCurrency(item.price)}
                                </p>
                                <p className="text-sm">
                                    Cena po kvadratu: {formatCurrency(item.price_per_m2)}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListView;