import mongoose from 'mongoose';

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  });

  const connection = mongoose.connection;
  connection.on('connected', () => console.log('Connected to MongoDB'));
  connection.on('error', (err) => console.error('MongoDB connection error:', err));
  connection.on('disconnected', () => console.warn('MongoDB disconnected'));

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
}



