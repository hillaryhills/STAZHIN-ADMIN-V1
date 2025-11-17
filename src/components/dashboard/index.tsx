import DashboardMetrics from "./DashboardMetrics";
import RecentOrders from "./RecentOrders";
import PageMeta from "../../components/common/PageMeta";

export default function DashboardComponent() {
  return (
    <>
      <PageMeta
        title="Stazhin Adminstration Dashboard"
        description="This is Stazhin Adminstration Dashboard page for Stahzin Application"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-full">
          <DashboardMetrics />
        </div>

        <div className="col-span-12 xl:col-span-full">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
