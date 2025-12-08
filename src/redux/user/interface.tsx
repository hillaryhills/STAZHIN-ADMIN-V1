import { JSX } from "react"
import { Column } from "../app/interface"
import Checkbox from "../../components/form/input/Checkbox"
import { MoreDotIcon } from "../../icons"
import Avatar from "../../components/ui/avatar/Avatar"


export interface IUserState {
  loading: boolean
  error: null | unknown
  success: boolean
  users: IUser[] | null
  pagination: IPagination | null
  singleUser: IUser | null
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

  loginAt?: string;
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
  navigate: (path: string) => void
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
      <span className="text-black dark:text-brand-25">
        <MoreDotIcon
          className="cursor-pointer"
          onClick={() => navigate(`/user/${item._id}`)}
        />
      </span>
    ),
  };
};
