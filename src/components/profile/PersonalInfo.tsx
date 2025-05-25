'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Edit, Upload, Check } from 'lucide-react';

export default function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-06-15',
    nationality: 'United States',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    emergencyContactName: 'Jane Doe',
    emergencyContactRelationship: 'Spouse',
    emergencyContactPhone: '+1 (555) 987-6543'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the updated profile to an API
    setIsEditing(false);
    // Show success message or notification
  };

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 
    'Germany', 'France', 'Japan', 'India', 'Singapore', 'Malaysia'
  ];

  return (
    <div className="bento-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing && (
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setIsEditing(true)}
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Profile Picture Section */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image 
                src="/images/avatars/user1.jpg" 
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            {isEditing && (
              <button 
                type="button"
                className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full"
              >
                <Upload size={16} />
              </button>
            )}
          </div>
          {isEditing && (
            <p className="text-white/60 text-sm">
              Click the upload button to change your profile picture
            </p>
          )}
        </div>

        {/* Basic Information */}
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="firstName" className="block text-sm text-white/70 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ) : (
              <p className="text-white/80 py-2">{formData.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm text-white/70 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ) : (
              <p className="text-white/80 py-2">{formData.lastName}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-white/70 mb-2">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ) : (
              <p className="text-white/80 py-2">{formData.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-white/70 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ) : (
              <p className="text-white/80 py-2">{formData.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm text-white/70 mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">
                {new Date(formData.dateOfBirth).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="nationality" className="block text-sm text-white/70 mb-2">Nationality</label>
            {isEditing ? (
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            ) : (
              <p className="text-white/80 py-2">{formData.nationality}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <h3 className="text-lg font-medium mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm text-white/70 mb-2">Street Address</label>
            {isEditing ? (
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.address}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm text-white/70 mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm text-white/70 mb-2">State/Province</label>
            {isEditing ? (
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.state}</p>
            )}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm text-white/70 mb-2">Postal/ZIP Code</label>
            {isEditing ? (
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.postalCode}</p>
            )}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm text-white/70 mb-2">Country</label>
            {isEditing ? (
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            ) : (
              <p className="text-white/80 py-2">{formData.country}</p>
            )}
          </div>
        </div>

        {/* Emergency Contact */}
        <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="emergencyContactName" className="block text-sm text-white/70 mb-2">Contact Name</label>
            {isEditing ? (
              <input
                type="text"
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.emergencyContactName}</p>
            )}
          </div>
          <div>
            <label htmlFor="emergencyContactRelationship" className="block text-sm text-white/70 mb-2">Relationship</label>
            {isEditing ? (
              <input
                type="text"
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.emergencyContactRelationship}</p>
            )}
          </div>
          <div>
            <label htmlFor="emergencyContactPhone" className="block text-sm text-white/70 mb-2">Contact Phone</label>
            {isEditing ? (
              <input
                type="tel"
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
              />
            ) : (
              <p className="text-white/80 py-2">{formData.emergencyContactPhone}</p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        {isEditing && (
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex items-center"
            >
              <Check size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
