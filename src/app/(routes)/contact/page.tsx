'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Mail, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real application, this would send data to a server
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-dark-900 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/70 max-w-3xl">
            Have questions about our packages or need help planning your perfect Bali experience? 
            We're here to help! Reach out to us using the form below or through our contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bento-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Our Office</h3>
                    <p className="text-white/70">Jl. Sunset Road No. 88, Seminyak, Kuta, Bali 80361, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-white/70">+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="text-primary-400 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-white/70">info@balimalayali.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card p-6">
              <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Sunday</span>
                  <span>Closed</span>
                </div>
                <p className="text-white/60 text-sm mt-4">
                  * All times are in Bali local time (GMT+8)
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bento-card p-6">
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-primary-900/30 border border-primary-700 rounded-lg p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="text-primary-500 h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-white/80 mb-4">
                    Your message has been successfully sent. We'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Information</option>
                        <option value="custom">Custom Package Request</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="bg-dark-800 border border-dark-700 text-white rounded-lg px-4 py-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send size={16} className="mr-2" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="bento-card p-0 overflow-hidden h-[400px] relative">
            <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
              <p className="text-white/70">
                Map will be displayed here. In a production environment, this would be an embedded Google Map.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-3">How far in advance should I book my trip?</h3>
              <p className="text-white/70">
                We recommend booking at least 2-3 months in advance, especially during peak season (July-August and December-January). For custom packages or large groups, earlier booking is advisable.
              </p>
            </div>
            
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-3">Do you offer airport pickup services?</h3>
              <p className="text-white/70">
                Yes, all our packages include complimentary airport pickup and drop-off. For individual bookings, airport transfers can be arranged at an additional cost.
              </p>
            </div>
            
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-3">Can I customize the packages on your website?</h3>
              <p className="text-white/70">
                Absolutely! All our packages can be customized to suit your preferences. Contact us with your requirements, and we'll create a tailored itinerary for you.
              </p>
            </div>
            
            <div className="bento-card p-6">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-white/70">
                We accept credit/debit cards, PayPal, bank transfers, and cryptocurrency. A 30% deposit is required to confirm bookings, with the balance due 30 days before arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
