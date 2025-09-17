interface Props {
  type?: 'button' | 'submit';
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;  // Allow custom classes
}

const Button: React.FC<Props> = ({ type = 'button', loading = false, children, onClick, className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50 ${className}`}
    >
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
