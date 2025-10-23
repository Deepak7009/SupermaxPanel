import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admin from '@/app/admin/models/Admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const existing = await Admin.findOne({ email });
    if (existing)
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });

    const admin = new Admin({ email, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
