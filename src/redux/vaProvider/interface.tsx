import { JSX } from "react"
import { Column } from "../app/interface"
import Checkbox from "../../components/form/input/Checkbox"
import Badge from "../../components/ui/badge/Badge"
import { MoreDotIcon } from "../../icons"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"



export interface IVaProviderState {
    loading: boolean
    error: null | unknown
    success: boolean
    vaProviders: IVaProvider[] | null
    pagination: IPagination | null
    singleVaProvider: IVaProvider | null
}

export interface IVaProvider {
    _id: string;
    provider_name: string;
    currency: {
        name: string;
        _id: string;
    }[];
    wallet_type: string;
    virtual_wallet: string;
    fx_type: string;
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    currentPage: number;
    totalPages: number;
    total: number;
}



export const columns: Column[] = [
    { key: "select", label: "" },
    { key: "provider", label: "Provider" },
    { key: "wallet_type", label: "Wallet Type" },
    { key: "fx_type", label: "Fx Type" },
    { key: "status", label: "Status" },
    { key: "register_at", label: "Registered At" },
    { key: "action", label: "" },
];


export const renderColumn = (
    item: IVaProvider,
    selected: string[],
    toggleSelect: (id: string) => void,

    toggleDropdown: (id: string | null) => void,
    openDropdown: string | null,
    handleView: (item: IVaProvider) => void,
    handleEdit: (item: IVaProvider) => void,
    handleDelete: (id: string) => void
): Record<string, JSX.Element> => {
    return {
        select: (
            <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
            />
        ),

        provider: (
            <span className="text-black dark:text-brand-25">
                {item.provider_name}
            </span>
        ),


        wallet_type: (
            <span className="text-black dark:text-brand-25">
                {item.wallet_type}
            </span>
        ),


        fx_type: (
            <span className="text-black dark:text-brand-25">
                {item.fx_type}
            </span>
        ),


        status: (
            <Badge color={item.virtual_wallet === 'active' ? "success" : "error"}>
                {item.virtual_wallet}
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
    provider_name: string;
    currency: {
        name: string;
        _id: string;
    }[];
    wallet_type: string;
    virtual_wallet: string;
    fx_type: string;
}