type RpcErrorLike = {
  code?: string;
  message?: string;
};

export function isMissingRpcError(error: RpcErrorLike | null | undefined) {
  if (!error) {
    return false;
  }

  return (
    error.code === "PGRST202" ||
    error.message?.includes("Could not find the function") === true ||
    error.message?.includes("schema cache") === true
  );
}
