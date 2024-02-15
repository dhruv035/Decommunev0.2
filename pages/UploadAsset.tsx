import { Button, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getPublicKey, } from "../frontend-services/livepeer";
import { requestUpload } from "../frontend-services/assets";
const CreateAndViewAsset: NextPage = () => {
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

  useEffect(() => {}, [video]);
  const encryptData = async () => {
    if (!video) {
      return;
    }
    console.log("A")

    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-CBC",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    console.log("A2")
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
    console.log("A3")

    // Concatenate IV and encrypted file into a new ArrayBuffer
    const resultBuffer = new ArrayBuffer(iv.length + encrypted.byteLength);
    new Uint8Array(resultBuffer).set(new Uint8Array(iv), 0);
    new Uint8Array(resultBuffer).set(new Uint8Array(encrypted), iv.length);

    const blob = new Blob([resultBuffer], { type: "application/octet-stream" });
    const publicKeyData = await getPublicKey();
    const spkiPublicKey = atob(publicKeyData.spki_public_key);
    const publicKeyBuffer = Uint8Array.from(atob(spkiPublicKey), (c) =>
      c.charCodeAt(0)
    ).buffer;
    console.log("A4")

    // Import the public key
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      publicKeyBuffer,
      {
        name: "RSA-OAEP",
        hash: { name: "SHA-256" },
      },
      false,
      ["encrypt"]
    );
    console.log("A5")

    // Encrypt the key data with the public key
    const encryptedKeyData = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      keyData
    );

    // Base64 encode the encrypted key data
    const encryptedKeyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedKeyData))
    );
    const response = await requestUpload({
      name: "ABC",
      encryption: {
        encryptedKey: encryptedKeyBase64,
      },
      playbackPolicy: {
       type:"jwt"
      },
    })
    
    console.log("A6")
    
    if (!response.ok) {
      const data=await response.json()
      alert("Error requesting upload URL");
      return;
    }
    
    const data = await response.json();
    // Upload the encrypted file to the returned URL
    const uploadResponse = await fetch(data.url, {
      method: "PUT",
      body: blob,
    });
    setVideo(undefined);
    console.log("A7")
  };
  return (
    <>
      {video === undefined && (
        <div
          className="flex text-black bg-white w-[60vw] h-[60vh] mt-10 items-center justify-center border-2 border-black border-dashed text-[80x]"
          {...getRootProps()}
          style={{}}
        >
          <input {...getInputProps()} />
          <Heading color={`rgba(125,125,125,0.6)`} fontSize={[32, 40, 48]}>
            Drag and Drop here or Click
          </Heading>
        </div>
      )}
      {video ? (
        <div>
          <p className="">{video.name}</p>
          <Button
            className=""
            onClick={() => {
              encryptData();
            }}
          >
            Upload
          </Button>
        </div>
      ) : (
        <p>Select a video file to upload.</p>
      )}
    </>
  );
};

export default CreateAndViewAsset;
