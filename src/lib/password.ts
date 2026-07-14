/**
 * Password Utilities for PitchFlow
 * Secure password hashing using bcrypt
 */

import bcrypt from 'bcryptjs'

// Salt rounds for bcrypt (10-12 is recommended for production)
const BCRYPT_SALT_ROUNDS = 12

/**
 * Hash a plain text password
 * @param plainPassword - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters')
  }

  const hashedPassword = await bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS)
  return hashedPassword
}

/**
 * Verify a plain text password against a hashed password
 * @param plainPassword - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  if (!plainPassword || !hashedPassword) {
    return false
  }

  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword)
    return isValid
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

/**
 * Validate password strength
 * @param password - The password to validate
 * @returns Object with validation result and error message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password minimal 8 karakter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf besar')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf kecil')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 angka')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 karakter spesial (!@#$%^&*)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a secure random password
 * @param length - Password length (default 16)
 * @returns A secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = uppercase + lowercase + numbers + specials

  let password = ''

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += specials[Math.floor(Math.random() * specials.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
