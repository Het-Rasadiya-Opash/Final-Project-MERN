import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
}

const AlertModal = ({ isOpen, onClose, title, message, type = 'error' }: AlertModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      default: return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600';
      case 'warning': return 'bg-yellow-500 border-yellow-600';
      default: return 'bg-red-500 border-red-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white border-l-4 ${getColors()} max-w-sm`}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs opacity-90">{message}</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default AlertModal;