exports.normalizeKenyanPhone = (phone) => {
  let p = phone.trim();

  if (p.startsWith("0")) return "+254" + p.slice(1);
  if (p.startsWith("254")) return "+" + p;
  if (p.startsWith("+254")) return p;

  throw new Error("Invalid phone number");
};
