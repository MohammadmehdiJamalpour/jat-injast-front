// utils/formatIban.js
// Helper – format Iranian IBANs, kept in its own file so every section can reuse it.
const formatIban = (value = "") => {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // keep A-Z,0-9
  const body    = cleaned.startsWith("IR") ? cleaned.slice(2) : cleaned; // strip leading IR
  const groups  = body.match(/.{1,4}/g) || [];                            // split 4-char chunks
  return `IR-${groups.join("-")}`;                                        // IR-xxxx-xxxx-…
};

export default formatIban;
