import { useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getDashboardCount } from "../../redux/app";

export default function DashboardMetrics() {
  const dispatch = useDispatch<AppDispatch>();
  const nDays = 60

  const { data } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    dispatch(getDashboardCount({ nDays }));
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">

      {/* USERS - NEW */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              New Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.users?.new ?? 0}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            +{data?.users?.new ?? 0}
          </Badge>
        </div>
      </div>

      {/* TRANSACTIONS - TOTAL */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Transactions
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.transactions?.total ?? 0}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {data?.transactions?.success ?? 0}
          </Badge>
        </div>
      </div>

      {/* TRANSACTIONS - PENDING */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Transactions
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.transactions?.pending ?? 0}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            {data?.transactions?.pending ?? 0}
          </Badge>
        </div>
      </div>

    </div>
  );
}
