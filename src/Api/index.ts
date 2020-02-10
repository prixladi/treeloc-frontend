type RequestProps = {
  url: string;
};

const getAsync = async ({ url }: RequestProps) => {
  return await fetch(url, { method: "GET" });
};

export { getAsync };
