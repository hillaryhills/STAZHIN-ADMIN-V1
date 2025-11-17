export interface IAuthState {
  loading: boolean
  error: null | unknown
  success: boolean
  forgotPasswordData: IForgotPassword | null
}

export interface IRegisterInput {
  userType: string
  name?: string
  email: string
  currency: string
  password: string
  business_name?: string
  digit_field?: Record<string, string>
}

export interface ILoginInput {
  email: string
  password: string
}

export interface IEmailInput {
  email: string
}

export interface IForgotPassword {
  email: string
  otp: string
}

export interface IResetPasswordInput {
  email: string
  newPassword: string
  confirmPassword: string
}

export interface IAcceptTeamInviteInput {
  token: string
  userId: string
  password: string
  name: string
}
