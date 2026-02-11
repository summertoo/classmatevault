/**
 * 使用钱包签名加密数据
 * 简单实现：将数据与钱包签名结合
 */
export async function encryptWithWallet(message: string, signMessageFn: (message: Uint8Array) => Promise<{ signature: Uint8Array }>): Promise<string> {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const { signature } = await signMessageFn(messageBytes);
    // 将签名作为密钥使用（简化实现，实际应使用更安全的加密方式）
    const signatureHex = Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');
    // 简单异或加密
    const encrypted = Array.from(messageBytes).map((byte, i) => {
      const keyByte = parseInt(signatureHex.substr(i % signatureHex.length, 2), 16);
      return (byte ^ keyByte).toString(16).padStart(2, '0');
    }).join('');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

/**
 * 使用钱包签名解密数据
 */
export async function decryptWithWallet(encryptedData: string, signMessageFn: (message: Uint8Array) => Promise<{ signature: Uint8Array }>): Promise<string> {
  try {
    // 使用相同的消息获取签名
    const messageBytes = new TextEncoder().encode('decrypt_key');
    const { signature } = await signMessageFn(messageBytes);
    const signatureHex = Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');
    // 简单异或解密
    const decryptedBytes = encryptedData.match(/.{1,2}/g)?.map((hex, i) => {
      const encryptedByte = parseInt(hex, 16);
      const keyByte = parseInt(signatureHex.substr(i % signatureHex.length, 2), 16);
      return encryptedByte ^ keyByte;
    }) || [];
    return new TextDecoder().decode(new Uint8Array(decryptedBytes));
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
}