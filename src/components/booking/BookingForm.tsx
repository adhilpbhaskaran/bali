'use client';

import { useState } from 'react';
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';

interface BookingFormProps {
  item: {
    id: number;
    title: string;
    price: number;
    discountPrice?: number;
    maxGuests: number;
    availableDates: {
      date: string;
      price: number;
      availability: 'available' | 'limited' | 'booked';
    }[];
  };
  type: string;
}

export default function BookingForm({
  item,
  type
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit the booking to a backend API
    nextStep(); // Move to confirmation step
  };

  const getSelectedDatePrice = () => {
    if (!selectedDate) return item.discountPrice || item.price;
    const dateOption = item.availableDates.find(d => d.date === selectedDate);
    return dateOption ? dateOption.price : (item.discountPrice || item.price);
  };

  const calculateTotal = () => {
    const basePrice = getSelectedDatePrice() * guests;
    const taxesAndFees = Math.round(basePrice * 0.1);
    return basePrice + taxesAndFees;
  };

  return (
    <div className="bento-card">
      <h2 className="text-xl font-semibold mb-6">Book Your {type === 'package' ? 'Package' : 'Activity'}</h2>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`}>
            1
          </div>
          <span className="text-xs">Details</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`}>
            2
          </div>
          <span className="text-xs">Guest Info</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 3 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`}>
            3
          </div>
          <span className="text-xs">Payment</span>
        </div>
        <div className="flex-1 flex items-center">
          <div className={`h-1 w-full ${currentStep >= 4 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 4 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`}>
            4
          </div>
          <span className="text-xs">Confirmation</span>
        </div>
      </div>

      {/* Step 1: Booking Details */}
      {currentStep === 1 && (
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-4">You&apos;re booking: {title}</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">Select Date</label>
              <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
                {availableDates.map((dateOption) => (
                  <button
                    key={dateOption.date}
                    type="button"
                    className={`flex justify-between items-center p-3 rounded-lg border ${
                      selectedDate === dateOption.date 
                        ? 'border-primary-500 bg-primary-900/20' 
                        : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                    } ${dateOption.availability === 'booked' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => dateOption.availability !== 'booked' && setSelectedDate(dateOption.date)}
                    disabled={dateOption.availability === 'booked'}
                  >
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-white/70" />
                      <span>
                        {new Date(dateOption.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">${dateOption.price}</span>
                      <span className={`text-xs ${
                        dateOption.availability === 'limited' 
                          ? 'text-yellow-500' 
                          : dateOption.availability === 'booked' 
                            ? 'text-red-500' 
                            : 'text-green-500'
                      }`}>
                        {dateOption.availability === 'limited' 
                          ? 'Limited' 
                          : dateOption.availability === 'booked' 
                            ? 'Sold Out' 
                            : 'Available'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">Number of Guests</label>
              <div className="flex items-center border border-dark-700 bg-dark-800 rounded-lg">
                <button 
                  type="button"
                  className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >
                  -
                </button>
                <div className="flex-1 text-center">{guests}</div>
                <button 
                  type="button"
                  className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  disabled={guests >= maxGuests}
                >
                  +
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1">Max {maxGuests} guests for this {type}</p>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Base Price</span>
              <span>${getSelectedDatePrice()} x {guests}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Taxes & Fees</span>
              <span>${Math.round(getSelectedDatePrice() * guests * 0.1)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <button 
            type="button"
            className={`btn-primary w-full ${!selectedDate ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={nextStep}
            disabled={!selectedDate}
          >
            Continue to Guest Information
          </button>
        </div>
      )}

      {/* Step 2: Guest Information */}
      {currentStep === 2 && (
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm text-white/70 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm text-white/70 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm text-white/70 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-white/70 mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="specialRequests" className="block text-sm text-white/70 mb-2">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
            >
              Back
            </button>
            <button 
              type="button" 
              className="btn-primary flex-1"
              onClick={nextStep}
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="font-medium mb-4">Payment Method</h3>
            
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center p-3 border border-dark-700 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === 'creditCard'}
                  onChange={handleInputChange}
                  className="mr-3"
                />
                <CreditCard size={20} className="mr-2 text-white/70" />
                <span>Credit/Debit Card</span>
              </label>
              
              <label className="flex items-center p-3 border border-dark-700 rounded-lg cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  disabled
                  className="mr-3"
                />
                <span className="mr-2 font-bold text-blue-400">Pay</span>
                <span className="font-bold text-blue-600">Pal</span>
                <span className="ml-2">(Coming Soon)</span>
              </label>
            </div>

            {formData.paymentMethod === 'creditCard' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm text-white/70 mb-2">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm text-white/70 mb-2">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm text-white/70 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm text-white/70 mb-2">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-start mb-4">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="mt-1 mr-3"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-white/70">
                I agree to the <a href="/terms" className="text-primary-500 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Base Price</span>
              <span>${getSelectedDatePrice()} x {guests}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Taxes & Fees</span>
              <span>${Math.round(getSelectedDatePrice() * guests * 0.1)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={!formData.agreeToTerms}
            >
              Complete Booking
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-white/70 mb-6">Thank you for booking with Bali Malayali. Your booking has been confirmed.</p>
          
          <div className="bento-card bg-dark-800 mb-6">
            <h4 className="font-medium mb-4">Booking Details</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-white/70">Booking Reference:</div>
              <div className="font-medium">BM-{Math.floor(100000 + Math.random() * 900000)}</div>
              
              <div className="text-white/70">{type === 'package' ? 'Package' : 'Activity'}:</div>
              <div className="font-medium">{title}</div>
              
              <div className="text-white/70">Date:</div>
              <div className="font-medium">
                {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="text-white/70">Guests:</div>
              <div className="font-medium">{guests}</div>
              
              <div className="text-white/70">Total Amount:</div>
              <div className="font-medium">${calculateTotal()}</div>
            </div>
          </div>
          
          <p className="text-white/70 mb-6">
            A confirmation email has been sent to {formData.email}. If you have any questions, please contact our support team.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Dashboard link removed for deployment testing */}
            <a href="/" className="btn-primary flex-1">
              Return to Homepage
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
