import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  whatIDid: { type: String, required: true },
  whatIAvoided: { type: String, default: '' },
  energyLevel: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

journalSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Journal', journalSchema);
