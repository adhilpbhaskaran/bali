'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Heart,
  ChevronRight,
  Tag
} from 'lucide-react';

// Sample blog post data
const blogPostsData = [
  {
    id: 1,
    title: "Top 10 Must-Visit Places in Bali for First-Time Visitors",
    excerpt: "Exploring Bali for the first time? Discover the essential places that should be on every traveler's itinerary, from sacred temples to pristine beaches.",
    content: `
      <p>Bali, the Island of the Gods, is a paradise that offers something for everyone. From stunning beaches and lush rice terraces to ancient temples and vibrant cultural experiences, this Indonesian island has captivated travelers for decades.</p>
      
      <p>If you're planning your first trip to Bali, the sheer number of attractions can be overwhelming. To help you make the most of your visit, we've compiled a list of the top 10 must-visit places that should be on every first-time visitor's itinerary.</p>
      
      <h2>1. Ubud - The Cultural Heart of Bali</h2>
      
      <p>Nestled among rice paddies and steep ravines, Ubud is known as Bali's cultural and artistic center. Here you'll find the famous Monkey Forest Sanctuary, home to over 700 long-tailed macaques, as well as numerous art galleries, museums, and traditional craft shops.</p>
      
      <p>Don't miss the Ubud Palace (Puri Saren Agung), where you can watch traditional Balinese dance performances in the evening. The Ubud Art Market is perfect for picking up souvenirs, from handmade crafts to beautiful textiles.</p>
      
      <h2>2. Tegallalang Rice Terraces</h2>
      
      <p>Just north of Ubud, the stunning Tegallalang Rice Terraces showcase the ancient Balinese cooperative irrigation system known as subak. The dramatic, verdant terraces create a picturesque landscape that's perfect for photography, especially in the early morning light.</p>
      
      <p>Many cafes along the ridge offer spectacular views of the terraces while you enjoy a refreshing coconut or Balinese coffee.</p>
      
      <h2>3. Uluwatu Temple</h2>
      
      <p>Perched on a steep cliff 70 meters above the roaring Indian Ocean, Pura Luhur Uluwatu is one of Bali's six key temples and one of the best places to catch a sunset in Bali. The temple itself is relatively small but offers breathtaking coastal views.</p>
      
      <p>Stay for the nightly Kecak Fire Dance performance, where dancers tell the story of the Ramayana through chanting and dramatic movements as the sun sets over the ocean.</p>
      
      <h2>4. Sacred Monkey Forest Sanctuary</h2>
      
      <p>Located in Ubud, this natural forest reserve is home to over 700 long-tailed macaques. The sanctuary contains three Hindu temples dating from the 14th century and is considered a sacred site.</p>
      
      <p>Walking through the forest paths surrounded by ancient trees and moss-covered statues creates a magical atmosphere. Just be careful with your belongings, as the monkeys are known to be quite mischievous!</p>
      
      <h2>5. Tanah Lot Temple</h2>
      
      <p>One of Bali's most iconic landmarks, Tanah Lot is a sea temple perched on a rock formation just offshore. The temple is particularly spectacular at sunset when the silhouette of the temple against the glowing sky creates a mesmerizing scene.</p>
      
      <p>During low tide, visitors can walk across to the temple, although only Balinese Hindus are permitted to enter the actual temple building.</p>
      
      <h2>6. Seminyak Beach</h2>
      
      <p>For those seeking a mix of beach relaxation and upscale amenities, Seminyak offers a sophisticated atmosphere with its luxury resorts, high-end shopping, and world-class dining options. The beach itself features golden sand and is famous for its stunning sunsets.</p>
      
      <p>Beach clubs like Potato Head and Ku De Ta offer the perfect setting to enjoy a cocktail while watching the sun dip below the horizon.</p>
      
      <h2>7. Mount Batur</h2>
      
      <p>For the more adventurous traveler, a sunrise trek up Mount Batur is an unforgettable experience. This active volcano offers a relatively easy climb that takes about 2 hours to reach the summit.</p>
      
      <p>From the top, you'll be rewarded with panoramic views of Lake Batur and Mount Abang as the sun rises over Mount Agung, Bali's highest peak. Many tours include breakfast cooked using the volcano's natural steam.</p>
      
      <h2>8. Tirta Empul Temple</h2>
      
      <p>Founded in 962 AD, Tirta Empul is a water temple known for its holy spring water, where Balinese Hindus go for ritual purification. Visitors can observe or participate in the cleansing ritual by entering the main pool and moving from one fountain to another, offering prayers.</p>
      
      <p>The temple complex also contains bathing pools, courtyards, and various shrines dedicated to Hindu deities.</p>
      
      <h2>9. Nusa Penida Island</h2>
      
      <p>A short boat ride from Bali's southeast coast, Nusa Penida offers some of the most dramatic landscapes in the region. The island's rugged coastline features stunning cliffs, pristine beaches, and crystal-clear waters.</p>
      
      <p>Kelingking Beach, with its T-Rex shaped cliff formation, and Angel's Billabong, a natural infinity pool, are among the most photographed spots. The island is also a sanctuary for the endangered Bali starling bird.</p>
      
      <h2>10. Besakih Temple</h2>
      
      <p>Known as the "Mother Temple" of Bali, Besakih is the largest and most important temple complex on the island. Located on the slopes of Mount Agung, it consists of 23 related temples with the main one, Pura Penataran Agung, having six levels terraced up the slope.</p>
      
      <p>The temple offers stunning views of the surrounding mountains, rice paddies, and streams. As it's a sacred site, visitors must wear a sarong and sash, which can be rented at the entrance.</p>
      
      <h2>Tips for First-Time Visitors</h2>
      
      <ul>
        <li>The best time to visit Bali is during the dry season (April to October).</li>
        <li>Rent a scooter or hire a driver to get around, as public transportation is limited.</li>
        <li>Always dress respectfully when visiting temples (cover shoulders and knees).</li>
        <li>Stay hydrated and use sun protection, as the tropical sun can be intense.</li>
        <li>Learn a few basic Indonesian phrases – the locals will appreciate your effort.</li>
      </ul>
      
      <p>Bali's unique blend of stunning natural beauty, rich cultural heritage, and warm hospitality makes it an ideal destination for first-time visitors to Indonesia. By including these top 10 places in your itinerary, you'll experience the essence of what makes the Island of the Gods so special.</p>
    `,
    image: "/images/blog/top-10-places.jpg",
    category: "Travel Guide",
    author: "Sarah Johnson",
    authorImage: "/images/team/sarah.jpg",
    authorBio: "Sarah is a travel writer and photographer who has been exploring Asia for over a decade. She specializes in cultural experiences and off-the-beaten-path destinations.",
    date: "2025-05-15",
    readTime: "8 min read",
    tags: ["bali", "travel guide", "beaches", "temples"],
    relatedPosts: [2, 5, 6]
  },
  {
    id: 2,
    title: "The Ultimate Bali Food Guide: Local Delicacies You Must Try",
    excerpt: "Dive into Bali's rich culinary scene with our comprehensive guide to local foods, from savory Babi Guling to sweet Dadar Gulung.",
    image: "/images/blog/food-guide.jpg",
    category: "Food & Dining",
    author: "Michael Wong",
    date: "2025-05-10",
    readTime: "6 min read",
    tags: ["bali", "food", "cuisine", "restaurants"]
  },
  {
    id: 5,
    title: "Bali's Hidden Gems: Off-the-Beaten-Path Destinations",
    excerpt: "Escape the crowds and discover Bali's lesser-known treasures, from secret waterfalls to quiet villages that offer authentic cultural experiences.",
    image: "/images/blog/hidden-gems.jpg",
    category: "Adventure",
    author: "Lisa Chen",
    date: "2025-04-20",
    readTime: "9 min read",
    tags: ["bali", "hidden gems", "adventure", "local culture"]
  },
  {
    id: 6,
    title: "Bali on a Budget: How to Enjoy Paradise Without Breaking the Bank",
    excerpt: "Traveling to Bali doesn't have to be expensive. Learn insider tips on how to experience the best of Bali while keeping your costs low.",
    image: "/images/blog/budget-travel.jpg",
    category: "Budget Travel",
    author: "James Wilson",
    date: "2025-04-15",
    readTime: "8 min read",
    tags: ["bali", "budget", "tips", "affordable"]
  }
];

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [comment, setComment] = useState('');
  
  // Find the blog post by ID
  const postId = parseInt(params.id);
  const post = blogPostsData.find(p => p.id === postId);
  
  // Get related posts
  const relatedPosts = post?.relatedPosts?.map(id => 
    blogPostsData.find(p => p.id === id)
  ).filter(Boolean) || [];

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the comment to a backend
    alert(`Comment submitted: ${comment}`);
    setComment('');
  };

  if (!post) {
    return (
      <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
        <div className="container-custom">
          <div className="bento-card text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Blog post not found</h2>
            <p className="text-white/70 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog" className="btn-primary">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="text-sm text-white/60 mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link> {' / '}
          <Link href="/blog" className="hover:text-primary-500">Blog</Link> {' / '}
          <span className="text-white">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Blog Post Header */}
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full mb-4">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-white/60 mb-6">
                <div className="flex items-center mr-6 mb-2 md:mb-0">
                  <Calendar size={16} className="mr-2" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center mr-6 mb-2 md:mb-0">
                  <User size={16} className="mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center mb-2 md:mb-0">
                  <Clock size={16} className="mr-2" />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image 
                src={post.image || '/images/placeholder.jpg'} 
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Blog Content */}
            <div className="bento-card mb-8">
              <div 
                className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-primary-500"
                dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link 
                  key={tag} 
                  href={`/blog?tag=${tag}`}
                  className="flex items-center px-3 py-1 bg-dark-800 hover:bg-dark-700 rounded-full text-sm transition-colors"
                >
                  <Tag size={14} className="mr-2 text-primary-500" />
                  {tag}
                </Link>
              ))}
            </div>

            {/* Social Sharing */}
            <div className="bento-card mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <button 
                    className={`flex items-center mr-4 ${liked ? 'text-red-500' : 'text-white/70 hover:text-red-500'}`}
                    onClick={handleLike}
                  >
                    <Heart size={20} className={`mr-2 ${liked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <a href="#comments" className="flex items-center text-white/70 hover:text-white">
                    <MessageCircle size={20} className="mr-2" />
                    <span>Comments (12)</span>
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="text-white/70 mr-3">Share:</span>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-800 rounded-full text-white/70 hover:text-[#1877F2] mr-2"
                  >
                    <Facebook size={16} />
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-800 rounded-full text-white/70 hover:text-[#1DA1F2] mr-2"
                  >
                    <Twitter size={16} />
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-800 rounded-full text-white/70 hover:text-[#0A66C2]"
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            {post.authorBio && (
              <div className="bento-card mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {post.authorImage && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src={post.authorImage} 
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About {post.author}</h3>
                    <p className="text-white/70 mb-3">{post.authorBio}</p>
                    <a href="#" className="text-primary-500 hover:underline">View all posts by {post.author.split(' ')[0]}</a>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div id="comments" className="bento-card">
              <h2 className="text-xl font-semibold mb-6">Comments (12)</h2>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  placeholder="Leave a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg p-4 mb-3 focus:ring-primary-500 focus:border-primary-500"
                  required
                ></textarea>
                <button type="submit" className="btn-primary">
                  Post Comment
                </button>
              </form>
              
              {/* Sample Comments */}
              <div className="space-y-6">
                <div className="border-b border-dark-700 pb-6">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src="/images/avatars/user1.jpg" 
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium mr-2">John Doe</h4>
                        <span className="text-white/50 text-sm">2 days ago</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        Great article! I visited most of these places during my trip to Bali last year and they were absolutely stunning. Tegallalang Rice Terraces was my favorite!
                      </p>
                      <button className="text-primary-500 text-sm mt-2">Reply</button>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-dark-700 pb-6">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src="/images/avatars/user2.jpg" 
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium mr-2">Jane Smith</h4>
                        <span className="text-white/50 text-sm">3 days ago</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        I would also recommend visiting Nusa Lembongan if you have time. It's less crowded than Nusa Penida but equally beautiful!
                      </p>
                      <button className="text-primary-500 text-sm mt-2">Reply</button>
                    </div>
                  </div>
                  
                  {/* Nested Reply */}
                  <div className="flex items-start gap-3 mt-4 ml-12">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image 
                        src="/images/avatars/user3.jpg" 
                        alt="User Avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium mr-2">Sarah Johnson</h4>
                        <span className="text-white/50 text-sm">2 days ago</span>
                      </div>
                      <p className="text-white/80 text-sm">
                        Great suggestion, Jane! I'll add Nusa Lembongan to the follow-up article about island hopping around Bali.
                      </p>
                      <button className="text-primary-500 text-sm mt-2">Reply</button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <button className="text-primary-500 flex items-center">
                    View all 12 comments <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Widget */}
            <div className="bento-card mb-6">
              <div className="flex items-center gap-3 mb-4">
                {post.authorImage ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={post.authorImage} 
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-primary-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{post.author}</h3>
                  <p className="text-white/60 text-sm">Travel Writer</p>
                </div>
              </div>
              {post.authorBio && (
                <p className="text-white/70 text-sm mb-4 line-clamp-3">{post.authorBio}</p>
              )}
              <a href="#" className="text-primary-500 text-sm hover:underline">
                View all posts by {post.author.split(' ')[0]}
              </a>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bento-card mb-6">
                <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost?.id} href={`/blog/${relatedPost?.id}`} className="flex gap-3 group">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image 
                          src={relatedPost?.image || '/images/placeholder.jpg'} 
                          alt={relatedPost?.title || ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary-500 transition-colors line-clamp-2">
                          {relatedPost?.title}
                        </h4>
                        <p className="text-white/60 text-xs mt-1">
                          {new Date(relatedPost?.date || '').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Cloud */}
            <div className="bento-card mb-6">
              <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(blogPostsData.flatMap(p => p.tags))).map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-dark-800 hover:bg-dark-700 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bento-card bg-gradient-to-r from-primary-900/50 to-purple-900/50">
              <h3 className="text-lg font-semibold mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-white/70 text-sm mb-4">
                Get the latest travel tips and Bali insights delivered to your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-dark-800/50 border border-dark-700 text-white rounded-lg px-4 py-2 w-full focus:ring-primary-500 focus:border-primary-500"
                />
                <button type="submit" className="btn-primary w-full">
                  Subscribe
                </button>
              </form>
              <p className="text-white/50 text-xs mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
