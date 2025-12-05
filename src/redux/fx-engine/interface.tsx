import { JSX } from "react"
import { Column, BadgeColorType } from "../app/interface"
import Badge from "../../components/ui/badge/Badge"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"

export interface IFxEngineState {
    loading: boolean
    error: null | unknown
    success: boolean
    fxEngines: IFxEngine[] | null
    pagination: any | null
    singleFxEngine: IFxEngine | null
}


export interface IFxEngine {
    _id: string;

    source_country: string;
    destination_country: string;

    rate: number;
    promo_rate: number;

    volume: {
        min: number;
        max: number;
        rate: number;
        _id: string;
    }[];

    operation_type: "multiply" | "divide" | string;

    fx_fees: {
        min: number;
        max: number;
        fees: number;
        _id: string;
    }[];

    fx_provider: string;
    status: boolean;

    createdAt: string;
    updatedAt: string;
}


export const columns: Column[] = [
    { key: "select", label: "#" },
    { key: "source_country", label: "From" },
    { key: "destination_country", label: "To" },
    { key: "rate", label: "Rate" },
    { key: "promo_rate", label: "Promo Rate" },
    { key: "operation_type", label: "Operation Type" },
    { key: "status", label: "Status" },
    { key: "fx_provider", label: "Provider" },
    { key: "action", label: "" },
];


export const renderColumn = (
    item: IFxEngine,
    selected: string[],
    toggleSelect: (id: string) => void,
    openModal: (item: IFxEngine) => void,

    toggleDropdown: (id: string) => void,
    openDropdown: string | null,
    handleView: (item: IFxEngine) => void,
    handleEdit: (item: IFxEngine) => void,
    handleDelete: (id: string) => void
): Record<string, JSX.Element> => {

    return {
        select: (
            <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
            />
        ),
        source_country: (
            <span className="text-black dark:text-brand-25">
                {item.source_country}
            </span>
        ),

        destination_country: (
            <span className="text-black dark:text-brand-25">
                {item.destination_country}
            </span>
        ),

        rate: (
            <span className="text-black dark:text-brand-25">
                {item.rate}
            </span>
        ),
        promo_rate: (
            <span className="text-black dark:text-brand-25">
                {item.promo_rate}
            </span>
        ),

        operation_type: (
            <span className="text-black dark:text-brand-25">
                {item.operation_type}
            </span>
        ),

        status: (
            <Badge color={item.status ? "success" : "error"}>
                {item.status ? "Active" : "Inactive"}
            </Badge>
        ),

        fx_provider: (
            <span className="text-black dark:text-brand-25">
                {item.fx_provider}
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
                    <MoreDotIcon className="text-gray-700 dark:text-gray-400"/>
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



    };
};

export interface IFormData {
    source_country: string;
    destination_country: string;
    rate: number;
    promo_rate: number;
    operation_type: "multiply" | "divide" | string;
    volume: {
        min: number;
        max: number;
        rate: number;
    }[];
    fx_fees: {
        min: number;
        max: number;
        fees: number;
    }[];
    fx_provider: string;
    status: boolean;
}