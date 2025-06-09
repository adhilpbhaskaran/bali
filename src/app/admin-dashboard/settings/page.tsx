'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Save, Globe, Bell, Shield, Mail, Palette, Server } from 'lucide-react';

interface SettingsSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'Bali Malayali',
    siteDescription: 'Your Ultimate Travel Guide to Bali',
    adminEmail: 'admin@balimalayali.com',
    language: 'en',
    timezone: 'Asia/Jakarta',
    currency: 'USD',
    enableNotifications: true,
    emailNotifications: true,
    darkMode: true,
    maintenanceMode: false
  });

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      icon: Globe,
      description: 'Basic website configuration and preferences'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage notification preferences and alerts'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Security settings and access control'
    },
    {
      id: 'email',
      title: 'Email Settings',
      icon: Mail,
      description: 'Configure email templates and settings'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel of your website'
    },
    {
      id: 'system',
      title: 'System',
      icon: Server,
      description: 'System settings and maintenance options'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to your backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          onClick={handleSave}
          className="btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Save size={20} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bento-card p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-600/20 text-primary-500'
                      : 'text-white/70 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <section.icon className="w-5 h-5 mr-3" />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bento-card p-6">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Site Description
                    </label>
                    <input
                      type="text"
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={settings.adminEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Language
                      </label>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="id">Indonesian</option>
                        <option value="ml">Malayalam</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Timezone
                      </label>
                      <select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Asia/Jakarta">Asia/Jakarta</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={settings.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="IDR">IDR</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Enable Notifications</h3>
                      <p className="text-sm text-white/60">Receive notifications about new bookings and inquiries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="enableNotifications"
                        checked={settings.enableNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-white/60">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <p className="text-white/60">Security settings coming soon...</p>
              </div>
            )}

            {activeSection === 'email' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
                <p className="text-white/60">Email configuration coming soon...</p>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-white/60">Enable dark mode for the admin dashboard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="darkMode"
                        checked={settings.darkMode}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'system' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Maintenance Mode</h3>
                      <p className="text-sm text-white/60">Put the website in maintenance mode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}