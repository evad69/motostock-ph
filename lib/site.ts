import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  PackagePlus,
  Settings,
  ShoppingCart,
  Truck,
} from "lucide-react";

export const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/movements", label: "Movements", icon: PackagePlus },
  { href: "/sales", label: "Sales", icon: ShoppingCart },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;
