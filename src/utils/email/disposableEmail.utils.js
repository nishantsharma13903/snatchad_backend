const disposable = require("disposable-email-domains");

exports.isDisposableEmail = (email) => {
  const domain = email.split("@")[1];
  return disposable.includes(domain);
};
