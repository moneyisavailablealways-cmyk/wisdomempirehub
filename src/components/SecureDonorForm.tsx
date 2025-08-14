import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { User, Mail, DollarSign, Lock, Shield, AlertTriangle } from 'lucide-react';
import CryptoJS from 'crypto-js';

export const SecureDonorForm = () => {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    donationAmount: '',
    password: ''
  });
  
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);

  // Encryption key (in production, this should be from environment variables)
  const ENCRYPTION_KEY = 'your-32-character-secret-key-here!!';

  // Password validation
  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  // Generate 6-digit OTP
  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpExpiry(new Date(Date.now() + 7 * 60 * 1000)); // 7 minutes from now
    setIsOtpGenerated(true);
    setErrors([]);
    alert(`OTP Generated: ${newOtp} (Valid for 7 minutes)`);
  };

  // Check if OTP is expired
  const isOtpExpired = (): boolean => {
    if (!otpExpiry) return true;
    return new Date() > otpExpiry;
  };

  // Validate OTP
  const validateOtp = (): boolean => {
    if (!generatedOtp) {
      setErrors(['Please generate OTP first']);
      return false;
    }
    
    if (isOtpExpired()) {
      setErrors(['OTP has expired. Please generate a new one.']);
      return false;
    }
    
    if (otp !== generatedOtp) {
      setErrors(['Incorrect OTP. Please try again.']);
      return false;
    }
    
    return true;
  };

  // Encrypt data using AES
  const encryptData = (data: string): { encrypted: string; iv: string } => {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return {
      encrypted: encrypted.toString(),
      iv: iv.toString()
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    // Validate all fields
    if (!formData.donorName.trim()) validationErrors.push('Donor name is required');
    if (!formData.donorEmail.trim()) validationErrors.push('Donor email is required');
    if (!formData.donationAmount.trim()) validationErrors.push('Donation amount is required');
    if (!formData.password) validationErrors.push('Password is required');

    // Validate password strength
    if (formData.password && !validatePassword(formData.password)) {
      validationErrors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Validate OTP
    if (!validateOtp()) {
      return; // OTP validation will set its own errors
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Encrypt donor information
    const donorData = {
      name: formData.donorName,
      email: formData.donorEmail,
      amount: formData.donationAmount
    };

    const encryptedName = encryptData(formData.donorName);
    const encryptedEmail = encryptData(formData.donorEmail);
    const encryptedAmount = encryptData(formData.donationAmount);

    // Log encrypted data to console
    console.log('Encrypted Donor Data:', {
      name: encryptedName,
      email: encryptedEmail,
      amount: encryptedAmount,
      timestamp: new Date().toISOString()
    });

    // Clear form and show success
    setFormData({ donorName: '', donorEmail: '', donationAmount: '', password: '' });
    setOtp('');
    setGeneratedOtp('');
    setOtpExpiry(null);
    setIsOtpGenerated(false);
    setErrors([]);
    
    alert('Donation submitted securely! Check console for encrypted data.');
  };

  // Handle input changes
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]); // Clear errors when user starts typing
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Donor Form
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {errors.length > 0 && (
            <Alert className="mb-4" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Donor Name */}
            <div>
              <Label htmlFor="donorName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Donor Name *
              </Label>
              <Input
                id="donorName"
                type="text"
                value={formData.donorName}
                onChange={(e) => handleInputChange('donorName', e.target.value)}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            {/* Donor Email */}
            <div>
              <Label htmlFor="donorEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Donor Email *
              </Label>
              <Input
                id="donorEmail"
                type="email"
                value={formData.donorEmail}
                onChange={(e) => handleInputChange('donorEmail', e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            {/* Donation Amount */}
            <div>
              <Label htmlFor="donationAmount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Donation Amount *
              </Label>
              <Input
                id="donationAmount"
                type="number"
                min="1"
                step="0.01"
                value={formData.donationAmount}
                onChange={(e) => handleInputChange('donationAmount', e.target.value)}
                placeholder="Enter amount"
                required
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Secure Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                required
                className="mt-1"
              />
              {formData.password && !validatePassword(formData.password) && (
                <p className="text-xs text-destructive mt-1">
                  Password must meet all requirements
                </p>
              )}
            </div>

            {/* OTP Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security OTP
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateOtp}
                  className="text-xs"
                >
                  Generate OTP
                </Button>
              </div>
              
              {isOtpGenerated && (
                <div className="space-y-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {otpExpiry && (
                    <p className="text-xs text-muted-foreground">
                      OTP expires at: {otpExpiry.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={!isOtpGenerated || !otp || otp.length !== 6}
              >
                Submit Securely
              </Button>
            </div>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            All data is encrypted using AES-256 before transmission.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};