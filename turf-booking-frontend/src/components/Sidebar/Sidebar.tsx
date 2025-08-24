import React from "react";
import { SidebarProps } from "./Sidebar.types";



const Sidebar: React.FC<SidebarProps> = ({
  title = "Menu",
  menuItems,
  selectedTab,
  setSelectedTab,
  className = "",
}) => {
  return (
    <>
     <h2 className="text-xl font-bold mb-6">{title}</h2>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`cursor-pointer p-2 rounded-lg ${
              selectedTab === item.key ? "bg-blue-500" : "hover:bg-gray-700"
            }`}
            onClick={() => setSelectedTab(item.key)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </>
     
  );
};

export default Sidebar;
