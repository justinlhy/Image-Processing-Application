// Function to convert imaging to Greyscale  
function convertToGrayscale(inputImage) {
    let img = createImage(inputImage.width, inputImage.height);
    img.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, img.width, img.height);

    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let brightnessValue = red(img.pixels[i]) * 0.3 + green(img.pixels[i + 1]) * 0.59 + blue(img.pixels[i + 2]) * 0.11;
        img.pixels[i] = brightnessValue;
        img.pixels[i + 1] = brightnessValue;
        img.pixels[i + 2] = brightnessValue;
    }
    img.updatePixels();

    return img;
}

// Function to convert imaging to Pixelated
function convertToPixelate(inputImage, pixelSize) {
    // Clone the inputImage 
    let pixelatedImage = inputImage.get();
    pixelatedImage.loadPixels();

    // Process block by block
    for (let y = 0; y < pixelatedImage.height; y += pixelSize) {
        for (let x = 0; x < pixelatedImage.width; x += pixelSize) {

            let sumRed = 0;
            let sumGreen = 0;
            let sumBlue = 0;

            // Get the sum of RGB of the processed block
            for (let i = 0; i < pixelSize; i++) {
                for (let j = 0; j < pixelSize; j++) {
                    let pixelIndex = ((pixelatedImage.width * (y + j)) + (x + i)) * 4;
                    let pixelRed = pixelatedImage.pixels[pixelIndex + 0];
                    let pixelGreen = pixelatedImage.pixels[pixelIndex + 1];
                    let pixelBlue = pixelatedImage.pixels[pixelIndex + 2];
                    sumRed += pixelRed;
                    sumGreen += pixelGreen;
                    sumBlue += pixelBlue;
                }
            }

            // Calculate the average of RGB of that block
            let aveRed = sumRed / (pixelSize * pixelSize);
            let aveGreen = sumGreen / (pixelSize * pixelSize);
            let aveBlue = sumBlue / (pixelSize * pixelSize);

            // Paint the block with the average RGB value
            for (let i = 0; i < pixelSize; i++) {
                for (let j = 0; j < pixelSize; j++) {
                    let pixelIndex = ((pixelatedImage.width * (y + j)) + (x + i)) * 4;
                    pixelatedImage.pixels[pixelIndex + 0] = aveRed;
                    pixelatedImage.pixels[pixelIndex + 1] = aveGreen;
                    pixelatedImage.pixels[pixelIndex + 2] = aveBlue;
                }
            }
        }
    }

    // return the pixelated image
    pixelatedImage.updatePixels();
    return pixelatedImage;
}
