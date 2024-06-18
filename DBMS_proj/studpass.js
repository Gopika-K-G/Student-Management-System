const bcrypt = require('bcrypt');

const hashPasswords = async () => {
  try {
    const studentPassword = 'kecstud';
    const adminPassword = 'kecadmin';

    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    console.log(`Hashed student password: ${hashedStudentPassword}`);
    console.log(`Hashed admin password: ${hashedAdminPassword}`);
  } catch (err) {
    console.error(err.message);
  }
};

hashPasswords();
