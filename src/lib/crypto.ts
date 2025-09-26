import CryptoJS from 'crypto-js';
export function encrypt(plaintext: string, key: string): string {
  if (!plaintext || !key) {
    return '';
  }
  try {
    return CryptoJS.AES.encrypt(plaintext, key).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    return '';
  }
}
export function decrypt(ciphertext: string, key: string): string {
  if (!ciphertext || !key) {
    return '';
  }
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    // It's possible for decryption to fail and return an empty string.
    // This can happen with a wrong key.
    if (!decryptedText && ciphertext) {
        console.warn("Decryption resulted in an empty string. This might indicate a wrong key.");
    }
    return decryptedText;
  } catch (error) {
    console.error("Decryption failed:", error);
    return '';
  }
}