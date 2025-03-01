"use client"
import { useState } from "react";
import MapView, {  Offer } from "./MapView";
import Sidebar from "./Sidebar";
import ListView from "./ListView";

const tabs = [
  { id: "map", label: "Mapa", content: "This is content for Tab 1." },
  { id: "list", label: "Lista", content: "This is content for Tab 2." },
];

export default function DataView({data}:{data:Offer[]}) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [selected, setSelected] = useState<Offer>(data[0]);
  const [filteredItems, setFilteredItems] = useState<Offer[]>(data);
  return (
    <div className="flex flex-col lg:flex-row">
    <Sidebar item={selected} setFilteredItems={setFilteredItems} filteredItems={filteredItems} />
    <div className="lg:w-[68%] w-full lg:fixed lg:right-0 lg:top-0">
      <div className="flex border-b z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-center border-b-2 font-medium ${activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-800"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="lg:p-4 bg-white border rounded-lg shadow mt-2">
        {activeTab == "map"? <MapView data={filteredItems} setSelected={setSelected} selected={selected}/> : <ListView data={filteredItems}/>}
      </div>
    </div>
    </div>
  );
}