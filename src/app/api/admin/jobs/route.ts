import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Job } from '@/models/Job';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, companyName, location, jobDescription, salaryRange } = await request.json();
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const newJob: Omit<Job, '_id'> = {
      jobTitle,
      companyName,
      location,
      jobDescription,
      salaryRange,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(newJob);
    
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Admin jobs API error:', error);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const jobs = await collection.find({}).toArray();
    
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db('jeetable');
    const collection = db.collection('jobs');
    
    const { ObjectId } = require('mongodb');
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}