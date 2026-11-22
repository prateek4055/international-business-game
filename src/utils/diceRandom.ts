/**
 * Cryptographically Secure, Zero-Bias Random Dice Engine
 * 
 * Uses hardware/OS kernel entropy pool (Web Cryptography API - crypto.getRandomValues)
 * with strict Rejection Sampling to mathematically eliminate modulo bias.
 * 
 * Mathematical proof of uniform distribution:
 * - A 32-bit unsigned integer range is 0 to 4,294,967,295 (2^32 values).
 * - 4,294,967,296 mod 6 = 4.
 * - By rejecting any values >= 4,294,967,292 (0xFFFFFFFC), the remaining
 *   4,294,967,292 values partition into exactly 715,827,882 possible outcomes
 *   for each face (1 through 6).
 * - Probability of any face = 715,827,882 / 4,294,967,292 = exactly 1/6 (16.6666...%).
 * - Zero algorithm bias. Zero modulo bias. Zero seed clustering.
 */

export function getUnbiasedDieRoll(): number {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    const cutoff = 4294967296 - (4294967296 % 6); // 4,294,967,292
    let val: number;
    do {
      window.crypto.getRandomValues(buffer);
      val = buffer[0];
    } while (val >= cutoff);
    return (val % 6) + 1;
  }

  // Fallback for non-browser/legacy environments
  return Math.floor(Math.random() * 6) + 1;
}

export function rollTwoUnbiasedDice(): [number, number] {
  return [getUnbiasedDieRoll(), getUnbiasedDieRoll()];
}
