import { JSX } from "react"
import { Column } from "../app/interface"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"



export interface IComplianceState {
    loading: boolean
    error: null | unknown
    success: boolean
    complianceRecords: ICompliance[] | null
    singleComplianceRecords: ICompliance | null
}

export interface IComplianceInfo {
    _id: string;
    accountPurpose: string[];
    fundInCountries: string[];
    fundInCcys: string[];
    expectedFundInVolPerMonth: string;
    fundOutCountries: string[];
    fundOutCcys: string[];
    expectedFundOutVolPerMonth: string;
}

export interface ICompliance {
    _id: string;
    accountType: string;
    complianceInfo: IComplianceInfo;
    createdAt: string;
    updatedAt: string;
}


export const columns: Column[] = [
    { key: "select", label: "#" },
    { key: "account_type", label: "Account Type" },
    { key: "funds_in", label: "Fund In Countries" },
    { key: "funds_out", label: "Fund Out Countries" },
    { key: "created_at", label: "Created At" },
    { key: "action", label: "" },
];



export const renderColumn = (
    item: ICompliance,
    selected: string[],
    toggleSelect: (id: string) => void,

    toggleDropdown: (id: string | null) => void,
    openDropdown: string | null,
    handleView: (item: ICompliance) => void,
    handleDelete: (id: string) => void
): Record<string, JSX.Element> => {
    return {
        select: (
            <Checkbox
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
            />
        ),

        account_type: (
            <span className="text-black dark:text-brand-25">
                {item.accountType}
            </span>
        ),

        funds_in: (
            <span className="text-black dark:text-brand-25">
                {item.complianceInfo.fundInCountries.join(", ")}
            </span>
        ),
        funds_out: (
            <span className="text-black dark:text-brand-25">
                {item.complianceInfo.fundOutCountries.join(", ")}
            </span>
        ),

        created_at: (
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
    accountType: string;
    complianceInfo: {
        accountPurpose: string[];
        fundInCountries: string[];
        fundInCcys: string[];
        expectedFundInVolPerMonth: string;
        fundOutCountries: string[];
        fundOutCcys: string[];
        expectedFundOutVolPerMonth: string;
    };
}

export interface IFormDataComplianceInfo {
    accountPurpose: string[];
    fundInCountries: string[];
    fundInCcys: string[];
    expectedFundInVolPerMonth: string;
    fundOutCountries: string[];
    fundOutCcys: string[];
    expectedFundOutVolPerMonth: string;
}