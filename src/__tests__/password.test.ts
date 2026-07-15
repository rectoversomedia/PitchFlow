/**
 * Unit Tests for Password Utilities
 *
 * Run with: npm test
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSecurePassword,
} from '@/lib/password'

describe('Password Utilities', () => {
  // Increase timeout for bcrypt operations (12 rounds = slow)
  const bcryptTimeout = 30000

  describe('hashPassword', () => {
    it('should hash a valid password', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hashes are long
      expect(hash.startsWith('$2')).toBe(true) // bcrypt prefix
    })

    it('should throw error for short password', async () => {
      const shortPassword = 'abc'

      await expect(hashPassword(shortPassword)).rejects.toThrow(
        'Password must be at least 8 characters'
      )
    })

    it('should throw error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow(
        'Password must be at least 8 characters'
      )
    })

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!'

      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      // bcrypt uses salt, so hashes should be different
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      const result = await verifyPassword(password, hash)
      expect(result).toBe(true)
    })

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!'
      const hash = await hashPassword(password)

      const result = await verifyPassword('WrongPassword123!', hash)
      expect(result).toBe(false)
    })

    it('should return false for empty plain password', async () => {
      const hash = await hashPassword('TestPassword123!')

      const result = await verifyPassword('', hash)
      expect(result).toBe(false)
    }, bcryptTimeout)

    it('should return false for empty hash', async () => {
      const result = await verifyPassword('TestPassword123!', '')
      expect(result).toBe(false)
    })

    it('should return false for invalid hash format', async () => {
      const result = await verifyPassword('TestPassword123!', 'not-a-valid-hash')
      expect(result).toBe(false)
    })
  })

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = validatePasswordStrength('StrongPass123!')

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject password shorter than 8 characters', () => {
      const result = validatePasswordStrength('Aa1!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password minimal 8 karakter')
    })

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('password123!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password harus mengandung minimal 1 huruf besar')
    })

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('PASSWORD123!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password harus mengandung minimal 1 huruf kecil')
    })

    it('should reject password without numbers', () => {
      const result = validatePasswordStrength('PasswordABC!')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password harus mengandung minimal 1 angka')
    })

    it('should reject password without special characters', () => {
      const result = validatePasswordStrength('Password12345')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password harus mengandung minimal 1 karakter spesial (!@#$%^&*)')
    })

    it('should return multiple errors for weak password', () => {
      const result = validatePasswordStrength('weak')

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    it('should accept Indonesian special characters', () => {
      const result = validatePasswordStrength('Password123@') // @ is allowed
      expect(result.isValid).toBe(true)
    })
  })

  describe('generateSecurePassword', () => {
    it('should generate password of specified length', () => {
      const password = generateSecurePassword(20)
      expect(password.length).toBe(20)
    })

    it('should generate password with default length of 16', () => {
      const password = generateSecurePassword()
      expect(password.length).toBe(16)
    })

    it('should contain uppercase letter', () => {
      const password = generateSecurePassword()
      expect(/[A-Z]/.test(password)).toBe(true)
    })

    it('should contain lowercase letter', () => {
      const password = generateSecurePassword()
      expect(/[a-z]/.test(password)).toBe(true)
    })

    it('should contain number', () => {
      const password = generateSecurePassword()
      expect(/[0-9]/.test(password)).toBe(true)
    })

    it('should contain special character', () => {
      const password = generateSecurePassword()
      expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true)
    })

    it('should generate unique passwords', () => {
      const passwords = new Set()
      for (let i = 0; i < 100; i++) {
        passwords.add(generateSecurePassword())
      }
      // All passwords should be unique
      expect(passwords.size).toBe(100)
    })
  })
})

describe('Password Integration', () => {
  // Increase timeout for bcrypt operations (12 rounds = slow)
  const bcryptTimeout = 30000

  it('should hash and verify password correctly', async () => {
    const originalPassword = 'MySecurePassword123!'

    const hash = await hashPassword(originalPassword)
    const isValid = await verifyPassword(originalPassword, hash)
    const isInvalid = await verifyPassword('WrongPassword!', hash)

    expect(isValid).toBe(true)
    expect(isInvalid).toBe(false)
  }, bcryptTimeout)

  it('should meet strength requirements after generation', () => {
    const password = generateSecurePassword()
    const validation = validatePasswordStrength(password)

    expect(validation.isValid).toBe(true)
  })
})
