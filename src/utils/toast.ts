import { ToastOptions, toast } from 'react-toastify';
import { ToastType } from '../types';

const options: ToastOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  theme: 'dark'
};

export default function sendToast(message: string, type: ToastType) {
  type === ToastType.Error ? toast.error(message, options) : toast.success(message, options);
}
