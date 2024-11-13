// Import bcrypt
import bcrypt from "bcryptjs";

// The password to hash
const password = "1234";

// Generate a salt and hash the password
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(`Hashed Password: ${hashedPassword}`);
