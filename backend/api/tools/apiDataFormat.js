function result(result) {
  return {
    ok: true,
    result,
  };
}

function error(error) {
  return {
    ok: false,
    error,
  };
}

export { result, error };
