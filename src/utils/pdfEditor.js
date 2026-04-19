import * as FileSystem from 'expo-file-system/legacy';
import { PDFDocument } from 'pdf-lib';
import * as Sharing from 'expo-sharing';

// Read Uri to Base64
async function readPdfAsBase64(uri) {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

// Generate temp path
function getOutputPath(prefix = 'PDF') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${FileSystem.documentDirectory}${prefix}_${timestamp}.pdf`;
}

/**
 * Merge an array of PDF File URIs into one.
 * @param {Array<string>} uris
 */
export async function mergePdfs(uris) {
  if (!uris || uris.length < 2) {
    throw new Error('Please select at least 2 PDFs to merge.');
  }

  const mergedPdf = await PDFDocument.create();

  for (const uri of uris) {
    const base64 = await readPdfAsBase64(uri);
    const pdf = await PDFDocument.load(base64, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const finalBase64 = await mergedPdf.saveAsBase64();
  const destPath = getOutputPath('Merged');
  
  await FileSystem.writeAsStringAsync(destPath, finalBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return destPath;
}

/**
 * Split a PDF at specific page intervals (e.g. 1 file per page).
 * For MVP, we will split the document so EVERY page becomes a separate PDF.
 * @param {string} uri
 */
export async function splitPdfAllPages(uri) {
  if (!uri) throw new Error('No PDF selected.');

  const base64 = await readPdfAsBase64(uri);
  const srcPdf = await PDFDocument.load(base64, { ignoreEncryption: true });
  const pageCount = srcPdf.getPageCount();

  const generatedUris = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
    newPdf.addPage(copiedPage);

    const destPath = getOutputPath(`Split_Page_${i + 1}`);
    const finalBase64 = await newPdf.saveAsBase64();
    await FileSystem.writeAsStringAsync(destPath, finalBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    generatedUris.push(destPath);
  }

  return generatedUris;
}

/**
 * Share/open the generated PDF.
 */
export async function sharePdf(uri) {
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Save or Share PDF',
      UTI: 'com.adobe.pdf',
    });
  } else {
    throw new Error('Sharing is not available on this device');
  }
}
