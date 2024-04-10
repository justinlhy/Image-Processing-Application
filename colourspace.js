// Function to convert image to YCbCr filter
function convertToTCbCr(inputImage) {
    let tcbrImage = createImage(inputImage.width, inputImage.height);
    tcbrImage.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, tcbrImage.width, tcbrImage.height);
  
    tcbrImage.loadPixels();
    // Process each pixel in the image
    for (let i = 0; i < tcbrImage.pixels.length; i += 4) {
        let r = tcbrImage.pixels[i];
        let g = tcbrImage.pixels[i + 1];
        let b = tcbrImage.pixels[i + 2];
  
        //Convert RGB colouring to YCbCr color space
        let Y = 0.299 * r + 0.587 * g + 0.114 * b;
        let Cb = -0.1687 * r - 0.3313 * g + 0.5 * b + 128;
        let Cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 128;
  
        // Update the pixel value in YCbCr color space
        tcbrImage.pixels[i] = Y;
        tcbrImage.pixels[i + 1] = Cb;
        tcbrImage.pixels[i + 2] = Cr;
    }
    tcbrImage.updatePixels();
  
    return tcbrImage;
  }
  
  // Function to convert image to HSV filter
  function convertToHSV(inputImage) {
    let hsvImage = createImage(inputImage.width, inputImage.height);
    hsvImage.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, hsvImage.width, hsvImage.height);
  
    hsvImage.loadPixels();
    // Process each pixel in the image
    for (let i = 0; i < hsvImage.pixels.length; i += 4) {
        let r = hsvImage.pixels[i] / 255;
        let g = hsvImage.pixels[i + 1] / 255;
        let b = hsvImage.pixels[i + 2] / 255;
  
        // Calculate min, max and delta value for RGB
        let maxVal = max(r, g, b);
        let minVal = min(r, g, b);
        let delta = maxVal - minVal;

        // Calculate the HSV values
        let hue = 0;
        let saturation = 0;
        let value = maxVal * 100;
  
        if (delta !== 0) {
            if (maxVal === r) {
                hue = (g - b) / delta + (g < b ? 6 : 0);
            } else if (maxVal === g) {
                hue = (b - r) / delta + 2;
            } else {
                hue = (r - g) / delta + 4;
            }
  
            saturation = delta / maxVal * 100;
        }
  
        // Update the pixel value in HSV color space
        hsvImage.pixels[i] = hue * 60;
        hsvImage.pixels[i + 1] = saturation;
        hsvImage.pixels[i + 2] = value;
    }
    hsvImage.updatePixels();
  
    return hsvImage;
  }