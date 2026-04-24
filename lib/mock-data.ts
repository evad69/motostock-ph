import type {
  DashboardMetric,
  DailySalesReportRow,
  InventoryValuationRow,
  LowStockReportRow,
  LookupItem,
  ProductRecord,
  ProductRow,
  ReportHighlight,
  SaleRow,
  StockMovementRow,
  SupplierRow,
  TopSellingPartRow,
} from "@/types";

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Total Products", value: "214", hint: "18 active categories" },
  { label: "Low Stock", value: "12", hint: "Need review this week" },
  { label: "Out of Stock", value: "4", hint: "Immediate refill candidates" },
  {
    label: "Today's Sales",
    value: "PHP 18,460",
    hint: "11 transactions processed",
    accent: true,
  },
];

export const lowStockItems = [
  "NGK Spark Plug CR7HSA - 3 left",
  "Motolite Battery YTX7L - 2 left",
  "Yamaha Mio Brake Shoe - 4 left",
  "125cc Fuel Filter - 1 left",
];

export const recentMovements: StockMovementRow[] = [
  {
    id: "MOV-1842",
    createdAt: "2026-04-12T08:42:00+08:00",
    date: "Apr 12, 2026",
    timestamp: "08:42",
    product: "Denso Iridium Plug IU24",
    type: "sale",
    quantity: "-2",
    note: "Walk-in sale",
  },
  {
    id: "MOV-1841",
    createdAt: "2026-04-12T08:19:00+08:00",
    date: "Apr 12, 2026",
    timestamp: "08:19",
    product: "Motolite Battery YTX7L",
    type: "stock_in",
    quantity: "+10",
    note: "Delivery from Northline Supply",
  },
  {
    id: "MOV-1839",
    createdAt: "2026-04-12T07:56:00+08:00",
    date: "Apr 12, 2026",
    timestamp: "07:56",
    product: "Yamaha Mio Brake Shoe",
    type: "adjustment",
    quantity: "-1",
    note: "Damaged packaging",
  },
  {
    id: "MOV-1838",
    createdAt: "2026-04-11T07:21:00+08:00",
    date: "Apr 11, 2026",
    timestamp: "07:21",
    product: "Castrol Power1 20W-40",
    type: "sale",
    quantity: "-4",
    note: "Counter sale",
  },
];

export const products: ProductRow[] = [
  {
    id: "denso-iridium-plug-iu24",
    name: "Denso Iridium Plug IU24",
    sku: "DSP-IU24",
    brand: "Denso",
    category: "Ignition",
    stock: 24,
    reorderLevel: 6,
    price: "PHP 495",
    status: "Healthy",
  },
  {
    id: "motolite-battery-ytx7l",
    name: "Motolite Battery YTX7L",
    sku: "MTL-YTX7L",
    brand: "Motolite",
    category: "Electrical",
    stock: 2,
    reorderLevel: 4,
    price: "PHP 1,950",
    status: "Low",
  },
  {
    id: "yamaha-mio-brake-shoe",
    name: "Yamaha Mio Brake Shoe",
    sku: "YMH-MIO-BS",
    brand: "Yamaha",
    category: "Brakes",
    stock: 0,
    reorderLevel: 3,
    price: "PHP 380",
    status: "Out",
  },
  {
    id: "castrol-power1-20w40",
    name: "Castrol Power1 20W-40",
    sku: "CST-20W40",
    brand: "Castrol",
    category: "Lubricants",
    stock: 17,
    reorderLevel: 8,
    price: "PHP 355",
    status: "Healthy",
  },
];

export const productRecords: ProductRecord[] = [
  {
    id: "denso-iridium-plug-iu24",
    name: "Denso Iridium Plug IU24",
    sku: "DSP-IU24",
    brand: "Denso",
    category: "Ignition",
    motorcycleModel: "Honda Wave 110 / Yamaha Mio",
    costPrice: 320,
    sellingPrice: 495,
    stockQuantity: 24,
    reorderLevel: 6,
    status: "Healthy",
  },
  {
    id: "motolite-battery-ytx7l",
    name: "Motolite Battery YTX7L",
    sku: "MTL-YTX7L",
    brand: "Motolite",
    category: "Electrical",
    motorcycleModel: "Honda Click 125 / Yamaha Mio Gear",
    costPrice: 1450,
    sellingPrice: 1950,
    stockQuantity: 2,
    reorderLevel: 4,
    status: "Low",
  },
  {
    id: "yamaha-mio-brake-shoe",
    name: "Yamaha Mio Brake Shoe",
    sku: "YMH-MIO-BS",
    brand: "Yamaha",
    category: "Brakes",
    motorcycleModel: "Yamaha Mio Sporty / Soul i",
    costPrice: 240,
    sellingPrice: 380,
    stockQuantity: 0,
    reorderLevel: 3,
    status: "Out",
  },
  {
    id: "castrol-power1-20w40",
    name: "Castrol Power1 20W-40",
    sku: "CST-20W40",
    brand: "Castrol",
    category: "Lubricants",
    motorcycleModel: "Universal 4T scooters and underbones",
    costPrice: 250,
    sellingPrice: 355,
    stockQuantity: 17,
    reorderLevel: 8,
    status: "Healthy",
  },
];

export const sales: SaleRow[] = [
  {
    id: "sale-1842",
    date: "Apr 12, 2026 - 08:42",
    customer: "Walk-in",
    items: "2 items",
    total: "PHP 1,040",
  },
  {
    id: "sale-1841",
    date: "Apr 12, 2026 - 08:05",
    customer: "R. De Leon",
    items: "3 items",
    total: "PHP 2,330",
  },
  {
    id: "sale-1840",
    date: "Apr 11, 2026 - 17:38",
    customer: "Walk-in",
    items: "1 item",
    total: "PHP 355",
  },
];

export const saleRecords = [
  {
    id: "sale-1842",
    customerName: "Walk-in",
    totalAmount: 1040,
    createdAt: "2026-04-12T08:42:00+08:00",
    items: [
      {
        productId: "denso-iridium-plug-iu24",
        productName: "Denso Iridium Plug IU24",
        unitPrice: 495,
        quantity: 2,
        subtotal: 990,
      },
      {
        productId: "castrol-power1-20w40",
        productName: "Castrol Power1 20W-40",
        unitPrice: 50,
        quantity: 1,
        subtotal: 50,
      },
    ],
  },
] satisfies import("@/types").SaleRecord[];

export const suppliers: SupplierRow[] = [
  {
    id: "northline-supply",
    name: "Northline Supply",
    contact: "0917 555 1021",
    location: "Valenzuela City",
    lastDelivery: "Apr 12, 2026",
  },
  {
    id: "metro-moto-trade",
    name: "Metro Moto Trade",
    contact: "0928 880 4412",
    location: "Quezon City",
    lastDelivery: "Apr 10, 2026",
  },
  {
    id: "rizal-parts-depot",
    name: "Rizal Parts Depot",
    contact: "0935 771 9010",
    location: "Antipolo",
    lastDelivery: "Apr 7, 2026",
  },
];

export const supplierRecords = [
  {
    id: "northline-supply",
    name: "Northline Supply",
    contactNumber: "0917 555 1021",
    address: "Valenzuela City",
    notes: "Primary battery and electrical supplier.",
    purchaseHistory: [
      {
        id: "sup-mv-1",
        date: "Apr 12, 2026",
        product: "Motolite Battery YTX7L",
        quantity: 10,
        note: "Morning replenishment",
      },
      {
        id: "sup-mv-2",
        date: "Apr 08, 2026",
        product: "Denso Iridium Plug IU24",
        quantity: 12,
        note: "Weekly restock",
      },
    ],
  },
  {
    id: "metro-moto-trade",
    name: "Metro Moto Trade",
    contactNumber: "0928 880 4412",
    address: "Quezon City",
    notes: "Brake and drivetrain parts.",
    purchaseHistory: [
      {
        id: "sup-mv-3",
        date: "Apr 10, 2026",
        product: "Yamaha Mio Brake Shoe",
        quantity: 8,
        note: "Low-stock reorder",
      },
    ],
  },
  {
    id: "rizal-parts-depot",
    name: "Rizal Parts Depot",
    contactNumber: "0935 771 9010",
    address: "Antipolo",
    notes: "Lubricants and fluids.",
    purchaseHistory: [
      {
        id: "sup-mv-4",
        date: "Apr 07, 2026",
        product: "Castrol Power1 20W-40",
        quantity: 24,
        note: "Monthly oil order",
      },
    ],
  },
] satisfies import("@/types").SupplierRecord[];

export const reportHighlights: ReportHighlight[] = [
  {
    title: "Top-Selling Parts",
    value: "Spark plugs",
    detail: "42 units sold in the last 7 days",
  },
  {
    title: "Inventory Valuation",
    value: "PHP 486,200",
    detail: "Based on cost price x on-hand stock",
  },
  {
    title: "Daily Revenue Avg.",
    value: "PHP 14,910",
    detail: "Trailing 14-day average",
  },
];

export const categories: LookupItem[] = [
  { id: "ignition", name: "Ignition" },
  { id: "electrical", name: "Electrical" },
  { id: "brakes", name: "Brakes" },
  { id: "lubricants", name: "Lubricants" },
];

export const brands: LookupItem[] = [
  { id: "denso", name: "Denso" },
  { id: "motolite", name: "Motolite" },
  { id: "yamaha", name: "Yamaha" },
  { id: "castrol", name: "Castrol" },
];

export const dailySalesReport: DailySalesReportRow[] = [
  { date: "Apr 09", transactions: 9, revenue: 12140 },
  { date: "Apr 10", transactions: 11, revenue: 16980 },
  { date: "Apr 11", transactions: 7, revenue: 11040 },
  { date: "Apr 12", transactions: 11, revenue: 18460 },
];

export const topSellingPartsReport: TopSellingPartRow[] = [
  { productName: "Denso Iridium Plug IU24", quantitySold: 18, revenue: 8910 },
  { productName: "Castrol Power1 20W-40", quantitySold: 15, revenue: 5325 },
  { productName: "Motolite Battery YTX7L", quantitySold: 6, revenue: 11700 },
  { productName: "Yamaha Mio Brake Shoe", quantitySold: 5, revenue: 1900 },
];

export const lowStockReport: LowStockReportRow[] = [
  {
    productId: "motolite-battery-ytx7l",
    productName: "Motolite Battery YTX7L",
    category: "Electrical",
    brand: "Motolite",
    stockQuantity: 2,
    reorderLevel: 4,
  },
  {
    productId: "yamaha-mio-brake-shoe",
    productName: "Yamaha Mio Brake Shoe",
    category: "Brakes",
    brand: "Yamaha",
    stockQuantity: 0,
    reorderLevel: 3,
  },
];

export const inventoryValuationReport: InventoryValuationRow[] = productRecords.map(
  (record) => ({
    productId: record.id,
    productName: record.name,
    category: record.category,
    brand: record.brand,
    costPrice: record.costPrice,
    stockQuantity: record.stockQuantity,
    totalValue: record.costPrice * record.stockQuantity,
  })
);
