import React from 'react';
import { Offer } from './MapView';
import Image from 'next/image';

const ListView = ({ data }: { data: Offer[] }) => {
    return (
        <div className="flex flex-col w-full bg-clip-border rounded-xl bg-white text-gray-700 p-4 shadow-blue-gray-900/5 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 font-sans text-base font-normal text-gray-700 overflow-y-auto">
                {data
                    ?.sort((a, b) => Number(b.is_match) - Number(a.is_match))
                    .map((item, i) => (
                        <div
                            key={i}
                            className={`p-2 flex-col md:flex-row relative flex h-[180px] overflow-clip rounded bg-white shadow-smooth shadow-xl`}
                        >
                            <div className="w-full md:w-1/2 h-full relative">
                                <Image
                                    src={item.image}
                                    alt={item.street}
                                    unoptimized
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-2/3 md:pl-4 mt-4 md:mt-0">
                                <h3 className="font-semibold text-lg">{item.street}</h3>
                                <p className="text-gray-700 text-sm">{item.city_area}</p>
                                <p className="text-gray-500 text-sm">{item.details}</p>
                                <p className="font-bold text-md mt-2">
                                    Ukupna cena: {new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(item.price))}
                                </p>
                                <p className="text-sm">
                                    Cena po kvadratu: {new Intl.NumberFormat("sr-RS", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(item.price_per_m2))}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ListView;