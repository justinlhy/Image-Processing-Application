// Function for Coloured Thresholding Image
function applyThresholdColourSpace(inputImage, threshold, thresholdSlider) {
    let thresholdedImage = createImage(inputImage.width, inputImage.height);
    thresholdedImage.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, thresholdedImage.width, thresholdedImage.height);

    thresholdedImage.loadPixels();
    for (let i = 0; i < thresholdedImage.pixels.length; i += 4) {
        let pixelRed = thresholdedImage.pixels[i];
        let pixelGreen = thresholdedImage.pixels[i + 1];
        let pixelBlue = thresholdedImage.pixels[i + 2];

        // Calculate intensity of thresholding
        let intensity = calculateIntensity(pixelRed, pixelGreen, pixelBlue);

        // Adjust the intensity based on slider
        intensity = (thresholdSlider.value() > intensity) ? 0 : intensity;

        // Update each channel with thresholded values
        thresholdedImage.pixels[i] = pixelRed * (intensity / 255); // Red channel
        thresholdedImage.pixels[i + 1] = pixelGreen * (intensity / 255); // Green channel
        thresholdedImage.pixels[i + 2] = pixelBlue * (intensity / 255); // Blue channel

        thresholdedImage.pixels[i + 3] = thresholdedImage.pixels[i + 3];
    }
    thresholdedImage.updatePixels();

    return thresholdedImage;
}

function calculateIntensity(red, green, blue) {
    // Calculate intensity 
    return (red + green + blue) / 1.7;
}

function tcbrImageThreshold(inputImage) {
    let tcbrThreshold = tcbrThresholdSlider.value(); 
    let tcbrImage = convertToTCbCr(inputImage);
    let thresholdedImage = applyThresholdColourSpace(tcbrImage, tcbrThreshold, tcbrThresholdSlider);
    return thresholdedImage;
}

function hsvImageThreshold(inputImage) {
    let hsvThreshold = hsvThresholdSlider.value(); 
    let hsvImage = convertToHSV(inputImage);
    let thresholdedImage = applyThresholdColourSpace(hsvImage, hsvThreshold, hsvThresholdSlider);
    return thresholdedImage;
}
