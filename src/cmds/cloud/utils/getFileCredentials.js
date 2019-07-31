import fs from 'fs';

const extractCredentials = (filePath) => {
  const rawData = fs.readFileSync(filePath);
  const credentials = JSON.parse(rawData);
  return {
    'client-id': credentials.knot.id,
    'client-token': credentials.token,
  };
};

export default extractCredentials;
