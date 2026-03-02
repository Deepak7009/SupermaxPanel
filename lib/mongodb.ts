import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://deepakkumar01:D5EjHLOASrzQvfxD@cluster0.pmwcpo2.mongodb.net/';
if (!MONGO_URI) throw new Error('Please define MONGO_URI in .env');

let conn: typeof mongoose | null = null;
let promise: Promise<typeof mongoose> | null = null;

export default async function connectToDatabase() {
  if (conn) {
    console.log('✅ Using cached MongoDB connection');
    return conn;
  }

  if (!promise) {
    console.log('🔌 Creating new MongoDB connection...');
    promise = mongoose.connect(MONGO_URI).then((mongooseInstance) => {
      console.log('✅ MongoDB connected');
      return mongooseInstance;
    });
  }

  conn = await promise;
  return conn;
}
