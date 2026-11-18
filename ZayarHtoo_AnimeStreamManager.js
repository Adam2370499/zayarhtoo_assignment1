/**
 * EGL301 Assignment 1
 * Node Module: ZayarHtoo_AnimeStreamManager.js
 * Reference Web Application: Crunchyroll (https://www.crunchyroll.com)
 * Description: Manages anime streaming catalog, user subscription tiers, 
 * paywall access rights, watch history, and simulcast schedules.
 */

// ==========================================
// 1. MOCK DATABASE (In-Memory Arrays)
// ==========================================

const subscriptionPlans = {
    "Free": { monthlyPrice: 0.00, maxStreams: 1, adFree: false, offlineViewing: false },
    "Fan": { monthlyPrice: 7.99, maxStreams: 1, adFree: true, offlineViewing: false },
    "Mega Fan": { monthlyPrice: 9.99, maxStreams: 4, adFree: true, offlineViewing: true }
};

const animeCatalog = [
    {
        id: "ANI001",
        title: "One Piece",
        genre: ["Action", "Adventure", "Fantasy"],
        releaseDay: "Sunday",
        totalEpisodes: 1122,
        requiredTier: "Free",
        ratings: [5, 5, 4, 5, 5]
    },
    {
        id: "ANI002",
        title: "Solo Leveling",
        genre: ["Action", "Fantasy"],
        releaseDay: "Saturday",
        totalEpisodes: 24,
        requiredTier: "Fan",
        ratings: [5, 5, 5, 4, 5]
    },
    {
        id: "ANI003",
        title: "Shangri-La Frontier",
        genre: ["Action", "Sci-Fi", "Gaming"],
        releaseDay: "Sunday",
        totalEpisodes: 50,
        requiredTier: "Fan",
        ratings: [4, 5, 5, 4]
    },
    {
        id: "ANI004",
        title: "Black Clover",
        genre: ["Action", "Magic", "Fantasy"],
        releaseDay: "Tuesday",
        totalEpisodes: 170,
        requiredTier: "Free",
        ratings: [5, 4, 4, 5]
    },
    {
        id: "ANI005",
        title: "Blue Lock",
        genre: ["Sports", "Thriller"],
        releaseDay: "Saturday",
        totalEpisodes: 38,
        requiredTier: "Mega Fan",
        ratings: [4, 5, 4, 4, 5]
    }
];

const users = [
    {
        userId: "USR01",
        username: "Zayar",
        tier: "Mega Fan",
        activeSince: "2025-10-01",
        watchHistory: [
            { animeId: "ANI001", episodeWatched: 1122 },
            { animeId: "ANI002", episodeWatched: 24 }
        ]
    },
    {
        userId: "USR02",
        username: "AlexTan",
        tier: "Free",
        activeSince: "2026-01-15",
        watchHistory: [
            { animeId: "ANI004", episodeWatched: 45 }
        ]
    },
    {
        userId: "USR03",
        username: "SarahLim",
        tier: "Fan",
        activeSince: "2026-03-10",
        watchHistory: []
    }
];

// Helper mapping for tier hierarchy checks
const tierRank = {
    "Free": 1,
    "Fan": 2,
    "Mega Fan": 3
};

// ==========================================
// 2. CORE MODULE FUNCTIONS (6 Functions)
// ==========================================

/**
 * Function 1: Verify if a user's subscription tier grants access to a specific anime
 * (Simulates paywall access rights check)
 */
function checkStreamAccess(userId, animeId) {
    const user = users.find(u => u.userId === userId);
    const anime = animeCatalog.find(a => a.id === animeId);

    if (!user) return { success: false, message: `User ID ${userId} not found.` };
    if (!anime) return { success: false, message: `Anime ID ${animeId} not found.` };

    const userRank = tierRank[user.tier];
    const requiredRank = tierRank[anime.requiredTier];

    if (userRank >= requiredRank) {
        return {
            success: true,
            accessGranted: true,
            message: `Access granted! ${user.username} (${user.tier}) can stream "${anime.title}".`,
            adFree: subscriptionPlans[user.tier].adFree
        };
    } else {
        return {
            success: true,
            accessGranted: false,
            message: `Access denied. "${anime.title}" requires at least the '${anime.requiredTier}' tier. Your current tier is '${user.tier}'.`
        };
    }
}

/**
 * Function 2: Log watched episode progress for a user
 * (Validates episode bounds and updates or adds to watchHistory)
 */
function logWatchProgress(userId, animeId, episodeNumber) {
    const user = users.find(u => u.userId === userId);
    const anime = animeCatalog.find(a => a.id === animeId);

    if (!user) return { success: false, message: `User ID ${userId} not found.` };
    if (!anime) return { success: false, message: `Anime ID ${animeId} not found.` };

    // First verify if user has access to watch this title
    const access = checkStreamAccess(userId, animeId);
    if (!access.accessGranted) {
        return { success: false, message: `Cannot log progress: ${access.message}` };
    }

    if (episodeNumber < 1 || episodeNumber > anime.totalEpisodes) {
        return {
            success: false,
            message: `Invalid episode number (${episodeNumber}). "${anime.title}" has ${anime.totalEpisodes} episodes.`
        };
    }

    const existingRecord = user.watchHistory.find(h => h.animeId === animeId);
    if (existingRecord) {
        existingRecord.episodeWatched = episodeNumber;
    } else {
        user.watchHistory.push({ animeId: animeId, episodeWatched: episodeNumber });
    }

    const remaining = anime.totalEpisodes - episodeNumber;
    return {
        success: true,
        message: `Updated progress for ${user.username}: Watched Episode ${episodeNumber} of "${anime.title}". (${remaining} episodes remaining).`,
        watchHistory: user.watchHistory
    };
}

/**
 * Function 3: Upgrade or change a user's subscription tier and calculate billing with promo discounts
 * (Handles subscription tiers and billing cycles)
 */
function updateSubscriptionTier(userId, newTier, billingMonths = 1) {
    const user = users.find(u => u.userId === userId);
    if (!user) return { success: false, message: `User ID ${userId} not found.` };

    if (!subscriptionPlans[newTier]) {
        return {
            success: false,
            message: `Invalid tier "${newTier}". Available tiers: Free, Fan, Mega Fan.`
        };
    }

    if (billingMonths < 1) {
        return { success: false, message: "Billing cycle must be at least 1 month." };
    }

    const oldTier = user.tier;
    user.tier = newTier;

    const monthlyRate = subscriptionPlans[newTier].monthlyPrice;
    let baseTotal = monthlyRate * billingMonths;
    let discountRate = 0;

    // Apply realistic multi-month commitment discount (e.g., 15% off for 12-month annual plan)
    if (billingMonths >= 12) {
        discountRate = 0.15;
    } else if (billingMonths >= 6) {
        discountRate = 0.10;
    }

    const discountAmount = +(baseTotal * discountRate).toFixed(2);
    const finalBill = +(baseTotal - discountAmount).toFixed(2);

    return {
        success: true,
        username: user.username,
        previousTier: oldTier,
        newTier: user.tier,
        billingMonths: billingMonths,
        discountApplied: `${discountRate * 100}% ($${discountAmount.toFixed(2)})`,
        totalAmountDue: `$${finalBill.toFixed(2)}`,
        benefits: subscriptionPlans[newTier]
    };
}

/**
 * Function 4: Retrieve the weekly simulcast schedule by release day or genre
 * (Helps users track weekly simulcast drops)
 */
function getSimulcastSchedule(dayOfWeek, genreFilter = null) {
    if (!dayOfWeek) {
        return { success: false, message: "Please specify a day of the week (e.g., 'Saturday', 'Sunday')." };
    }

    let results = animeCatalog.filter(
        a => a.releaseDay.toLowerCase() === dayOfWeek.toLowerCase()
    );

    if (genreFilter) {
        results = results.filter(a =>
            a.genre.some(g => g.toLowerCase() === genreFilter.toLowerCase())
        );
    }

    return {
        success: true,
        day: dayOfWeek,
        genreFilter: genreFilter || "All Genres",
        count: results.length,
        shows: results.map(a => ({
            id: a.id,
            title: a.title,
            genre: a.genre,
            requiredTier: a.requiredTier
        }))
    };
}

/**
 * Function 5: Submit a user rating (1-5 stars) for an anime and compute its new average score
 */
function rateAnime(userId, animeId, ratingScore) {
    const user = users.find(u => u.userId === userId);
    const anime = animeCatalog.find(a => a.id === animeId);

    if (!user) return { success: false, message: `User ID ${userId} not found.` };
    if (!anime) return { success: false, message: `Anime ID ${animeId} not found.` };

    if (typeof ratingScore !== "number" || ratingScore < 1 || ratingScore > 5) {
        return { success: false, message: "Rating score must be a number between 1 and 5." };
    }

    anime.ratings.push(ratingScore);
    const sum = anime.ratings.reduce((acc, curr) => acc + curr, 0);
    const average = +(sum / anime.ratings.length).toFixed(2);

    return {
        success: true,
        message: `${user.username} rated "${anime.title}" ${ratingScore}/5 stars.`,
        animeTitle: anime.title,
        totalRatings: anime.ratings.length,
        newAverageRating: average
    };
}

/**
 * Function 6: Generate personalized anime recommendations based on a user's watched genres
 */
function getRecommendationsForUser(userId) {
    const user = users.find(u => u.userId === userId);
    if (!user) return { success: false, message: `User ID ${userId} not found.` };

    const watchedIds = user.watchHistory.map(h => h.animeId);

    // Collect favorite genres from user's watch history
    const favoriteGenres = new Set();
    watchedIds.forEach(id => {
        const anime = animeCatalog.find(a => a.id === id);
        if (anime) {
            anime.genre.forEach(g => favoriteGenres.add(g));
        }
    });

    // Find unwatched anime that match favorite genres (or top-rated if history is empty)
    let recommendations = animeCatalog.filter(a => !watchedIds.includes(a.id));

    if (favoriteGenres.size > 0) {
        recommendations = recommendations.filter(a =>
            a.genre.some(g => favoriteGenres.has(g))
        );
    }

    return {
        success: true,
        username: user.username,
        basedOnGenres: Array.from(favoriteGenres),
        recommendedShows: recommendations.map(a => {
            const avg = +(a.ratings.reduce((sum, r) => sum + r, 0) / a.ratings.length).toFixed(2);
            return {
                id: a.id,
                title: a.title,
                genre: a.genre,
                averageRating: avg,
                requiredTier: a.requiredTier
            };
        })
    };
}

// ==========================================
// 3. EXPORT MODULE
// ==========================================
module.exports = {
    checkStreamAccess,
    logWatchProgress,
    updateSubscriptionTier,
    getSimulcastSchedule,
    rateAnime,
    getRecommendationsForUser
};