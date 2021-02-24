const crypto = require("crypto");

const iv = Buffer.allocUnsafe(16);
const key = crypto
  .createHash("sha256")
  .update(String(process.env.CIPHER_KEY))
  .digest("hex")
  .substr(0, 32);

/**
 * @description Encrypt a given value
 * @param {UTF-8} text Text to be encrypted
 */
const encrypt = (text) => {
  const cipher = crypto.createCipheriv("aes256", key, iv);
  var encryptedKey = cipher.update(text, "utf-8", "hex");
  const encryptedText = (encryptedKey += cipher.final("hex"));
  return encryptedText;
};

/**
 * @description Encrypt a given value
 * @param {HEX} encryptedText Text to be decrypted
 */
const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv("aes256", key, iv);
  var decryptedKey = decipher.update(encryptedText, "hex", "utf-8");
  const decryptedText = (decryptedKey += decipher.final("utf-8"));
  return decryptedText;
};

module.exports = {
  encrypt,
  decrypt,
};
