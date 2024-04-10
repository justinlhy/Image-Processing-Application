// Function to convert imaging to Red, Green and Blue Channels (without thresholding)
function splitIntoChannels(inputImage) {
    let r = createImage(inputImage.width, inputImage.height);
    let g = createImage(inputImage.width, inputImage.height);
    let b = createImage(inputImage.width, inputImage.height);

    r.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, r.width, r.height);
    g.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, g.width, g.height);
    b.copy(inputImage, 0, 0, inputImage.width, inputImage.height, 0, 0, b.width, b.height);

    r.loadPixels();
    g.loadPixels();
    b.loadPixels();

    for (let i = 0; i < r.pixels.length; i += 4) {
        g.pixels[i] = 0;
        b.pixels[i] = 0;

        r.pixels[i + 1] = 0;
        b.pixels[i + 1] = 0;

        r.pixels[i + 2] = 0;
        g.pixels[i + 2] = 0;
    }

    r.updatePixels();
    g.updatePixels();
    b.updatePixels();

    return [r, g, b];
}