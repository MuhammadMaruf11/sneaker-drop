type StockBadgeProps = {
  availableStock: number;
  total: number;
};

export function StockBadge({ availableStock, total }: StockBadgeProps) {
  const isSoldOut = availableStock === 0;
  const isLow = availableStock <= 3 && availableStock > 0;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
        ${isSoldOut ? "bg-red-100 text-red-700" : isLow ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isSoldOut ? "bg-red-500" : isLow ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}
      />
      {isSoldOut ? "Sold Out" : `${availableStock} / ${total} left`}
    </span>
  );
}

export default StockBadge;
