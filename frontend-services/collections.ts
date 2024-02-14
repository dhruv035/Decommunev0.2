

export const updateCollectionData = async(collectionId:string,body:any)=>{
    const res = await fetch( process.env.NEXT_PUBLIC_BASE_URL + "/collection/"+collectionId,{
        method:'POST',
        body: JSON.stringify(body)
      })
      if(res.status===200)
      return await res.json()
      
}


export const addContractAddress = async(collectionId:string,contractAddress:`0x${string}`)=>{
    const res = await fetch( process.env.NEXT_PUBLIC_BASE_URL + "/collection/"+collectionId,{
        method:'PUT',
        body: JSON.stringify({contractAddress:contractAddress})
      })
      if(res.status===200)
      return await res.json()
      
}

export const createCollection = async(body:any)=>{
   const data =  await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/collection",
          {
            method: "POST",
            body: JSON.stringify(body),
          }
        )

        if(data.status===200)
        return await data.json()

}