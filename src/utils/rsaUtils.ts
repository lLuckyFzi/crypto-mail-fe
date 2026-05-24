// menghitung eksponensial modular: (base^exponent) % modulus
const modExp = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
    let result = 1n;
    let b = base % modulus;
    let e = exponent;

    while (e > 0n) {
        if (e % 2n === 1n) result = (result * b) % modulus;
        e = e / 2n;
        b = (b * b) % modulus;
    }
    return result;
};

// Fungsi Enkripsi C = M^e mod n
export const encryptRSA = (text: string, eStr: string, nStr: string): string => {
    if (!text) return '';
    const e = BigInt(eStr);
    const n = BigInt(nStr);
    
    const encryptedArray = text.split('').map(char => {
        const m = BigInt(char.charCodeAt(0));
        return modExp(m, e, n).toString();
    });
    
    return `[ ${encryptedArray.join(', ')} ]`;
};

// Fungsi Dekripsi M = C^d mod n
export const decryptRSA = (ciphertext: string, dStr: string, nStr: string): string => {
    try {
        const d = BigInt(dStr);
        const n = BigInt(nStr);
        
        const cleanStr = ciphertext.replace(/\[|\]/g, '').trim();
        if (!cleanStr) return '';
        
        const encryptedArray = cleanStr.split(',').map(s => s.trim());
        
        const decryptedText = encryptedArray.map(c => {
            const cipherChar = BigInt(c);
            const m = modExp(cipherChar, d, n);
            return String.fromCharCode(Number(m));
        });
        
        return decryptedText.join('');
    } catch (error) {
        throw new Error("Gagal mendekripsi pesan. Format kunci atau ciphertext tidak valid.");
    }
};

// ekstrak d dan n dari string Private Key
export const parsePrivateKey = (privateKeyString: string) => {
    const dMatch = privateKeyString.match(/d=(\d+)/);
    const nMatch = privateKeyString.match(/n=(\d+)/);
    
    if (!dMatch || !nMatch) {
        throw new Error("Format Private Key tidak valid.");
    }
    return { d: dMatch[1], n: nMatch[1] };
};