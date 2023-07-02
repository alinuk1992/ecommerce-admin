import fs from 'fs';
import multiparty from 'multiparty';
import ImageKit from 'imagekit';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const imagekit = new ImageKit({
    publicKey: process.env.IK_PUBLIC_KEY,
    privateKey: process.env.IK_PRIVATE_KEY,
    urlEndpoint: 'https://ik.imagekit.io/nhbsasqxl/',
  });

  const links = [];
  for (const file of files.file) {
    await imagekit
      .upload({
        file: fs.readFileSync(file.path), //required
        fileName: file.originalFilename, //required
        extensions: [
          {
            name: 'google-auto-tagging',
            maxTags: 5,
            minConfidence: 95,
          },
        ],
      })
      .then((response) => {
        links.push(response.url);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
