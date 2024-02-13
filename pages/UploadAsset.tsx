import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

 const CreateAndViewAsset:NextPage = () => {
  const [video, setVideo] = useState<File | undefined>();
  const [eKey, setEKey] = useState<CryptoKey | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": ["*.mp4"],
    },
    maxFiles: 1,
    onDrop,
  });

  useEffect(()=>{

  },[video])
  const encryptData = async () => {
    if(!video)
    {
        console.log("FAILED")
        return;}

    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Export the key as raw data
    const keyData = await window.crypto.subtle.exportKey("raw", key);

    // Encode the key in Base64
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(keyData)));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      key, // from generateKey or importKey above
      await video.arrayBuffer() // ArrayBuffer of data you want to encrypt
    );

    // Concatenate IV and encrypted file into a new ArrayBuffer
    const resultBuffer = new ArrayBuffer(iv.length + encrypted.byteLength);
    new Uint8Array(resultBuffer).set(new Uint8Array(iv), 0);
    new Uint8Array(resultBuffer).set(new Uint8Array(encrypted), iv.length);

    const blob = new Blob([resultBuffer], { type: "application/octet-stream" });
    const publicKeyResponse = await fetch(
        "https://livepeer.studio/api/access-control/public-key",
        {
          headers: {
            Authorization: "Bearer "+process.env.NEXT_PUBLIC_LIVEPEER_API,
          },
        },
      );
      
      const publicKeyData = await publicKeyResponse.json();
      const spkiPublicKey = atob(publicKeyData.spki_public_key);
const publicKeyBuffer = Uint8Array.from(atob(spkiPublicKey), (c) =>
  c.charCodeAt(0),
).buffer;

// Import the public key
const publicKey = await window.crypto.subtle.importKey(
  "spki",
  publicKeyBuffer,
  {
    name: "RSA-OAEP",
    hash: { name: "SHA-256" },
  },
  false,
  ["encrypt"],
);

// Encrypt the key data with the public key
const encryptedKeyData = await window.crypto.subtle.encrypt(
  {
    name: "RSA-OAEP",
  },
  publicKey,
  keyData,
);

// Base64 encode the encrypted key data
const encryptedKeyBase64 = btoa(
  String.fromCharCode(...new Uint8Array(encryptedKeyData)),
);
console.log("HEREUPLOADING",)
const response = await fetch(
    "https://livepeer.studio/api/asset/request-upload",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer "+ process.env.NEXT_PUBLIC_LIVEPEER_API,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "File name",
        encryption: {
          encryptedKey: encryptedKeyBase64,
        },
        playbackPolicy: {
          type:'public',
        },
      }),
    },
  );
  
  if (!response.ok) {
    alert("Error requesting upload URL");
    return;
  }
  
  const data = await response.json();
  
  // Upload the encrypted file to the returned URL
  const uploadResponse = await fetch(data.url, {
    method: "PUT",
    body: blob,
  });
  };
  
  encryptData();
  return (
    <>
      <div className="flex text-black bg-gray-400 w-[600px] h-[80vh] border-2 border-black border-dashed text-[80x]"{...getRootProps()} style={{
        
      }}>

        <input {...getInputProps()} />
        <p>Drag and drop or browse files</p>
      </div>

      {video ? <p>{video.name}</p> : <p>Select a video file to upload.</p>}
    </>
  );
};

export default CreateAndViewAsset