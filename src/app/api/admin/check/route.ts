import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('admins');
    
    const adminCount = await collection.countDocuments();
    
    return NextResponse.json({ 
      hasAdmin: adminCount > 0,
      count: adminCount 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check admin' }, { status: 500 });
  }
}