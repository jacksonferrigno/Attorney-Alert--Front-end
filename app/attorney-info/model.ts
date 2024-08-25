import mongoose, { Schema, Document } from 'mongoose';

export interface IAttorney extends Document {
  firstName: string;
  lastName: string;
  practiceName: string;
  barNumber: string;
  email: string;
  phoneNumber: string;
  consent: boolean;
}

const AttorneySchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  practiceName: { type: String, required: true },
  barNumber: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  consent: { type: Boolean, required: true },
});

export const Attorney = mongoose.model<IAttorney>('Attorney', AttorneySchema, 'users');
