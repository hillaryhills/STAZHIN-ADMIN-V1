import { JSX } from "react"
import { Column } from "../app/interface"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"
import Avatar from "../../components/ui/avatar/Avatar"
import { formatDateTime } from "../../utils/fn";
import { Dropdown } from "../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem"
import { LogOut  } from "lucide-react";

export interface IUserState {
  loading: boolean
  error: null | unknown
  success: boolean
  users: IUser[] | null
  pagination: IPagination | null
  singleUser: ISingleUser | null
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export interface IUser {
  _id: string;
  member_id: string;
  userType: string;
  email: string;
  currency: string;
  business_name?: string;
  name?: string;

  is_email_verified: boolean;
  is_email_sent: boolean;

  email_verification_token: string | null;
  email_token_expiry: string | null;

  otp: string | null;
  otp_expiry: string | null;

  user_img: string | null;

  is_onboarding: boolean;
  is_doc_verified: boolean;
  is_verified: number; // 0 or 1
  is_account_active: boolean;

  login_verification_expiry: string | null;

  live_id_verification_session_id?: string;

  payto: IPayTo;

  loginHistory: ILoginHistory[];

  createdAt: string;
  updatedAt: string;

  id: string; // duplicate of _id in the API
}

export interface IPayTo {
  provider: string;
  status: string;
  _id: string;
}

export interface ILoginHistory {
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;

  isActive: boolean;
  token: string;

  loginAt: string | Date;
  _id: string;
  id: string;
}


export interface IUserData {
  data: IUser[]
}


export const columns: Column[] = [
  { key: "select", label: "" },
  { key: "user_img", label: "Image" },
  { key: "member_id", label: "Member Id" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "userType", label: "Account Type" },
  { key: "createdAt", label: "Created At" },
  { key: "action", label: "" },

];


export const renderColumn = (
  item: IUser,
  selected: string[],
  toggleSelect: (id: string) => void,
  navigate: (path: string) => void,
  handleDelete: (id: string) => void,
  toggleDropdown: (id: string | null) => void,
  openDropdown: string | null,


): Record<string, JSX.Element> => {

  const fallbackImage = "/stazhin-img/user.png";
  const name = item.business_name || item.name;

  return {
    select: (
      <Checkbox
        checked={selected.includes(item._id)}
        onChange={() => toggleSelect(item._id)}
      />
    ),

    user_img: (

      <Avatar
        src={item.user_img || fallbackImage}
        alt="User"
        size="medium"
        status={item.is_account_active ? 'online' : 'offline'}
      />
    ),

    member_id: (
      <span className="text-black dark:text-brand-25">
        {item.member_id}
      </span>
    ),

    name: (
      <span className="text-black dark:text-brand-25 font-medium">
        {name}
      </span>
    ),

    email: (
      <span className="text-black dark:text-brand-25">
        {item.email}
      </span>
    ),

    userType: (
      <span className="capitalize text-black dark:text-brand-25">
        {item.userType}
      </span>
    ),

    createdAt: (
      <span className="text-black dark:text-brand-25">
        {new Date(item.createdAt).toLocaleString()}
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
          <DropdownItem onClick={() => navigate(`/user/${item._id}`)} className="text-gray-700 dark:text-gray-400">
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
  };
};



export interface ISingleUser {
  _id: string;
  userType: string;
  email: string;
  currency: string;
  business_name: string;
  is_email_verified: boolean;
  is_email_sent: boolean;
  email_verification_token: string | null;
  email_token_expiry: string | null;
  otp: string | null;
  otp_expiry: string | null;
  user_img: string | null;
  is_deleted: boolean;
  deleteRequestedAt: string | null;
  login_verification_token: string | null;
  login_verification_expiry: string | null;
  loginHistory: ILoginHistory[];
  createdAt: string;
  updatedAt: string;
  is_onboarding: boolean;
  beneficiaries: string[];
  beneficiaryCount: number;
}


export const loginColumns = [
  { key: "device", label: "Device" },
  { key: "ip", label: "IP" },
  { key: "location", label: "Location" },
  { key: "loginAt", label: "Login Time" },
  { key: "isActive", label: "Status" },
  { key: "action", label: "Action" },

];


export const renderLoginColumn = (
  item: ILoginHistory,
  handleLogoutSession: (id: string) => void,
): Record<string, JSX.Element> => {
  return {
    device: (
      <span className="text-black dark:text-brand-25">
        {item.device}
      </span>
    ),
    ip: (
      <span className="text-black dark:text-brand-25">
        {item.ip}
      </span>
    ),
    location: (
      <span className="text-black dark:text-brand-25">
        {item.location}
      </span>
    ),
    loginAt: (
      <span className="text-black dark:text-brand-25">
        {formatDateTime(item.loginAt)}
      </span>
    ),
    isActive: (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${item.isActive
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
      >
        {item.isActive ? "Active" : "Inactive"}
      </span>
    ),
    action: (
      <div
        onClick={() => handleLogoutSession(item._id)}
        className="text-red-600  cursor-pointer"
      >
        <LogOut  />
      </div>
    )

  };
};
