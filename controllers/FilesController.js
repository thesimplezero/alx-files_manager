import dbClient from '../utils/db';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const FilesController = {
  // Endpoint to upload a file
  postUpload: async (req, res) => {
    try {
      const { name, type, parentId = '0', isPublic = false, data } = req.body;
      const userId = req.userId; // Assumes userId is set in the request, possibly by auth middleware

      // Define a new file document
      const file = { _id: uuidv4(), name, type, parentId, isPublic, userId };

      // Attempt to insert the new file document
      const result = await dbClient.files.insertOne(file);
      if (result.insertedCount !== 1) throw new Error('Database insertion failed.');

      // Define storage path and write file data to disk
      const storagePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const filePath = `${storagePath}/${file._id}`;
      await fs.writeFile(filePath, Buffer.from(data, 'base64'));

      res.status(201).send(file);
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).send({ error: error.message });
    }
  },
};

module.exports = FilesController;
