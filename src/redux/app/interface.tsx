export interface IUser {
  name: string
  email: string
  userType: string
  business_name: string
  loginHistory: ILoggedInSessions[]
  user_img: string
  onboarding: IOnboarding
  is_onboarding: boolean
  currency: string
  country_id: ICurrencies
  phoneNumber: string
  address: string
  _id: string
  fireblocksVaultId: string
}

export interface ICurrencies {
  _id: string
  country: string
  flag_img: string
  currencyCode: string
  status: number
  country_code: string
  currencyName: string
  id: number
  digit_wallet: string[]
  volume_range: IVolumeRange[]
  symbol: string
  languages: string[]
}

export interface IVolumeRange {
  max: number
  min: number
  _id: string
}

export interface IOnboarding {
  isBusinessAddressVerified: boolean
  isBusinessDetailsVerified: boolean
  isCorporateStructureVerified: boolean
  isNatureOfBusinessVerified: boolean
  isOtherResourcesVerified: boolean
  isPersonalIDsVerified: boolean
  isBusinessAddressCompleted: boolean
  isBusinessDetailsCompleted: boolean
  isCorporateStructureCompleted: boolean
  isNatureOfBusinessCompleted: boolean
  isOtherResourcesCompleted: boolean
  isPersonalIDsCompleted: boolean
  isPersonalDetailsCompleted: boolean
  isPersonalDetailsVerified: boolean
}

export interface ILoggedInSessions {
  isActive: boolean
  device: string
  loginAt: string
  location: string
  _id: string
  token: string
}

export interface IBanksList {
  beneficiary_account_type: {
    business: Record<string, string[]>
    personal: Record<string, string[]>
  }
  banks: { [key: string]: string }
}

export interface ITableInput {
  page?: number
  limit?: number
  search?: string
}

export interface IFees {
  fees: number
  max: number
  min: number
}



export interface Column {
    key: string;
    label: string;
}

export type BadgeColorType =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";



  export interface ICountry {
  _id: string;
  id: number;
  currencyName: string;
  currencyCode: string;
  symbol: string;
  country: string;
  country_code: string;
  flag_img: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  volume_range: IVolumeRange[];
  verify_provider: string;
  languages: string[];
}

export interface IVolumeRange {
  min: number;
  max: number;
  _id: string;
}


export interface IBeneficiary {
  _id: string;
  userId: string;
  beneficiary_type: string;
  country: string;
  bank_name: string;
  bank_code: string;
  extra_fields: IExtraFields;
  createdAt: string;
  updatedAt: string;
}

export interface IExtraFields {
  business_name?: string;
  account_number?: string;
  bsb_code?: string;
}


export interface IPaymentMethod {
  _id: string;
  name: string;
  transferTime: string;
  senderCountry: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface IAppState {
    loading: boolean
    error: null | unknown
    success: boolean
    data: IDashboardCount | null
}
export interface IDashboardCount {
  users: {
    new: number;
    verified: number;
    unverified: number;
  };
  transactions: {
    total: number;
    success: number;
    pending: number;
    failed: number;
  };
}

export interface IDashboardCountQuery {
  nDays?: number;
}