Here is your **final, production-ready MongoDB schema design** with hybrid referencing for `searchHistory`, ready to implement using **Mongoose** in your **Next.js app backend**.

---

## ✅ Final Mongoose Models (6 Models + Cap Logic)

---

### 📄 1. `User.js`

```ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  loggingEnabled: { type: Boolean, default: false },
  searchHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SearchLog'
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

---

### 🔍 2. `SearchLog.js`

```ts
import mongoose from 'mongoose';

const SearchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed },
  isAnonymous: { type: Boolean, default: false },
  formatUsed: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SearchLog || mongoose.model('SearchLog', SearchLogSchema);
```

---

### 🧠 3. `AnonymisedQuery.js`

```ts
import mongoose from 'mongoose';

const AnonymisedQuerySchema = new mongoose.Schema({
  searchLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'SearchLog', required: true },
  emailOrPhone: String,
  keywords: [String],
  price: { type: Number, default: 0.005 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AnonymisedQuery || mongoose.model('AnonymisedQuery', AnonymisedQuerySchema);
```

---

### 💳 4. `PaymentRecord.js`

```ts
import mongoose from 'mongoose';

const PaymentRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  searchLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'SearchLog' },
  stripePaymentId: String,
  amount: Number,
  currency: { type: String, default: 'usd' },
  status: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.PaymentRecord || mongoose.model('PaymentRecord', PaymentRecordSchema);
```

---

### 📁 5. `DownloadRequest.js`

```ts
import mongoose from 'mongoose';

const DownloadRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  searchLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'SearchLog' },
  format: { type: String, enum: ['CSV', 'PDF', 'DOCX', 'JSON'] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DownloadRequest || mongoose.model('DownloadRequest', DownloadRequestSchema);
```

---

### 🔗 6. `SharedLink.js`

```ts
import mongoose from 'mongoose';

const SharedLinkSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  searchLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'SearchLog' },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SharedLink || mongoose.model('SharedLink', SharedLinkSchema);
```

---

## 🔁 🔧 Logic to Cap `searchHistory` in `User`

```ts
// Add searchLogId to User.searchHistory with max length (e.g. 50)
export async function addToSearchHistory(userId, searchLogId, cap = 50) {
  await User.findByIdAndUpdate(userId, {
    $push: {
      searchHistory: {
        $each: [searchLogId],
        $position: 0,
        $slice: cap
      }
    }
  });
}
```

---

## ✅ Final Notes

| Feature               | Supported Via                               |
| --------------------- | ------------------------------------------- |
| Opt-in Logging        | `User.loggingEnabled` + condition in API    |
| Search History        | `User.searchHistory[]` (ref to `SearchLog`) |
| All Logs Query        | `SearchLog.userId` for full DB-level access |
| Anonymized Access     | `AnonymisedQuery` linked to `SearchLog`     |
| Download Tracking     | `DownloadRequest`                           |
| Sharing System        | `SharedLink` with `slug`                    |
| Monetization (Stripe) | `PaymentRecord`                             |

---

You're ready to plug this into your Next.js API routes (e.g. `/api/search`, `/api/logs`, etc.).

Would you like a diagram (PNG/SVG) of this schema for documentation or pitch decks?
