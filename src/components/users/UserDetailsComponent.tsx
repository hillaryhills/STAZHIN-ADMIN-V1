import { ReactNode, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useParams } from "react-router-dom";
import { getSingleUser, logoutSession } from "../../redux/user";
import Loader from "../ui/loader/Loader";
import { formatDateTime } from "../../utils/fn";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ISingleUser, loginColumns, renderLoginColumn } from "../../redux/user/interface"
import TableSkeleton from "../ui/skeleton/TableSkeleton";



export default function UserDetailsComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const { singleUser, loading } = useSelector(
        (state: RootState) => state.user
    );

    useEffect(() => {
        if (!id) return;
        dispatch(getSingleUser(id));
    }, [id, dispatch]);

    if (loading || !singleUser) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader />
            </div>
        );
    }

    const user = singleUser as ISingleUser;

      const handleLogoutSession = (sessionId: string) => {
        alert(sessionId);
      };


    return (
        <div>
            <PageMeta
                title="User Details"
                description="User details for Stahzin admin."
            />
            <PageBreadcrumb pageTitle="User Details" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                {/* LEFT: Profile Information */}
                <div className="lg:col-span-1 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        Profile Information
                    </h2>

                    <div className="space-y-5">
                        <Item label="User Type" value={user.userType} />
                        <Item label="Email" value={user.email} />
                        <Item label="Business Name" value={user.business_name} />
                        <Item label="Currency" value={user.currency} />
                        <Item
                            label="Email Verified"
                            value={
                                <span
                                    className={`px-2 py-1 rounded text-xs ${user.is_email_verified
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                >
                                    {user.is_email_verified ? "Verified" : "Not Verified"}
                                </span>
                            }
                        />
                        <Item
                            label="Onboarding"
                            value={user.is_onboarding ? "Completed" : "Pending"}
                        />
                        <Item label="Created At" value={formatDateTime(user.createdAt)} />
                        <Item label="Updated At" value={formatDateTime(user.updatedAt)} />
                    </div>
                </div>

                {/* RIGHT: Login History */}
                <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/5 h-fit">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        Login History
                    </h2>

                    {loading ? (
                        <TableSkeleton rows={5} columns={loginColumns.length} />
                    ) : (
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {loginColumns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            isHeader
                                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {user.loginHistory.map((item) => (
                                    <TableRow key={item._id}>
                                        {loginColumns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                className="px-5 py-4 text-start"
                                            >
                                                {renderLoginColumn(item, handleLogoutSession)[col.key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );

}

function Item({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium text-gray-800 dark:text-gray-100 mt-0.5">
                {value ?? "-"}
            </p>
        </div>
    );
}

