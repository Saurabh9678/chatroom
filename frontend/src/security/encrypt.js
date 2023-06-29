    import crypto from "crypto"

    // Encryption
    const encryptData=(data, publicKey)=> {
    const encryptedData = crypto.publicEncrypt(
        publicKey,
        Buffer.from(data, "utf8")
    );
    return encryptedData.toString("base64");
    }

    export default encryptData