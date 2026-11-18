# Assignment 1

You will only need one file, ie, your node module, for this assignment.

In this readme file, describe how to use your node module. It could be similar to **app.js** from Lab2, where you call some functions in your node module and display the output. Describe how to setup your node module, if any. Describe how to call the functions, what parameters required and so on.

You can press **Ctrl+Shift+V** in this file in Visual Studio Code to see a live preview of the readme file.

For some tips in formatting text in readme file, refer to https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax

# References
Provide the references that you have used to support your assignment. 

<!-- =================================================================================================== -->

# EGL301 Assignment 1 - AnimeStreamManager Node Module

## 1. Overview
`ZayarHtoo_AnimeStreamManager.js` is a custom Node.js module designed for an entertainment and digital media streaming web application modeled after **Crunchyroll**[cite: 2]. It simulates a backend management system using in-memory data arrays to handle user subscription tiers, paywall access verification, watch progress tracking, weekly simulcast schedules, user ratings, and personalized anime recommendations[cite: 2].

---

## 2. Setup & Installation

### Prerequisites
- Make sure [Node.js](https://nodejs.org/) is installed on your machine.
- No external npm packages or third-party dependencies are required; the module runs entirely on native JavaScript/Node.js.

### Setup Instructions
1. Clone or download this repository to your local machine.
2. Place `ZayarHtoo_AnimeStreamManager.js` in your project directory[cite: 2].
3. Import the module into your main application file (e.g., `app.js`) using `require()`:

```javascript
const streamManager = require('./ZayarHtoo_AnimeStreamManager.js');
```

---

## 3. Function Reference & Parameters

### 1. `checkStreamAccess(userId, animeId)`
Verifies whether a user's current subscription tier (`Free`, `Fan`, or `Mega Fan`) meets the minimum requirement to stream a specific anime title.
* **Parameters:**
  * `userId` *(string)*: The unique ID of the user (e.g., `"USR01"`, `"USR02"`).
  * `animeId` *(string)*: The unique ID of the anime (e.g., `"ANI001"`, `"ANI005"`).
* **Returns:** *(Object)* Contains `success`, `accessGranted`, `message`, and `adFree` status.

### 2. `logWatchProgress(userId, animeId, episodeNumber)`
Checks if the user has stream access and validates the episode number against the show's total episodes before updating the user's watch history.
* **Parameters:**
  * `userId` *(string)*: The unique ID of the user (e.g., `"USR01"`).
  * `animeId` *(string)*: The unique ID of the anime (e.g., `"ANI003"`).
  * `episodeNumber` *(number)*: The episode number watched (must be between `1` and the anime's `totalEpisodes`).
* **Returns:** *(Object)* Contains `success`, a status `message` (with remaining episodes), and the updated `watchHistory` array.

### 3. `updateSubscriptionTier(userId, newTier, billingMonths)`
Upgrades or changes a user's subscription tier and calculates the total billing cost, applying automatic promotional discounts (10% off for 6+ months, 15% off for 12+ months).
* **Parameters:**
  * `userId` *(string)*: The unique ID of the user (e.g., `"USR02"`).
  * `newTier` *(string)*: The target subscription tier (`"Free"`, `"Fan"`, or `"Mega Fan"`).
  * `billingMonths` *(number, optional)*: Number of months to bill for (defaults to `1`).
* **Returns:** *(Object)* Billing summary including `previousTier`, `newTier`, `discountApplied`, `totalAmountDue`, and plan `benefits`.

### 4. `getSimulcastSchedule(dayOfWeek, genreFilter)`
Retrieves the weekly simulcast anime lineup filtered by release day and an optional genre.
* **Parameters:**
  * `dayOfWeek` *(string)*: The broadcast day (e.g., `"Saturday"`, `"Sunday"`, `"Tuesday"`).
  * `genreFilter` *(string, optional)*: Genre to filter by (e.g., `"Action"`, `"Fantasy"`). Defaults to `null` (all genres).
* **Returns:** *(Object)* Contains matching show `count` and an array of `shows`.

### 5. `rateAnime(userId, animeId, ratingScore)`
Submits a user rating for an anime title and dynamically recalculates its new average rating.
* **Parameters:**
  * `userId` *(string)*: The unique ID of the user (e.g., `"USR03"`).
  * `animeId` *(string)*: The unique ID of the anime (e.g., `"ANI002"`).
  * `ratingScore` *(number)*: A rating score between `1` and `5`.
* **Returns:** *(Object)* Contains confirmation `message`, `totalRatings`, and `newAverageRating`.

### 6. `getRecommendationsForUser(userId)`
Analyzes the genres from a user's watch history and recommends unwatched anime titles that share those genres.
* **Parameters:**
  * `userId` *(string)*: The unique ID of the user (e.g., `"USR01"`).
* **Returns:** *(Object)* Contains `basedOnGenres` and an array of `recommendedShows` with their average ratings.

---

## 4. Usage Example (Calling the Module like `app.js`)

Below is an example of how to call each function in `ZayarHtoo_AnimeStreamManager.js` and display the output in the console:

```javascript
const streamManager = require('./ZayarHtoo_AnimeStreamManager.js');

// 1. Check Stream Access (Paywall Verification)
console.log("--- 1. Check Stream Access ---");
console.log(streamManager.checkStreamAccess("USR01", "ANI005"));
console.log(streamManager.checkStreamAccess("USR02", "ANI002"));

// 2. Log Watch Progress
console.log("\n--- 2. Log Watch Progress ---");
console.log(streamManager.logWatchProgress("USR01", "ANI003", 15));

// 3. Update Subscription Tier & Calculate Billing
console.log("\n--- 3. Update Subscription Tier ---");
console.log(streamManager.updateSubscriptionTier("USR02", "Mega Fan", 12));

// 4. Get Weekly Simulcast Schedule
console.log("\n--- 4. Get Simulcast Schedule ---");
console.log(streamManager.getSimulcastSchedule("Sunday", "Action"));

// 5. Rate an Anime
console.log("\n--- 5. Rate Anime ---");
console.log(streamManager.rateAnime("USR03", "ANI002", 5));

// 6. Get Personalized Recommendations
console.log("\n--- 6. Get User Recommendations ---");
console.log(streamManager.getRecommendationsForUser("USR01"));
```

### Expected Console Output
```text
--- 1. Check Stream Access ---
{
  success: true,
  accessGranted: true,
  message: 'Access granted! Zayar (Mega Fan) can stream "Blue Lock".',
  adFree: true
}
{
  success: true,
  accessGranted: false,
  message: 'Access denied. "Solo Leveling" requires at least the \'Fan\' tier. Your current tier is \'Free\'.'
}

--- 2. Log Watch Progress ---
{
  success: true,
  message: 'Updated progress for Zayar: Watched Episode 15 of "Shangri-La Frontier". (35 episodes remaining).',
  watchHistory: [
    { animeId: 'ANI001', episodeWatched: 1122 },
    { animeId: 'ANI002', episodeWatched: 24 },
    { animeId: 'ANI003', episodeWatched: 15 }
  ]
}

--- 3. Update Subscription Tier ---
{
  success: true,
  username: 'AlexTan',
  previousTier: 'Free',
  newTier: 'Mega Fan',
  billingMonths: 12,
  discountApplied: '15% ($17.98)',
  totalAmountDue: '$101.90',
  benefits: { monthlyPrice: 9.99, maxStreams: 4, adFree: true, offlineViewing: true }
}

--- 4. Get Simulcast Schedule ---
{
  success: true,
  day: 'Sunday',
  genreFilter: 'Action',
  count: 2,
  shows: [
    { id: 'ANI001', title: 'One Piece', genre: [ 'Action', 'Adventure', 'Fantasy' ], requiredTier: 'Free' },
    { id: 'ANI003', title: 'Shangri-La Frontier', genre: [ 'Action', 'Sci-Fi', 'Gaming' ], requiredTier: 'Fan' }
  ]
}

--- 5. Rate Anime ---
{
  success: true,
  message: 'SarahLim rated "Solo Leveling" 5/5 stars.',
  animeTitle: 'Solo Leveling',
  totalRatings: 6,
  newAverageRating: 4.83
}

--- 6. Get User Recommendations ---
{
  success: true,
  username: 'Zayar',
  basedOnGenres: [ 'Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Gaming' ],
  recommendedShows: [
    {
      id: 'ANI004',
      title: 'Black Clover',
      genre: [ 'Action', 'Magic', 'Fantasy' ],
      averageRating: 4.5,
      requiredTier: 'Free'
    }
  ]
}
```

---

## 5. Declaration of Use of AI
In accordance with the EGL301 Scope of Use of AI guidelines, AI tools were used strictly for[cite: 1, 3]:
- Generating ideas for the application concept and feature set[cite: 1].
- Generating mock data and mock schema required for the node module (`subscriptionPlans`, `animeCatalog`, and `users` arrays)[cite: 1].

---

## 6. References
- **Crunchyroll Web Application:** [https://www.crunchyroll.com](https://www.crunchyroll.com)[cite: 2, 3]
- **Crunchyroll Subscription Tiers Reference:** [https://www.crunchyroll.com/premium](https://www.crunchyroll.com/premium)[cite: 2, 3]