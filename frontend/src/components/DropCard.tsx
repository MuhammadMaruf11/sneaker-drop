import { useReservation } from "../hooks/useReservation";
import { useUserStore } from "../store/userStore";
import type { Drop } from "../store/dropStore";
import { StockBadge } from "./StockBadge";
import { Timer } from "./Timer";
import { ReserveButton } from "./ReserveButton";
import { toast } from "./Toast";
import { useEffect } from "react";

type DropCardProps = {
  drop: Drop;
};

export function DropCard({ drop }: DropCardProps) {
  const currentUser = useUserStore((s) => s.currentUser);
  const {
    reservation,
    isReserving,
    isPurchasing,
    purchased,
    error,
    reserve,
    completePurchase,
    clearError,
    clearReservation,
  } = useReservation();

  // Show errors as toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleReserve = () => reserve(drop.id);
  const isSoldOut = drop.availableStock === 0;

  return (
    <div className="bg-white border border-gray-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Stock badge top-right */}
      <div className="relative bg-gray-50 px-4 pt-4 pb-3">
        <div className="absolute top-3 right-3">
          <StockBadge availableStock={drop.availableStock} total={drop.totalStock} />
        </div>
        <h3 className="font-semibold text-gray-900 text-base pr-24 leading-snug">
          {drop.name}
        </h3>
        {/* Stock bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700
                ${isSoldOut ? "bg-red-400" : drop.availableStock <= 3 ? "bg-amber-400" : "bg-green-500"}`}
              style={{ width: `${(drop.availableStock / drop.totalStock) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Recent Buyers — Activity Feed */}
        {drop.recentBuyers.length > 0 && (
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium mb-1.5">
              Recent Buyers
            </p>
            <div className="flex flex-col gap-1">
              {drop.recentBuyers.map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                    {b.username[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800">{b.username}</span>
                  <span className="text-gray-400">purchased</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action area */}
        <div className="mt-auto">
          {purchased ? (
            <div className="w-full py-2.5 text-center bg-green-50 text-green-700 text-sm font-semibold border border-green-200">
              ✓ Purchase Complete!
            </div>
          ) : reservation ? (
            <div className="flex flex-col gap-2">
              <Timer
                expiresAt={reservation.expiresAt}
                onExpire={() => {
                  clearReservation();
                  toast.error("Reservation expired. Try again!");
                }}
              />
              <button
                onClick={completePurchase}
                disabled={isPurchasing}
                className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold
                           uppercase tracking-wide hover:bg-green-700 active:scale-95
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </span>
                ) : "Complete Purchase"}
              </button>
            </div>
          ) : (
            <ReserveButton
              onClick={handleReserve}
              loading={isReserving}
              soldOut={isSoldOut}
              disabled={!currentUser}
            />
          )}

          {!currentUser && !purchased && !reservation && (
            <p className="text-xs text-gray-400 text-center mt-1">
              Select a user above to reserve
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DropCard;
