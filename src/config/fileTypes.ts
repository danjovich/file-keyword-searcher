// only .pdf, .docx, .doc and .xlsx files are allowed
const mimeTypeByExtension = {
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const fileTypes = {
  mimeTypeByExtension,
  extensions: Object.keys(mimeTypeByExtension),
  mimeTypes: Object.values(mimeTypeByExtension),
};

export default fileTypes;
