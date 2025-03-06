import React from "react";

interface SidebarProps {
  setSelectedTab: (tab: string) => void;
  selectedTab: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedTab, selectedTab }) => {
  const menuItems = [
    { name: "Home", key: "home" },
    { name: "Create", key: "create" },
    { name: "Admins", key: "admins" },
    { name: "Users", key: "users" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Super Admin</h2>
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
    </div>
  );
};

export default Sidebar;
