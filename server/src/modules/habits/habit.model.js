import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  completedDates: [{ type: Date }],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

habitSchema.index({ userId: 1 });

export default mongoose.model('Habit', habitSchema);
