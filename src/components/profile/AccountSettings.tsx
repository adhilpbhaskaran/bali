'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Lock, 
  Bell, 
  CreditCard, 
  Languages, 
  Check,
  X,
  Mail,
  Smartphone,
  Globe,
  LogOut,
  Clock
} from 'lucide-react';

export default function AccountSettings() {
  // Screen size detection
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Security settings
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: {
      promotions: true,
      bookingUpdates: true,
      priceAlerts: true,
      newsletter: false,
      accountActivity: true
    },
    sms: {
      bookingUpdates: true,
      emergencyAlerts: true,
      promotions: false
    },
    pushNotifications: {
      bookingUpdates: true,
      priceAlerts: true,
      promotions: false,
      accountActivity: true
    }
  });
  
  // Payment settings
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      name: 'Visa ending in 4242',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      name: 'Mastercard ending in 5555',
      expiryDate: '09/25',
      isDefault: false
    }
  ]);
  
  // Preferences settings
  const [preferences, setPreferences] = useState({
    language: 'english',
    currency: 'usd',
    timezone: 'America/New_York'
  });
  
  // Handle password form change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Handle password form submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Password update logic would go here
    alert('Password updated successfully');
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (
    category: 'email' | 'sms' | 'pushNotifications', 
    setting: string
  ) => {
    setNotifications({
      ...notifications,
      [category]: {
        ...notifications[category],
        [setting]: !notifications[category][setting as keyof typeof notifications[typeof category]]
      }
    });
  };
  
  // Handle payment method default
  const setDefaultPaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  // Handle payment method delete
  const deletePaymentMethod = (id: number) => {
    setPaymentMethods(
      paymentMethods.filter(method => method.id !== id)
    );
  };
  
  // Handle preference change
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };
  
  return (
    <div className="bento-card max-w-full">
      <h2 className="text-responsive-lg font-semibold mb-4 sm:mb-6">Account Settings</h2>
      
      <Tabs defaultValue="security">
        <TabsList className="mb-4 sm:mb-6 w-full overflow-x-auto flex flex-nowrap -mx-1 px-1 pb-1 no-scrollbar">
          <TabsTrigger value="security" className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0 mx-0.5">
            <Lock size={isSmallScreen ? 14 : 16} className="mr-1 sm:mr-2" />
            {isSmallScreen ? 'Security' : 'Security'}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0 mx-0.5">
            <Bell size={isSmallScreen ? 14 : 16} className="mr-1 sm:mr-2" />
            {isSmallScreen ? 'Alerts' : 'Notifications'}
          </TabsTrigger>
          <TabsTrigger value="payment" className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0 mx-0.5">
            <CreditCard size={isSmallScreen ? 14 : 16} className="mr-1 sm:mr-2" />
            {isSmallScreen ? 'Payment' : 'Payment'}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="whitespace-nowrap text-xs sm:text-sm flex-shrink-0 mx-0.5">
            <Languages size={isSmallScreen ? 14 : 16} className="mr-1 sm:mr-2" />
            {isSmallScreen ? 'Prefs' : 'Preferences'}
          </TabsTrigger>
        </TabsList>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-responsive-base font-medium mb-3 sm:mb-4">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="max-w-md">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-responsive-xs text-white/70 mb-1 sm:mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="bg-dark-700 border border-dark-600 text-white text-xs sm:text-sm rounded-lg p-2 sm:p-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-responsive-xs text-white/70 mb-1 sm:mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="bg-dark-700 border border-dark-600 text-white text-xs sm:text-sm rounded-lg p-2 sm:p-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <p className="text-responsive-xs text-white/60 mt-1">
                      Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-responsive-xs text-white/70 mb-1 sm:mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="bg-dark-700 border border-dark-600 text-white text-xs sm:text-sm rounded-lg p-2 sm:p-2.5 w-full focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <button type="submit" className="btn-primary">
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="border-t border-dark-700 pt-4 sm:pt-6">
              <h3 className="text-responsive-base font-medium mb-2 sm:mb-4">Two-Factor Authentication</h3>
              <p className="text-responsive-xs text-white/70 mb-3 sm:mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="btn-secondary">
                Enable Two-Factor Authentication
              </button>
            </div>
            
            <div className="border-t border-dark-700 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Login Sessions</h3>
              <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
                You're currently logged in on the following devices:
              </p>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-dark-800 rounded-lg gap-2 sm:gap-0">
                  <div>
                    <p className="text-sm sm:text-base font-medium">Chrome on Windows</p>
                    <p className="text-xs sm:text-sm text-white/60">Current session • Last active now</p>
                  </div>
                  <span className="self-start sm:self-auto px-2 py-0.5 sm:py-1 bg-green-900/30 text-green-400 text-xs rounded-full">
                    Current
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-dark-800 rounded-lg gap-2 sm:gap-0">
                  <div>
                    <p className="text-sm sm:text-base font-medium">Safari on iPhone</p>
                    <p className="text-xs sm:text-sm text-white/60">Last active 2 days ago</p>
                  </div>
                  <button className="self-start sm:self-auto text-xs sm:text-sm text-red-500 hover:text-red-400 py-1 px-2 rounded">
                    Log Out
                  </button>
                </div>
              </div>
              <button className="btn-secondary mt-4 text-red-500 hover:text-red-400 hover:border-red-500">
                <LogOut size={16} className="mr-2" />
                Log Out of All Devices
              </button>
            </div>
          </div>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Email Notifications</h3>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(notifications.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 sm:p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center">
                      <Mail size={isSmallScreen ? 14 : 16} className="mr-2 sm:mr-3 text-white/70" />
                      <div>
                        <p className="text-sm sm:text-base font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-xs sm:text-sm text-white/60">
                          {getNotificationDescription('email', key)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('email', key)}
                      className={`w-10 sm:w-12 h-5 sm:h-6 rounded-full relative ${
                        value ? 'bg-primary-500' : 'bg-dark-700'
                      } transition-colors`}
                    >
                      <span 
                        className={`absolute top-0.5 sm:top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'left-6 sm:left-7' : 'left-0.5 sm:left-1'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-medium mb-4">SMS Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notifications.sms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone size={16} className="mr-3 text-white/70" />
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-white/60">
                          {getNotificationDescription('sms', key)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('sms', key)}
                      className={`w-12 h-6 rounded-full relative ${
                        value ? 'bg-primary-500' : 'bg-dark-700'
                      } transition-colors`}
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'left-7' : 'left-1'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notifications.pushNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                    <div className="flex items-center">
                      <Bell size={16} className="mr-3 text-white/70" />
                      <div>
                        <p className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-white/60">
                          {getNotificationDescription('pushNotifications', key)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('pushNotifications', key)}
                      className={`w-12 h-6 rounded-full relative ${
                        value ? 'bg-primary-500' : 'bg-dark-700'
                      } transition-colors`}
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          value ? 'left-7' : 'left-1'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-6 rounded mr-3 flex items-center justify-center ${
                        method.type === 'visa' ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {method.type === 'visa' ? 'VISA' : 'MC'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-white/60">Expires {method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {method.isDefault ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full flex items-center">
                          <Check size={12} className="mr-1" />
                          Default
                        </span>
                      ) : (
                        <button 
                          onClick={() => setDefaultPaymentMethod(method.id)}
                          className="text-sm text-white/70 hover:text-white"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deletePaymentMethod(method.id)}
                        className="text-red-500 hover:text-red-400"
                        disabled={method.isDefault}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-4">
                Add Payment Method
              </button>
            </div>
            
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Billing Address</h3>
              <div className="p-4 bg-dark-800 rounded-lg">
                <p className="font-medium">John Doe</p>
                <p className="text-white/70">123 Travel Street</p>
                <p className="text-white/70">New York, NY 10001</p>
                <p className="text-white/70">United States</p>
              </div>
              <button className="btn-secondary mt-4">
                Edit Billing Address
              </button>
            </div>
            
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Billing History</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                  <div>
                    <p className="font-medium">Mount Batur Sunrise Trek</p>
                    <p className="text-sm text-white/60">Dec 10, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$110.00</p>
                    <p className="text-xs text-green-400">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                  <div>
                    <p className="font-medium">Ubud Cultural Tour</p>
                    <p className="text-sm text-white/60">Dec 8, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$90.00</p>
                    <p className="text-xs text-green-400">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                  <div>
                    <p className="font-medium">Luxury Bali Retreat</p>
                    <p className="text-sm text-white/60">Aug 12, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$1,199.00</p>
                    <p className="text-xs text-green-400">Paid</p>
                  </div>
                </div>
              </div>
              <button className="btn-secondary mt-4">
                View All Transactions
              </button>
            </div>
          </div>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Language & Region</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm text-white/70 mb-2">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 appearance-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="japanese">Japanese</option>
                      <option value="chinese">Chinese</option>
                    </select>
                    <Globe className="absolute right-3 top-2.5 text-white/50" size={16} />
                  </div>
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm text-white/70 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      id="currency"
                      name="currency"
                      value={preferences.currency}
                      onChange={handlePreferenceChange}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 appearance-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="usd">USD ($)</option>
                      <option value="eur">EUR (€)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="jpy">JPY (¥)</option>
                      <option value="aud">AUD (A$)</option>
                      <option value="cad">CAD (C$)</option>
                    </select>
                    <CreditCard className="absolute right-3 top-2.5 text-white/50" size={16} />
                  </div>
                </div>
                <div>
                  <label htmlFor="timezone" className="block text-sm text-white/70 mb-2">
                    Timezone
                  </label>
                  <div className="relative">
                    <select
                      id="timezone"
                      name="timezone"
                      value={preferences.timezone}
                      onChange={handlePreferenceChange}
                      className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 appearance-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    </select>
                    <Clock className="absolute right-3 top-2.5 text-white/50" size={16} />
                  </div>
                </div>
              </div>
              <button className="btn-primary mt-4">
                Save Preferences
              </button>
            </div>
            
            <div className="border-t border-dark-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Account Deletion</h3>
              <p className="text-white/70 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="btn-secondary text-red-500 hover:text-red-400 hover:border-red-500">
                Delete Account
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get notification descriptions
function getNotificationDescription(category: string, key: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    email: {
      promotions: 'Receive emails about special offers and promotions',
      bookingUpdates: 'Receive updates about your bookings',
      priceAlerts: 'Get notified when prices drop for your saved items',
      newsletter: 'Receive our monthly newsletter with travel tips',
      accountActivity: 'Get notified about important account activity'
    },
    sms: {
      bookingUpdates: 'Receive SMS updates about your bookings',
      emergencyAlerts: 'Get emergency alerts related to your trips',
      promotions: 'Receive SMS about special offers and promotions'
    },
    pushNotifications: {
      bookingUpdates: 'Receive push notifications about your bookings',
      priceAlerts: 'Get notified when prices drop for your saved items',
      promotions: 'Receive notifications about special offers',
      accountActivity: 'Get notified about important account activity'
    }
  };
  
  return descriptions[category]?.[key] || '';
}
