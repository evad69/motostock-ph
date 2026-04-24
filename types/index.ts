export type UserRole = "admin";

export type NavItem = {
  href: string;
  label: string;
};

export type UserProfile = {
  id: string;
  fullName: string | null;
  role: UserRole;
};

export type ManagedProfile = {
  id: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string | null;
};

export type DashboardMetric = {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
};

export type StockMovementType = "stock_in" | "sale" | "adjustment";

export type StockMovementRow = {
  id: string;
  createdAt: string;
  date: string;
  timestamp: string;
  product: string;
  type: StockMovementType;
  quantity: string;
  note: string;
};

export type ProductStatus = "Healthy" | "Low" | "Out";

export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  stock: number;
  reorderLevel: number;
  price: string;
  status: ProductStatus;
};

export type ProductRecord = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  motorcycleModel: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  status: ProductStatus;
};

export type ProductFormValues = {
  id?: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  motorcycleModel: string;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: string;
  reorderLevel: string;
};

export type SaleRow = {
  id: string;
  date: string;
  customer: string;
  items: string;
  total: string;
};

export type SaleProductOption = {
  id: string;
  name: string;
  sellingPrice: number;
  stockQuantity: number;
};

export type SaleFormItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type SaleRecord = {
  id: string;
  customerName: string | null;
  totalAmount: number;
  createdAt: string;
  items: SaleFormItem[];
};

export type SupplierRow = {
  id: string;
  name: string;
  contact: string;
  location: string;
  lastDelivery: string;
};

export type SupplierPurchaseRow = {
  id: string;
  date: string;
  product: string;
  quantity: number;
  note: string;
};

export type SupplierRecord = {
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  notes: string;
  purchaseHistory: SupplierPurchaseRow[];
};

export type SupplierFormValues = {
  id?: string;
  name: string;
  contactNumber: string;
  address: string;
  notes: string;
};

export type ReportHighlight = {
  title: string;
  value: string;
  detail: string;
};

export type LookupItem = {
  id: string;
  name: string;
};

export type DailySalesReportRow = {
  date: string;
  transactions: number;
  revenue: number;
};

export type TopSellingPartRow = {
  productName: string;
  quantitySold: number;
  revenue: number;
};

export type LowStockReportRow = {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  stockQuantity: number;
  reorderLevel: number;
};

export type InventoryValuationRow = {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  costPrice: number;
  stockQuantity: number;
  totalValue: number;
};
