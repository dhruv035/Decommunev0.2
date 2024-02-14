export const getPublicKey = async ()=>{
    const data = await fetch(process.env.NEXT_PUBLIC_BASE_URL+"/livepeer/access-control/publicKey")
    return await data.json();
}

export const requestUpload = async (body:any) => {
    const data = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL+"/livepeer/asset/requestUpload",
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      console.log("DATA",data,data.status)
      return data;
}