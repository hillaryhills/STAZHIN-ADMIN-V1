import { JSX } from "react"
import { Column } from "../app/interface"
import Checkbox from "../../components/form/input/Checkbox"
import Badge from "../../components/ui/badge/Badge"
import { MoreDotIcon } from "../../icons"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"



export interface IBankMethodState {
    loading: boolean
    error: null | unknown
    success: boolean
    bankMethods: IBankMethod[] | null
    pagination: IPagination | null
    singleBankMethod: IBankMethod | null
}

export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalBankMethods: number;
}


export interface IBankMethod {
    _id: string;
    name: string;
    transferTime: string;
    senderCountry: number;
    active: boolean;
    bank_fees: {
        min: number;
        max: number;
        fees: number;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;

    id: string; // duplicate of _id in the API
}


export const columns: Column[] = [
    { key: "select", label: "" },
    { key: "name", label: "Name" },
    { key: "transfer_time", label: "Transfer Time" },
    { key: "sender_country", label: "Sender Country" },
    { key: "status", label: "Status" },
    { key: "register_at", label: "Registered At" },
    { key: "action", label: "" },
];


export const renderColumn = (
    item: IBankMethod,
    selected: string[],
    toggleSelect: (id: string) => void,

    toggleDropdown: (id: string | null) => void,
    openDropdown: string | null,
    handleView: (item: IBankMethod) => void,
    handleEdit: (item: IBankMethod) => void,
    handleDelete: (id: string) => void
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
                {item.name}
            </span>
        ),


        transfer_time: (
            <span className="text-black dark:text-brand-25">
                {item.transferTime}
            </span>
        ),


        sender_country: (
            <span className="text-black dark:text-brand-25">
                {item.senderCountry}
            </span>
        ),


        status: (
            <Badge color={item.active ? "success" : "error"}>
                {item.active ? "Active" : "Inactive"}
            </Badge>
        ),

        register_at: (
            <span className="text-black dark:text-brand-25">
                {new Date(item.createdAt).toLocaleDateString()}
            </span>
        ),


        action: (
            <div className="relative">
                {/* Toggle button */}
                <div
                    className="cursor-pointer dropdown-toggle "
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item._id);
                    }}
                >
                    <MoreDotIcon className="text-gray-700 dark:text-gray-400" />
                </div>

                <Dropdown
                    isOpen={openDropdown === item._id}
                    onClose={() => toggleDropdown(null)}
                    className="w-36"
                >
                    <DropdownItem onClick={() => handleView(item)} className="text-gray-700 dark:text-gray-400">
                        View
                    </DropdownItem>

                    <DropdownItem onClick={() => handleEdit(item)} className="text-gray-700 dark:text-gray-400">
                        Edit
                    </DropdownItem>

                    <DropdownItem
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:bg-red-50"
                    >
                        Delete
                    </DropdownItem>
                </Dropdown>
            </div>
        )


    }
}

export interface IFormData {
    name: string;
    transferTime: string;
    senderCountry: number;
    active: boolean;
    bank_fees: {
        min: number;
        max: number;
        fees: number;
    }[];
}