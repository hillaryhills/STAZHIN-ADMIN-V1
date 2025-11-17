import CustomToast from '../components/ui/customToast'
import { toast } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning'

export const showToast = (type: ToastType, message: string, title?: string, autoClose: boolean = true) => {
  toast(<CustomToast type={type} title={title || type.charAt(0).toUpperCase() + type.slice(1)} message={message} />, {
    autoClose: autoClose ? 3000 : false,
  })
}
