export interface MenuItem {
  name: string;
  key: string;
}

export interface SidebarProps {
  title?: string;
  menuItems: MenuItem[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  className?: string;
}
