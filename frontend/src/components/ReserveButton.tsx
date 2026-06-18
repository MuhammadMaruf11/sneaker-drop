type ReserveButtonProps = {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  soldOut?: boolean;
};

export function ReserveButton({
  onClick,
  loading,
  disabled,
  soldOut,
}: ReserveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled || soldOut}
      className={`w-full py-2.5 px-4 text-sm font-semibold uppercase tracking-wide
        transition-all duration-150 active:scale-95
        ${soldOut
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : loading || disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Reserving…
        </span>
      ) : soldOut ? "Sold Out" : "Reserve Now"}
    </button>
  );
}

export default ReserveButton;
