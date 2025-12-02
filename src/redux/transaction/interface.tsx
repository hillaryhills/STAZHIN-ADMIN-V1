import { JSX } from "react"
import { Column, BadgeColorType } from "../app/interface"
import Badge from "../../components/ui/badge/Badge"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"
import { ICountry, IBeneficiary, IPaymentMethod } from "../app/interface"
import { IUser } from "../app/interface"
import { formatAmount, formatDate, timeAgo } from "../../utils/fn"


export interface ITransactionState {
    loading: boolean
    error: null | unknown
    success: boolean
    transactions: any | null
    pagination: any | null
    singleTransaction: any | null
}

export interface ITransaction {
  _id: string;
  userId: string;
  reference_no: string;
  account_type: string;

  source_country: ICountry;
  destination_country: ICountry;

  beneficiary: IBeneficiary;

  amount: number;
  operation_type: string;
  fx_rate: number;
  fx_fees: number;
  convert_amount: number;

  payment_method: IPaymentMethod;

  status: string;
  value_date: string;

  createdAt: string;
  updatedAt: string;

  user: IUser;
}

export interface ITableInput{
 page?: number
  limit?: number
  search?: string
  type?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'

}



export const columns: Column[] = [
    { key: "select", label: "#" },
    { key: "reference_no", label: "Reference" },
    { key: "name", label: "Full Name" },
    { key: "amount", label: "Amount To Send" },
    { key: "convert_amount", label: "Amount To Receive" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
    { key: "action", label: "" },
];

const statusColorMap: Record<string, BadgeColorType> = {
    queued: "warning",
    processing: "info",
    partial: "primary",
    completed: "success",
    failed: "error",
};

export const renderColumn = (
    item: ITransaction,
    selected: string[],
    toggleSelect: (id: string) => void,
    navigate: (path: string) => void
): Record<string, JSX.Element> => {
    return {
        select: (
            <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
            />
        ),
        name: (
            <span className="text-black dark:text-brand-25">
                {item.user.name || item.user.business_name}
            </span>
        ),

        reference_no: (
            <span className="text-black dark:text-brand-25">
                {item.reference_no}
            </span>
        ),

        amount: (
            <span className="text-black dark:text-brand-25">
             {item?.source_country?.currencyCode} {formatAmount(item.amount)}
            </span>
        ),

        convert_amount: (
            <span className="text-black dark:text-brand-25">
                {item?.destination_country?.currencyCode} {formatAmount(item.convert_amount)}
            </span>
        ),

        status: (
            <Badge color={statusColorMap[item.status] || "dark"}>
                {item.status}
            </Badge>
        ),

        createdAt: (
            <span className="text-black dark:text-brand-25">
                {formatDate(item.createdAt)} <br />
                {timeAgo(item.createdAt)} 

            </span>
        ),

        action: (
            <span className="text-black dark:text-brand-25">
                <MoreDotIcon
                    className="cursor-pointer"
                    onClick={() => navigate(`/transaction/${item._id}`)}
                />
            </span>
        ),

    };
};
