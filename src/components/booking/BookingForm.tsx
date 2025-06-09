'use client';

import { useState } from 'react';
import { Users, CreditCard, Check, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import Calendar from '@/components/ui/Calendar';

interface BookingFormProps {
  item: {
    id: number;
    title: string;
    price: number;
    discountPrice?: number;
    minParticipants?: number;
    maxParticipants: number;
    tourType?: string;
    availableDates: {
      date: string;
      price: number;
      availability: 'available' | 'limited' | 'booked';
      spotsLeft?: number;
    }[];
  };
  type: string;
  selectedDate?: string;
  onClose?: () => void;
}

export default function BookingForm({
  item,
  type
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState((item as any).minParticipants || 2);
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
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    agreeToTerms: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = (step: number): boolean => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
    if (step === 2) {
      // Validate personal information
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
        isValid = false;
      }
    }
    
    if (step === 3) {
      // Validate payment information
      if (formData.paymentMethod === 'creditCard') {
        if (!formData.cardNumber.trim()) {
          newErrors.cardNumber = 'Card number is required';
          isValid = false;
        } else if (!/^[0-9]{13,19}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = 'Please enter a valid card number';
          isValid = false;
        }
        
        if (!formData.cardName.trim()) {
          newErrors.cardName = 'Name on card is required';
          isValid = false;
        }
        
        if (!formData.expiryDate.trim()) {
          newErrors.expiryDate = 'Expiry date is required';
          isValid = false;
        } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
          newErrors.expiryDate = 'Please use MM/YY format';
          isValid = false;
        }
        
        if (!formData.cvv.trim()) {
          newErrors.cvv = 'CVV is required';
          isValid = false;
        } else if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = 'Please enter a valid CVV';
          isValid = false;
        }
      }
      
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms';
        isValid = false;
      }
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(3)) {
      // In a real application, this would submit the booking to a backend API
      nextStep(); // Move to confirmation step
    }
  };

  const getSelectedDatePrice = () => {
    if (!selectedDate) return item.discountPrice || item.price;
    const dateOption = item.availableDates.find(d => d.date === selectedDate);
    return dateOption ? dateOption.price : (item.discountPrice || item.price);
  };

  const calculateTotal = () => {
    const basePrice = getSelectedDatePrice() * guests;
    // Use tax rate from item if available, otherwise default to 5%
    const taxRate = (item as any).taxRate || 0.05;
    const taxesAndFees = Math.round(basePrice * taxRate);
    return basePrice + taxesAndFees;
  };

  return (
    <div className="bento-card" role="region" aria-label="Booking form">
      <h2 className="text-xl font-semibold mb-6" id="booking-form-title">Book Your {type === 'package' ? 'Package' : 'Activity'}</h2>
      
      {/* Progress Steps */}
      <div className="flex justify-between mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={currentStep} aria-labelledby="booking-form-title">
        <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`} aria-hidden="true">
            1
          </div>
          <span className="text-xs">Details</span>
        </div>
        <div className="flex-1 flex items-center" aria-hidden="true">
          <div className={`h-1 w-full ${currentStep >= 2 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`} aria-hidden="true">
            2
          </div>
          <span className="text-xs">Guest Info</span>
        </div>
        <div className="flex-1 flex items-center" aria-hidden="true">
          <div className={`h-1 w-full ${currentStep >= 3 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 3 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`} aria-hidden="true">
            3
          </div>
          <span className="text-xs">Payment</span>
        </div>
        <div className="flex-1 flex items-center" aria-hidden="true">
          <div className={`h-1 w-full ${currentStep >= 4 ? 'bg-primary-500' : 'bg-dark-700'}`}></div>
        </div>
        <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary-500' : 'text-white/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            currentStep >= 4 ? 'bg-primary-500 text-white' : 'bg-dark-700 text-white/50'
          }`} aria-hidden="true">
            4
          </div>
          <span className="text-xs">Confirmation</span>
        </div>
      </div>

      {/* Step 1: Booking Details */}
      {currentStep === 1 && (
        <div aria-labelledby="step1-heading">
          <h3 id="step1-heading" className="sr-only">Booking Details</h3>
          <div className="mb-6">
            <h4 className="font-medium mb-4">You&apos;re booking: {item.title}</h4>
            
            <div className="mb-4">
              <label id="date-label" className="block text-sm text-white/70 mb-2" htmlFor="date-select">
                {(item as any).tourType === 'FIT' ? 'Select your preferred date' : 'Available dates'}
              </label>
              <div id="date-select" aria-labelledby="date-label">
                <Calendar
                  availableDates={item.availableDates}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  className="w-full"
                  tourType={(item as any).tourType}
                />
              </div>
              {!selectedDate && (
                <p className="text-xs text-red-400 mt-1" role="alert">Please select a date</p>
              )}
            </div>

            <div className="mb-4">
              <label id="guests-label" className="block text-sm text-white/70 mb-2">Number of Guests</label>
              <div 
                className="flex items-center border border-dark-700 bg-dark-800 rounded-lg"
                role="group"
                aria-labelledby="guests-label"
              >
                <button 
                  type="button"
                  className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                  onClick={() => setGuests(Math.max((item as any).minParticipants || 1, guests - 1))}
                  disabled={guests <= ((item as any).minParticipants || 1)}
                  aria-label="Decrease number of guests"
                >
                  -
                </button>
                <div className="flex-1 text-center" aria-live="polite" aria-atomic="true">{guests}</div>
                <button 
                  type="button"
                  className="px-4 py-2 text-white/70 hover:text-white disabled:opacity-50"
                  onClick={() => setGuests(Math.min(item.maxParticipants, guests + 1))}
                  disabled={guests >= item.maxParticipants}
                  aria-label="Increase number of guests"
                >
                  +
                </button>
              </div>
              <p className="text-xs text-white/60 mt-1">Min {(item as any).minParticipants || 1} - Max {item.maxParticipants} guests for this {type}</p>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Base Price</span>
              <span>${getSelectedDatePrice()} x {guests}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Taxes & Fees</span>
              <span>${Math.round(getSelectedDatePrice() * guests * ((item as any).taxRate || 0.05))}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <button 
            type="button"
            className={`btn-primary w-full mb-4 ${(!selectedDate || guests < (item as any).minParticipants) ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={nextStep}
            disabled={!selectedDate || guests < (item as any).minParticipants}
            aria-label="Continue to Guest Information"
          >
            Continue to Guest Information
          </button>
          
          <button 
            type="button"
            className="btn-secondary w-full"
            aria-label={`Inquire About This ${type === 'package' ? 'Package' : 'Activity'}`}
          >
            Inquire About This {type === 'package' ? 'Package' : 'Activity'}
          </button>
        </div>
      )}

      {/* Step 2: Guest Information */}
      {currentStep === 2 && (
        <form aria-labelledby="step2-heading" noValidate>
          <h3 id="step2-heading" className="sr-only">Guest Information</h3>
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
                aria-required="true"
                aria-invalid={!!formErrors.firstName}
                aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                className={`w-full bg-dark-800 border ${formErrors.firstName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {formErrors.firstName && (
                <p id="firstName-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.firstName}</p>
              )}
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
                aria-required="true"
                aria-invalid={!!formErrors.lastName}
                aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                className={`w-full bg-dark-800 border ${formErrors.lastName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {formErrors.lastName && (
                <p id="lastName-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.lastName}</p>
              )}
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
                aria-required="true"
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
                className={`w-full bg-dark-800 border ${formErrors.email ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {formErrors.email && (
                <p id="email-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.email}</p>
              )}
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
                aria-required="true"
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
                className={`w-full bg-dark-800 border ${formErrors.phone ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              {formErrors.phone && (
                <p id="phone-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.phone}</p>
              )}
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
              aria-required="false"
              className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
              aria-label="Back to booking details"
            >
              Back
            </button>
            <button 
              type="button" 
              className="btn-primary flex-1"
              onClick={nextStep}
              aria-label="Continue to payment"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit} aria-labelledby="step3-heading" noValidate>
          <h3 id="step3-heading" className="sr-only">Payment Information</h3>
          <div className="mb-6">
            <h4 className="font-medium mb-4">Payment Method</h4>
            
            <div className="flex flex-col gap-3 mb-6" role="radiogroup" aria-labelledby="payment-method-label">
              <span id="payment-method-label" className="sr-only">Select payment method</span>
              <label className="flex items-center p-3 border border-dark-700 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === 'creditCard'}
                  onChange={handleInputChange}
                  className="mr-3"
                  aria-labelledby="credit-card-label"
                />
                <CreditCard size={20} className="mr-2 text-white/70" aria-hidden="true" />
                <span id="credit-card-label">Credit/Debit Card</span>
              </label>
              
              <label className="flex items-center p-3 border border-dark-700 rounded-lg cursor-pointer opacity-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  disabled
                  className="mr-3"
                  aria-labelledby="paypal-label"
                />
                <span className="mr-2 font-bold text-blue-400" aria-hidden="true">Pay</span>
                <span className="font-bold text-blue-600" aria-hidden="true">Pal</span>
                <span id="paypal-label" className="ml-2">(Coming Soon)</span>
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
                    aria-required="true"
                    aria-invalid={!!formErrors.cardNumber}
                    aria-describedby={formErrors.cardNumber ? "cardNumber-error" : undefined}
                    className={`w-full bg-dark-800 border ${formErrors.cardNumber ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {formErrors.cardNumber && (
                    <p id="cardNumber-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.cardNumber}</p>
                  )}
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
                    aria-required="true"
                    aria-invalid={!!formErrors.cardName}
                    aria-describedby={formErrors.cardName ? "cardName-error" : undefined}
                    className={`w-full bg-dark-800 border ${formErrors.cardName ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                  {formErrors.cardName && (
                    <p id="cardName-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.cardName}</p>
                  )}
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
                      aria-required="true"
                      aria-invalid={!!formErrors.expiryDate}
                      aria-describedby={formErrors.expiryDate ? "expiryDate-error" : undefined}
                      className={`w-full bg-dark-800 border ${formErrors.expiryDate ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {formErrors.expiryDate && (
                      <p id="expiryDate-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.expiryDate}</p>
                    )}
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
                      aria-required="true"
                      aria-invalid={!!formErrors.cvv}
                      aria-describedby={formErrors.cvv ? "cvv-error" : undefined}
                      className={`w-full bg-dark-800 border ${formErrors.cvv ? 'border-red-500' : 'border-dark-700'} rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500`}
                    />
                    {formErrors.cvv && (
                      <p id="cvv-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.cvv}</p>
                    )}
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
                aria-required="true"
                aria-invalid={!!formErrors.agreeToTerms}
                aria-describedby={formErrors.agreeToTerms ? "terms-error" : undefined}
                className="mt-1 mr-3"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-white/70">
                I agree to the <a href="/terms" className="text-primary-500 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {formErrors.agreeToTerms && (
              <p id="terms-error" className="text-xs text-red-400 mt-1" role="alert">{formErrors.agreeToTerms}</p>
            )}
          </div>

          <div className="border-t border-dark-700 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Base Price</span>
              <span>${getSelectedDatePrice()} x {guests}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-white/70">Taxes & Fees</span>
              <span>${Math.round(getSelectedDatePrice() * guests * ((item as any).taxRate || 0.05))}</span>
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
              aria-label="Back to guest information"
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={!formData.agreeToTerms}
              aria-label="Complete booking"
            >
              Complete Booking
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <div className="text-center" aria-labelledby="confirmation-heading">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          
          <h3 id="confirmation-heading" className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-white/70 mb-6">Thank you for booking with Bali Malayali. Your booking has been confirmed.</p>
          
          <div className="bento-card bg-dark-800 mb-6" role="region" aria-label="Booking details summary">
            <h4 className="font-medium mb-4">Booking Details</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-white/70">Booking Reference:</div>
              <div className="font-medium">BM-{Math.floor(100000 + Math.random() * 900000)}</div>
              
              <div className="text-white/70">{type === 'package' ? 'Package' : 'Activity'}:</div>
              <div className="font-medium">{item.title}</div>
              
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
            <a href="/" className="btn-primary flex-1" aria-label="Return to homepage">
              Return to Homepage
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
