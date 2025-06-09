import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define review interface
interface ReviewSubmission {
  id: string;
  itemType: 'package' | 'activity';
  itemId: string;
  itemName: string;
  name: string;
  email: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  status: 'pending' | 'published' | 'rejected';
  verified: boolean;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    const itemType = formData.get('itemType') as string;
    const itemId = formData.get('itemId') as string;
    const itemName = formData.get('itemName') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const location = formData.get('location') as string;
    const rating = parseInt(formData.get('rating') as string);
    const title = formData.get('title') as string;
    const comment = formData.get('comment') as string;
    
    // Validate required fields
    if (!itemType || !itemId || !name || !email || !location || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process images if any
    const uploadedImages: string[] = [];
    const imageKeys = Array.from(formData.keys()).filter(key => key.startsWith('image_'));
    
    for (const key of imageKeys) {
      const file = formData.get(key) as File;
      if (!file) continue;
      
      // Generate unique filename
      const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '-')}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Define path for saving
      let uploadDir: string;
      if (itemType === 'package') {
        uploadDir = path.join(process.cwd(), 'public', 'images', 'reviews', 'packages', itemId);
      } else {
        uploadDir = path.join(process.cwd(), 'public', 'images', 'reviews', 'activities', itemId);
      }
      
      // Ensure directory exists
      try {
        await import('fs').then(fs => {
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
        });
      } catch (error) {
        console.error('Error creating directory:', error);
      }
      
      // Save file
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      // Add to uploaded images array (relative path for storage)
      const relativePath = `/images/reviews/${itemType === 'package' ? 'packages' : 'activities'}/${itemId}/${fileName}`;
      uploadedImages.push(relativePath);
    }
    
    // Create review object
    const review: ReviewSubmission = {
      id: uuidv4(),
      itemType: itemType as 'package' | 'activity',
      itemId,
      itemName,
      name,
      email,
      location,
      rating,
      title,
      comment,
      images: uploadedImages,
      status: 'pending', // All reviews start as pending for moderation
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    // In a real application, you would save this to a database
    // For now, we'll simulate success
    
    // TODO: Save review to database
    // Example: await db.reviews.create({ data: review });
    
    // For development, log the review
    console.log('Review submitted:', review);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully and pending moderation',
      reviewId: review.id
    });
    
  } catch (error) {
    console.error('Error processing review submission:', error);
    return NextResponse.json(
      { error: 'Failed to process review submission' },
      { status: 500 }
    );
  }
}