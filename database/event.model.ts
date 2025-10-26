import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Event overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Event image is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Event venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Event mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, 'Target audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Event agenda is required'],
      validate: {
        validator: function (agenda: string[]) {
          return agenda && agenda.length > 0;
        },
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Event organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Event tags are required'],
      validate: {
        validator: function (tags: string[]) {
          return tags && tags.length > 0;
        },
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Pre-save hook for slug generation, date normalization, and validation
EventSchema.pre('save', function (next) {
  // Generate slug only if title is new or modified
  if (this.isNew || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  }

  // Normalize and validate date format (convert to ISO string if needed)
  if (this.isNew || this.isModified('date')) {
    try {
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        return next(new Error('Invalid date format'));
      }
      // Store as ISO string for consistency
      this.date = parsedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (error) {
      return next(new Error('Invalid date format'));
    }
  }

  // Normalize time format (ensure consistent HH:MM format)
  if (this.isNew || this.isModified('time')) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(this.time)) {
      return next(new Error('Time must be in HH:MM format (24-hour)'));
    }
  }

  // Validate that required array fields are not empty
  if (this.agenda.length === 0) {
    return next(new Error('Agenda cannot be empty'));
  }

  if (this.tags.length === 0) {
    return next(new Error('Tags cannot be empty'));
  }

  // Ensure all required string fields are not empty after trimming
  const requiredFields = ['title', 'description', 'overview', 'image', 'venue', 'location', 'organizer', 'audience'];
  for (const field of requiredFields) {
    if (!this[field as keyof IEvent] || (this[field as keyof IEvent] as string).trim().length === 0) {
      return next(new Error(`${field} cannot be empty`));
    }
  }

  next();
});

// Create unique index for slug
EventSchema.index({ slug: 1 }, { unique: true });

// Create and export the Event model
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;