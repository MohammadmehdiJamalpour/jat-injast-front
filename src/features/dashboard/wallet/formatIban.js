const formatIban = (value = "") => {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const body    = cleaned.startsWith("IR") ? cleaned.slice(2) : cleaned;
  const groups  = body.match(/.{1,4}/g) || [];
  return `IR-${groups.join("-")}`;
};

export default formatIban;
