import { toast } from 'sonner'

interface ToastOptions {
  title?: string
  description?: string
  duration?: number
}

export function toastError(options: ToastOptions | string): void {
  if (typeof options === 'string') {
    toast.error(options)
    return
  }
  const { title, description, duration } = options
  toast.error(title || description || 'Error', {
    description,
    duration,
  })
}

export function toastSuccess(options: ToastOptions | string): void {
  if (typeof options === 'string') {
    toast.success(options)
    return
  }
  const { title, description, duration } = options
  toast.success(title || description || 'Success', {
    description,
    duration,
  })
}


