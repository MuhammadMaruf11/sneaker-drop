import { expireReservations } from "../modules/reservation/reservation.service";

const INTERVAL_MS = 5000; // every 5 seconds

export function startExpiryJob() {
  console.log("⏰ Expiry job started (runs every 5s)");

  const run = async () => {
    try {
      const expired = await expireReservations();
      if (expired.length > 0) {
        console.log(`✅ Expired ${expired.length} reservation(s)`);
      }
    } catch (err) {
      console.error("Expiry job error:", err);
    }
  };

  // Run immediately on startup, then every 5s
  run();
  setInterval(run, INTERVAL_MS);
}
