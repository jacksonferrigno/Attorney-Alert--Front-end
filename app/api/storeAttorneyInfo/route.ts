import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Attorney } from '../../attorney-info/model';

export const runtime = 'nodejs'; // Use this instead of the deprecated config

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, practiceName, barNumber, email, phoneNumber, consent } = body;

  if (!firstName || !lastName || !practiceName || !barNumber || !email || !phoneNumber || !consent) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect('mongodb://localhost:27017/loginApp'); 
    }

    // Store attorney information in the 'users' collection
    const attorney = new Attorney({
      firstName,
      lastName,
      practiceName,
      barNumber,
      email,
      phoneNumber,
      consent,
    });

    await attorney.save();

    return NextResponse.json({ success: true, message: "Attorney information stored successfully" });
  } catch (error) {
    console.error('Error storing attorney information:', error);
    return NextResponse.json({ error: "An error occurred while storing attorney information" }, { status: 500 });
  }
}
