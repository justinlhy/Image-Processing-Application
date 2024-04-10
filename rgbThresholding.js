// Function for black and white thresholding
function blackAndWhiteThresholdImage(inputImage, threshold) {
    let thresholdedImage = createImage(inputImage.width, inputImage.height);
    thresholdedImage.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, thresholdedImage.width, thresholdedImage.height);

    thresholdedImage.loadPixels();
    for (let i = 0; i < thresholdedImage.pixels.length; i += 4) {
        let pixelRed = thresholdedImage.pixels[i];
        let pixelGreen = thresholdedImage.pixels[i + 1];
        let pixelBlue = thresholdedImage.pixels[i + 2];

        // Calculate grayscale value using the formula: 0.299 * R + 0.587 * G + 0.114 * B
        let grayscaleValue = 0.299 * pixelRed + 0.587 * pixelGreen + 0.114 * pixelBlue;

        // Set the pixel to black (0) or white (255) based on the thresholding
        let newColor = (grayscaleValue > threshold) ? 255 : 0;

        // Updating color channels with the new color
        thresholdedImage.pixels[i] = newColor;
        thresholdedImage.pixels[i + 1] = newColor;
        thresholdedImage.pixels[i + 2] = newColor;

        // Setting the alpha channel to the original alpha value
        thresholdedImage.pixels[i + 3] = thresholdedImage.pixels[i + 3];
    }
    thresholdedImage.updatePixels();

    return thresholdedImage;
}

// Function to Thresholding depths 
function applyThreshold(inputImage, threshold) {
    let thresholdedImage = createImage(inputImage.width, inputImage.height);
    thresholdedImage.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, thresholdedImage.width, thresholdedImage.height);

    thresholdedImage.loadPixels();
    for (let i = 0; i < thresholdedImage.pixels.length; i += 4) {
        let pixelRed = thresholdedImage.pixels[i];
        let pixelGreen = thresholdedImage.pixels[i + 1];
        let pixelBlue = thresholdedImage.pixels[i + 2];

        // Thresholding for R channel
        pixelRed = (redSlider.value() > pixelRed) ? 0 : pixelRed;

        // Thresholding for G channel
        pixelGreen = (greenSlider.value() > pixelGreen) ? 0 : pixelGreen;

        // Thresholding for B channel
        pixelBlue = (blueSlider.value() > pixelBlue) ? 0 : pixelBlue;

        // Update the pixels with thresholded values
        thresholdedImage.pixels[i] = pixelRed;
        thresholdedImage.pixels[i + 1] = pixelGreen;
        thresholdedImage.pixels[i + 2] = pixelBlue;

        // Setting the alpha channel to the original alpha value
        thresholdedImage.pixels[i + 3] = thresholdedImage.pixels[i + 3];
    }
    thresholdedImage.updatePixels();

    return thresholdedImage;
}