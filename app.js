const streamManager = require('./ZayarHtoo_AnimeStreamManager.js');

console.log("=== 1. CHECK STREAM ACCESS (PAYWALL VERIFICATION) ===");
console.log(streamManager.checkStreamAccess("USR01", "ANI005")); // Mega Fan accessing Blue Lock -> Allowed
console.log(streamManager.checkStreamAccess("USR02", "ANI002")); // Free user accessing Solo Leveling -> Denied

console.log("\n=== 2. LOG WATCH PROGRESS ===");
console.log(streamManager.logWatchProgress("USR01", "ANI003", 15)); // Valid episode update
console.log(streamManager.logWatchProgress("USR01", "ANI002", 99)); // Invalid episode boundary check

console.log("\n=== 3. UPDATE SUBSCRIPTION TIER & BILLING ===");
console.log(streamManager.updateSubscriptionTier("USR02", "Mega Fan", 12)); // Upgrade Free -> Mega Fan with 15% annual discount

console.log("\n=== 4. GET WEEKLY SIMULCAST SCHEDULE ===");
console.log(streamManager.getSimulcastSchedule("Sunday", "Action"));

console.log("\n=== 5. RATE ANIME & RECALCULATE AVERAGE ===");
console.log(streamManager.rateAnime("USR03", "ANI002", 5));

console.log("\n=== 6. GET PERSONALIZED RECOMMENDATIONS ===");
console.log(streamManager.getRecommendationsForUser("USR01"));