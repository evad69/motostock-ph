import { PageLoader } from "@/components/ui/PageLoader";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AppLoading() {
  return (
    <div className="space-y-10">
      <PageLoader />
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}
