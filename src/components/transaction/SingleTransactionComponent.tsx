import { useEffect, ReactNode } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useParams } from "react-router-dom";
import { getTransactionById } from "../../redux/transaction";
import { formatDateTime } from "../../utils/fn";
import _ from "lodash";
import Badge from "../ui/badge/Badge";
import Loader from "../ui/loader/Loader";
import { ITransaction } from "../../redux/transaction/interface";

interface TransactionTableProps {
    singleTransaction: ITransaction | null;
}

export default function SingleTransactionComponent() {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const { singleTransaction, loading } = useSelector(
        (state: RootState) => state.transaction
    );

    useEffect(() => {
        if (!id) return;

        dispatch(getTransactionById(id))
            .unwrap()
            .then(() => console.log("Transaction fetched"))
            .catch((err) => console.error("Error fetching transaction:", err));
    }, [id, dispatch]);

    const statusMap: Record<string, "warning" | "success" | "error" | "primary"> = {
        Processing: "warning",
        successfull: "success",
        pending_treasury: "error",
    };

    const getBadge = (status: string) => statusMap[status] || "primary";

    //  REUSABLE DETAILS ITEM
    interface DetailItem {
        label: string;
        value: string | number | null;
        extra?: ReactNode;
        button?: ReactNode;
        buttons?: ReactNode;
    }

    const beneficiaryDetails: DetailItem[] = [
        { label: "Country", value: _.get(singleTransaction, "beneficiary.country", "-") },
        {
            label: "Benf. Full Name",
            value: _.get(
                singleTransaction,
                "beneficiary.extra_fields.business_name",
                "-"
            ),
        },
        {
            label: "Benf. Bank",
            value: _.get(
                singleTransaction,
                "beneficiary.extra_fields.mpesa_mobile",
                "-"
            ),
        },
        {
            label: "Account Number",
            value: `${_.get(
                singleTransaction,
                "beneficiary.extra_fields.bank_name",
                ""
            )
                } (${_.get(singleTransaction, "beneficiary.bank_code", "-")}) | ${_.get(singleTransaction, "beneficiary.transfer_method") === 2
                    ? _.get(singleTransaction, "beneficiary.extra_fields.mpesa_mobile", "-")
                    : _.get(singleTransaction, "beneficiary.extra_fields.account_number", "-")
                }`,
        },
        ...(singleTransaction?.source_country?.currencyCode === "NGN" &&
            singleTransaction?.destination_country?.currencyCode === "AUD"
            ? [
                {
                    label: "BSB Number",
                    value: _.get(
                        singleTransaction,
                        "beneficiary.extra_fields.bsb_number",
                        "-"
                    ),
                },
            ]
            : []),
        {
            label: "Amount to be Received",
            value: `${_.get(
                singleTransaction,
                "destination_country.currencyCode",
                "-"
            )} ${_.get(singleTransaction, "convert_amount", "-")}`,
        },
    ];

    const paymentSummary: DetailItem[] = [
        {
            label: "Transaction status",
            value: _.get(singleTransaction, "status", "Processing"),
        },
        {
            label: "Payee Name / Bank",
            value: `${_.get(singleTransaction, "userId.business_name", "") ||
                _.get(singleTransaction, "userId.name", "-")
                } | ${_.isEmpty(singleTransaction?.response)
                    ? "-"
                    : _.get(
                        JSON.parse(singleTransaction?.response ?? "{}"),
                        "FinancialInstitutionName",
                        "-"
                    )
                }`,
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <PageMeta
                title="Stahzin Single Transaction"
                description="This is Stahzin Single Transaction page for Stahzin Application"
            />
            <PageBreadcrumb pageTitle="Transaction" />

            <div className="space-y-6">
                {/* TOP SECTION */}
                <div className="flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3">
                    <div className="flex flex-col gap-2.5 divide-gray-300 sm:flex-row sm:divide-x dark:divide-gray-700">
                        <div className="flex items-center gap-2 sm:pr-3">
                            <span className="text-base font-medium text-gray-700 dark:text-gray-400">
                                Transaction Ref No: {singleTransaction?.reference_no}
                            </span>
                            <Badge
                                color={getBadge(singleTransaction?.status || "")}
                                size="sm"
                            >
                                {singleTransaction?.status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 sm:pl-3 dark:text-gray-400">
                            Created At: {formatDateTime(singleTransaction?.createdAt || "")}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition">
                            Approve
                        </button>

                        <button className="shadow-theme-xs inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-gray-700 ring-1 ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">
                            Reject
                        </button>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8 2xl:col-span-9">
                        <TransactionTable singleTransaction={singleTransaction} />
                    </div>
                    <div className="space-y-6 lg:col-span-4 2xl:col-span-3">
                        <DetailsCard title="Beneficiary Details" details={beneficiaryDetails} />
                        <DetailsCard title="Payment Summary" details={paymentSummary} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailsCard({
    title,
    details,
}: {
    title: string;
    details: {
        label: string;
        value: React.ReactNode;
        extra?: React.ReactNode;
        button?: React.ReactNode;
        buttons?: React.ReactNode;
    }[];
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                {title}
            </h2>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {details.map((item, i) => (
                    <li key={i} className="flex items-start gap-5 py-2.5">
                        <span className="w-1/2 text-sm dark:text-gray-400">
                            {item.label}
                        </span>
                        <span className="w-1/2 text-sm dark:text-gray-400">
                            {item.value}
                            {item.extra}
                            {item.button}
                            {item.buttons}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}


function TransactionTable({ singleTransaction }: TransactionTableProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                Payment Details
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="custom-scrollbar overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-700 dark:border-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr className="border-b border-gray-100 whitespace-nowrap dark:border-gray-800">
                                <th className="px-5 py-4">User Name</th>
                                <th className="px-5 py-4">Email</th>
                                <th className="px-5 py-4">Amount Paid</th>
                                <th className="px-5 py-4">Fees</th>
                                <th className="px-5 py-4">Date / Time</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-white/[0.03]">
                            <tr>
                                <td className="px-5 py-4 font-medium dark:text-white/90">
                                    {singleTransaction?.userId?.name ||
                                        singleTransaction?.userId?.business_name ||
                                        "-"}
                                </td>
                                <td className="px-5 py-4 text-gray-500">
                                    {singleTransaction?.userId?.email}
                                </td>
                                <td className="px-5 py-4 text-gray-500">
                                    {singleTransaction?.source_country?.currencyCode}{" "}
                                    {+(singleTransaction?.amount ?? 0) + +(singleTransaction?.fx_fees ?? 0)}
                                </td>
                                <td className="px-5 py-4 text-gray-500">
                                    <strong>
                                        {singleTransaction?.fx_fees} (fee) &nbsp;
                                        {_.get(singleTransaction, "bonus.amount", 0)}{" "}
                                        {_.get(singleTransaction, "bonus.currency", "")} (bonus)
                                    </strong>
                                </td>
                                <td className="px-5 py-4 text-gray-500">
                                    {formatDateTime(singleTransaction?.createdAt || "")}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
