import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  priority: { type: Number, default: 0, min: 0, max: 3 },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  group: { type: String, enum: ['daily', 'weekly', 'longterm'], default: 'daily' },
  date: { type: Date, default: Date.now },
  completedAt: { type: Date },
  carriedForward: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

taskSchema.index({ userId: 1, date: -1 });
taskSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Task', taskSchema);
