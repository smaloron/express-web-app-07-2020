const multer = require('multer');

// Stratégie d'obtention d'un nom unique pour les fichiers
const getUniqueFileName = file => {
  console.log(file);
  const originalName = file.originalname.split(' ').join('-');
  return new Date().getTime() + '_' + originalName;
};

// Définition du mode de traitement
const imageUploadStorage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    console.log(file);
    if (file) {
      // Définition du nom du fichier
      const fileName = getUniqueFileName(file);
      // Stockage du nom dans la request
      req.uploadedFileName = fileName;
      // callback qui effectue la copie du fichier dans la destination
      console.log(fileName);
      callback(null, fileName);
    } else {
      callback(new Error('Fichier absent'));
    }
  },
});

const fileTypeFilter = (req, file, callback) => {
  // Liste des types de fichier autorisés
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

  if (allowedFileTypes.indexOf(file.mimetype) == -1) {
    req.fileTypeError = 'Seulement des images GIF, JPEG ou PNG';
    return callback(null, false);
  }

  callback(null, true);
};

const imageUpload = multer({
  storage: imageUploadStorage,
  fileFilter: fileTypeFilter,
});

module.exports = {
  singlePhoto: imageUpload.single('photo'),
};
