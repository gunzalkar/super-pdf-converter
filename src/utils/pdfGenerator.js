import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

// Page dimensions in points (1mm = 2.8346pt)
const PAGE_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  A3: { width: 841.89, height: 1190.55 },
  A5: { width: 419.53, height: 595.28 },
  LETTER: { width: 612, height: 792 },
  LEGAL: { width: 612, height: 1008 },
  TABLOID: { width: 792, height: 1224 },
};

/**
 * Convert a file URI to a base64 data URL.
 */
async function uriToBase64DataUrl(uri, mimeType = 'image/jpeg') {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Detect mime from extension if not provided
    const ext = uri.split('.').pop().toLowerCase();
    const mimeMap = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      bmp: 'image/bmp',
      webp: 'image/webp',
      gif: 'image/gif',
      tiff: 'image/tiff',
      tif: 'image/tiff',
      heic: 'image/heic',
      heif: 'image/heif',
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
    };
    const resolvedMime = mimeType && mimeType !== 'image/jpeg' ? mimeType : (mimeMap[ext] || 'image/jpeg');
    return `data:${resolvedMime};base64,${base64}`;
  } catch (err) {
    console.warn('Failed to read image:', uri, err);
    return null;
  }
}

/**
 * Build an HTML string with each image on a separate PDF page.
 */
async function buildHtml(images, settings) {
  const page = PAGE_SIZES[settings.pageSize] || PAGE_SIZES.A4;
  const isLandscape = settings.orientation === 'landscape';
  const w = isLandscape ? page.height : page.width;
  const h = isLandscape ? page.width : page.height;
  const margin = settings.margin || 20;

  const pages = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    // Copy to cache if needed (HEIC conversion relies on system decoder)
    let uri = img.uri;
    if (!uri.startsWith('file://') && !uri.startsWith('data:')) {
      uri = 'file://' + uri;
    }

    const dataUrl = await uriToBase64DataUrl(uri, img.mimeType);
    if (!dataUrl) continue;

    pages.push(`
      <div class="page">
        <img src="${dataUrl}" />
      </div>
    `);
  }

  const qualityPct = Math.round((settings.quality || 0.85) * 100);
  const imgCss = `
    filter: none;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  `;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page {
    size: ${w}pt ${h}pt;
    margin: ${margin}pt;
  }
  body {
    width: ${w}pt;
    background: white;
  }
  .page {
    width: 100%;
    height: ${h - margin * 2}pt;
    display: flex;
    align-items: center;
    justify-content: center;
    page-break-after: always;
    overflow: hidden;
  }
  .page img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    ${imgCss}
  }
</style>
</head>
<body>
  ${pages.join('')}
</body>
</html>
  `.trim();
}

/**
 * Main function: generate PDF from images and settings.
 * Returns the saved file URI.
 */
export async function generatePdf(images, settings) {
  if (!images || images.length === 0) {
    throw new Error('No images selected');
  }

  // Request media library permission for saving
  const { status } = await MediaLibrary.requestPermissionsAsync();

  // Build the HTML
  const html = await buildHtml(images, settings);

  // Print to PDF
  const page = PAGE_SIZES[settings.pageSize] || PAGE_SIZES.A4;
  const isLandscape = settings.orientation === 'landscape';
  const w = Math.round(isLandscape ? page.height : page.width);
  const h = Math.round(isLandscape ? page.width : page.height);

  const { uri } = await Print.printToFileAsync({
    html,
    width: w,
    height: h,
    base64: false,
  });

  // Move to a permanent location with a descriptive name
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const destPath = `${FileSystem.documentDirectory}IMG_to_PDF_${timestamp}.pdf`;

  await FileSystem.moveAsync({ from: uri, to: destPath });

  // Try to save to media library (Downloads on Android)
  if (status === 'granted') {
    try {
      await MediaLibrary.saveToLibraryAsync(destPath);
    } catch (_) {
      // Some Android versions restrict direct library saves for PDFs
    }
  }

  return destPath;
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
