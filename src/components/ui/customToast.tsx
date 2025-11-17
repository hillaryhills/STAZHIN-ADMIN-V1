import {
  CloseIcon,
  CheckCircleIcon,
  InfoIcon
} from '../../icons'

type ToastType = 'success' | 'error' | 'info' | 'warning'

const icons: Record<ToastType, React.JSX.Element> = {
  success: <CheckCircleIcon className="text-green-500 mt-0.5" />,
  error: <InfoIcon className="text-red-500 mt-0.5" />,
  info: <InfoIcon className="text-blue-500 mt-0.5" />,
  warning: <InfoIcon className="text-yellow-500 mt-0.5" />,
}

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-300',
  error: 'bg-red-50 border-red-300',
  info: 'bg-blue-50 border-blue-300',
  warning: 'bg-yellow-50 border-yellow-300',
}

export default function CustomToast({
  type,
  title,
  message,
  closeToast,
}: {
  type: ToastType
  title: string
  message: string
  closeToast?: () => void
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm  ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <p className="body2-semibold text-gray-800">{title}</p>
        <p className="text-gray-600 body2">{message}</p>
      </div>
      <CloseIcon className="cursor-pointer" onClick={closeToast} />
    </div>
  )
}
