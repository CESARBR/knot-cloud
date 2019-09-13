import fs from 'fs';

const extractCredentials = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const rawData = fs.readFileSync(filePath);
  const credentials = JSON.parse(rawData);
  return {
    'client-id': credentials.uuid ? credentials.uuid : credentials.knot.id,
    'client-token': credentials.token,
  };
};

export default extractCredentials;
