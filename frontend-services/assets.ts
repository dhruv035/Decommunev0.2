export const requestUpload = async (body: any) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + "/asset",
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
  return res;
};
