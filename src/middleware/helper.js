import bcrypt from "bcrypt";
function sendFlash(res, type, text) {
  res.render("register/index", { flash: { type, text } });
}
export function validateUser(req, res, user) {
  if (user.firstName.length < 2 || user.firstName.length > 50) {
    return sendFlash(res, "danger", "First name must be 2-50 characters.");
  }

  if (user.lastName.length < 2 || user.lastName.length > 50) {
    return sendFlash(res, "danger", "Last name must be 2-50 characters.");
  }

  if (user.address.length < 2 || user.address.length > 50) {
    return sendFlash(res, "danger", "Address must be 2-50 characters.");
  }

  if (user.city.length < 2 || user.city.length > 30) {
    return sendFlash(res, "danger", "City must be 2-30 characters.");
  }

  if (!/^\d{5}$/.test(user.zipCode)) {
    console.log("HIT");
    return sendFlash(res, "danger", "Zip code must be 5 digits.");
  }

  if (user.password.length < 5 || user.password.length > 30) {
    return sendFlash(res, "danger", "Password must be 5-30 characters.");
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(email, password) {
  const [rows] = await pool.query("Select * FROM members where email = ? ", [
    email,
  ]);
  console.log(rows)
  /* return bcrypt.compare(candidatePassword, password); */
}
