import bcrypt from "bcryptjs";
async function testPassword(password) {
  const hash = bcrypt.hashSync(password, 10);
  const isMatch = await bcrypt.compare(password, hash);
  console.log("Hash:", hash);
  console.log("Is match:", isMatch); // This should log true
}

testPassword("yourTestPassword");
