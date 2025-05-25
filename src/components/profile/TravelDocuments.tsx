'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Trash, 
  Plus,
  Calendar,
  Globe,
  AlertCircle
} from 'lucide-react';

// Sample travel documents data
const documents = [
  {
    id: 1,
    type: 'passport',
    title: 'Passport',
    number: 'P12345678',
    issuedBy: 'United States',
    issuedDate: '2020-05-15',
    expiryDate: '2030-05-14',
    fileName: 'passport_scan.pdf',
    uploadDate: '2025-01-10',
    fileSize: '2.4 MB',
    thumbnail: '/images/documents/passport.jpg'
  },
  {
    id: 2,
    type: 'visa',
    title: 'Indonesia Visa',
    number: 'V98765432',
    issuedBy: 'Indonesian Embassy',
    issuedDate: '2025-04-01',
    expiryDate: '2025-07-01',
    fileName: 'indonesia_visa.pdf',
    uploadDate: '2025-04-02',
    fileSize: '1.8 MB',
    thumbnail: '/images/documents/visa.jpg'
  },
  {
    id: 3,
    type: 'insurance',
    title: 'Travel Insurance',
    number: 'TI-2025-123456',
    issuedBy: 'Global Travel Insurance Co.',
    issuedDate: '2025-03-15',
    expiryDate: '2025-09-15',
    fileName: 'travel_insurance.pdf',
    uploadDate: '2025-03-16',
    fileSize: '3.1 MB',
    thumbnail: '/images/documents/insurance.jpg'
  }
];

export default function TravelDocuments() {
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentsList, setDocumentsList] = useState(documents);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    type: 'passport',
    title: '',
    number: '',
    issuedBy: '',
    issuedDate: '',
    expiryDate: '',
    file: null as File | null
  });
  
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

  const documentTypes = [
    { value: 'passport', label: 'Passport' },
    { value: 'visa', label: 'Visa' },
    { value: 'insurance', label: 'Travel Insurance' },
    { value: 'id', label: 'ID Card' },
    { value: 'vaccination', label: 'Vaccination Certificate' },
    { value: 'other', label: 'Other Document' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument({
        ...newDocument,
        file: e.target.files[0]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would upload the file to a server
    // and then add the document to the user's documents list
    
    const selectedType = documentTypes.find(type => type.value === newDocument.type);
    
    const newDocumentEntry = {
      id: documentsList.length + 1,
      type: newDocument.type,
      title: newDocument.title || selectedType?.label || 'Document',
      number: newDocument.number,
      issuedBy: newDocument.issuedBy,
      issuedDate: newDocument.issuedDate,
      expiryDate: newDocument.expiryDate,
      fileName: newDocument.file ? newDocument.file.name : 'document.pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: newDocument.file ? `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
      thumbnail: `/images/documents/${newDocument.type}.jpg`
    };
    
    setDocumentsList([...documentsList, newDocumentEntry]);
    setUploadingDocument(false);
    setNewDocument({
      type: 'passport',
      title: '',
      number: '',
      issuedBy: '',
      issuedDate: '',
      expiryDate: '',
      file: null
    });
  };

  const deleteDocument = (id: number) => {
    // In a real app, this would delete the file from the server
    setDocumentsList(documentsList.filter(doc => doc.id !== id));
  };

  // Check if any documents are expiring soon (within 30 days)
  const checkExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return 'expired';
    } else if (daysUntilExpiry <= 30) {
      return 'expiring-soon';
    } else {
      return 'valid';
    }
  };

  return (
    <div className="bento-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold">Travel Documents</h2>
        {!uploadingDocument && (
          <button 
            className="btn-primary flex items-center text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
            onClick={() => setUploadingDocument(true)}
          >
            <Plus size={14} className="mr-1 sm:mr-2" />
            Add Document
          </button>
        )}
      </div>
      
      <p className="text-white/70 mb-6">
        Store your important travel documents securely for easy access during your trips. 
        We recommend uploading your passport, visas, travel insurance, and any other documents you might need while traveling.
      </p>
      
      {/* Upload Document Form */}
      {uploadingDocument && (
        <div className="border border-dark-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium mb-4">Upload New Document</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="type" className="block text-sm text-white/70 mb-2">Document Type</label>
                <select
                  id="type"
                  name="type"
                  value={newDocument.type}
                  onChange={handleInputChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm text-white/70 mb-2">Document Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newDocument.title}
                  onChange={handleInputChange}
                  placeholder={documentTypes.find(type => type.value === newDocument.type)?.label || 'Document Title'}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="number" className="block text-sm text-white/70 mb-2">Document Number</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={newDocument.number}
                  onChange={handleInputChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="issuedBy" className="block text-sm text-white/70 mb-2">Issued By</label>
                <input
                  type="text"
                  id="issuedBy"
                  name="issuedBy"
                  value={newDocument.issuedBy}
                  onChange={handleInputChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="issuedDate" className="block text-sm text-white/70 mb-2">Issue Date</label>
                <input
                  type="date"
                  id="issuedDate"
                  name="issuedDate"
                  value={newDocument.issuedDate}
                  onChange={handleInputChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm text-white/70 mb-2">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={newDocument.expiryDate}
                  onChange={handleInputChange}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="file" className="block text-sm text-white/70 mb-2">Document File (PDF, JPG, PNG)</label>
              <div className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <label htmlFor="file" className="cursor-pointer">
                  <Upload size={32} className="mx-auto mb-2 text-white/50" />
                  <p className="text-white/70 mb-1">Click to upload or drag and drop</p>
                  <p className="text-white/50 text-sm">PDF, JPG or PNG (max. 10MB)</p>
                  {newDocument.file && (
                    <div className="mt-3 p-2 bg-dark-800 rounded-lg inline-block">
                      <p className="text-primary-500">{newDocument.file.name}</p>
                      <p className="text-white/50 text-xs">{(newDocument.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setUploadingDocument(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary flex items-center"
              >
                <Upload size={16} className="mr-2" />
                Upload Document
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Documents List */}
      {documentsList.length > 0 ? (
        <div className="space-y-4">
          {documentsList.map(doc => {
            const expiryStatus = checkExpiryStatus(doc.expiryDate);
            
            return (
              <div key={doc.id} className="border border-dark-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative h-32 md:h-auto">
                    <Image 
                      src={doc.thumbnail} 
                      alt={doc.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 md:col-span-3">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <FileText size={18} className="text-primary-500 mr-2" />
                        <h3 className="text-lg font-semibold">{doc.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-white/70 hover:text-white bg-dark-800 rounded-full" title="View Document">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-white/70 hover:text-white bg-dark-800 rounded-full" title="Download Document">
                          <Download size={16} />
                        </button>
                        <button 
                          className="p-2 text-white/70 hover:text-red-500 bg-dark-800 rounded-full" 
                          title="Delete Document"
                          onClick={() => deleteDocument(doc.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-xs mb-1">Document Number</p>
                        <p className="font-medium">{doc.number}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Issued By</p>
                        <div className="flex items-center">
                          <Globe size={14} className="mr-1 text-white/70" />
                          <p>{doc.issuedBy}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Issue Date</p>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-white/70" />
                          <p>{new Date(doc.issuedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs mb-1">Expiry Date</p>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1 text-white/70" />
                          <p className={`${
                            expiryStatus === 'expired' ? 'text-red-500' : 
                            expiryStatus === 'expiring-soon' ? 'text-yellow-500' : ''
                          }`}>
                            {new Date(doc.expiryDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {(expiryStatus === 'expired' || expiryStatus === 'expiring-soon') && (
                      <div className={`flex items-center p-3 rounded-lg mb-4 ${
                        expiryStatus === 'expired' ? 'bg-red-900/20 text-red-400' : 'bg-yellow-900/20 text-yellow-400'
                      }`}>
                        <AlertCircle size={16} className="mr-2" />
                        <p className="text-sm">
                          {expiryStatus === 'expired' 
                            ? 'This document has expired. Please renew it as soon as possible.' 
                            : 'This document will expire soon. Consider renewing it before your next trip.'}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm text-white/60">
                      <div>
                        <p>File: {doc.fileName}</p>
                        <p>Size: {doc.fileSize}</p>
                      </div>
                      <p>
                        Uploaded on {new Date(doc.uploadDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-white/50" />
          </div>
          <h3 className="text-lg font-medium mb-2">No documents uploaded</h3>
          <p className="text-white/70 mb-6">Upload your travel documents for easy access during your trips.</p>
          <button 
            className="btn-primary flex items-center mx-auto"
            onClick={() => setUploadingDocument(true)}
          >
            <Plus size={16} className="mr-2" />
            Add Document
          </button>
        </div>
      )}
    </div>
  );
}
