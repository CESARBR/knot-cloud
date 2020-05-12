import fs from 'fs';

const extractCredentials = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const rawData = fs.readFileSync(filePath);
  const credentials = JSON.parse(rawData);
  return {
    token: credentials.token,
  };
};

export default extractCredentials;
