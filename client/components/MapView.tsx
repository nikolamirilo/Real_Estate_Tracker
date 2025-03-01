// components/MapView.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Map, Marker, Overlay } from "pigeon-maps";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/helpers/client";

export type Offer = {
  details: string;
  street: string;
  city_area: string;
  image:string;
  price: string;
  price_per_m2: string;
  is_match: boolean;
  link: string;
  lat: number;
  lon: number;
};



function MapView({data, selected, setSelected}: {data:Offer[], setSelected:any, selected:any}) {
  return (
    <div className="w-full z-10">
    <Map height={800} defaultCenter={[44.780000, 20.3500000]} defaultZoom={12}>
      {data.map((item: Offer, i) => {
        return (
        <Marker
          key={i}
          width={50}
          anchor={[Number(item.lat), Number(item.lon)]}
          color={item.is_match == true ? "red" : "blue"}
          onClick={() => setSelected(item)}
        />
      )})}
      {selected.lat !== 0 && selected.lon !== 0 && (
        <Overlay anchor={[Number(selected.lat), Number(selected.lon)]} offset={[90, 200]}>
          <div
            className="relative bg-white p-2.5 rounded-xl max-w-[200px]"
            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
          >
            <strong>
              <h3 className="text-black text-sm">{selected.street}</h3>
            </strong>
            <p className="text-black text-sm">{selected.city_area}</p>
            <p className="text-black text-sm">{selected.details}</p>
            <p className="text-black text-sm">{formatCurrency(selected.price)}</p>
            <p className="text-black text-sm">{formatCurrency(selected.price_per_m2)}</p>
          </div>
        </Overlay>
      )}
    </Map>
    </div>
  );
}

export default dynamic (() => Promise.resolve(MapView), {ssr: false})