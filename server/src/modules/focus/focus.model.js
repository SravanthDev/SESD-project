import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  type: { type: String, enum: ['pomodoro', 'deep-work'], default: 'pomodoro' },
  date: { type: Date, default: Date.now }
});

focusSessionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('FocusSession', focusSessionSchema);
