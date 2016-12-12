/*
Verify that passwords:
  - (?=.*[a-z])	contain at least 1 lowercase alphabetical character
  - (?=.*[A-Z])	contain at least 1 uppercase alphabetical character
  - (?=.*[0-9])	contain at least 1 numeric character
  - (?=.*[!@#\$%\^&\*])	contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
  - (?=.{8,})	be eight characters or longer
*/
function isValidPassword(password) {
  if (!password) {
    return false;
  }
  var strongPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  return strongPassword.test(password);
}

module.exports = isValidPassword;
