import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { JobModel } from '@/models/JobModel';

export async function POST(request: NextRequest) {
  try {
    const { title, company, location, description, salaryRange } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const newJob = {
      title,
      company,
      location,
      description,
      salaryRange,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newJob);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add job' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const jobs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}