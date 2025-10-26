import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email regex (simplified version)
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please enter a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook to validate that the referenced Event exists
BookingSchema.pre('save', async function (next) {
  // Only validate eventId if it's new or modified
  if (this.isNew || this.isModified('eventId')) {
    try {
      const eventExists = await Event.findById(this.eventId);
      if (!eventExists) {
        return next(new Error(`Event with ID ${this.eventId} does not exist`));
      }
    } catch (error) {
      return next(new Error('Failed to validate event reference'));
    }
  }

  // Additional email format validation (redundant but ensures consistency)
  if (this.isNew || this.isModified('email')) {
    if (!this.email || this.email.trim().length === 0) {
      return next(new Error('Email cannot be empty'));
    }
  }

  next();
});

// Create compound index for eventId and email to prevent duplicate bookings
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Add index on eventId for faster event-based queries
BookingSchema.index({ eventId: 1 });

// Add index on createdAt for time-based queries
BookingSchema.index({ createdAt: -1 });

// Create and export the Booking model
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;