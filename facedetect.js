let currentFilterText = "Original Image";
let x = 30;
let y = 700;
let textYSpace = 20;
let shouldDrawExpressions = true;

function detectAndDrawFaces(img) {
    for (let i = 0; i < detections.length; i++) {
        const alignedRect = detections[i].alignedRect;
        const x = alignedRect._box._x;
        const y = alignedRect._box._y;
        const boxWidth = alignedRect._box._width;
        const boxHeight = alignedRect._box._height;

        img.stroke(0, 255, 0);
        img.strokeWeight(0.5);
        img.noFill();
        img.rect(x, y, boxWidth, boxHeight);

        // Enable the filter to be triggered by "D" keypress and change accordingly
        switch (faceReplacementIndex) {
            case 0:
                break;
            case 1:
                replaceFaceWithBlurred(img, x, y, boxWidth, boxHeight);
                break;
            case 2:
                replaceFaceWithColorConverted(img, x, y, boxWidth, boxHeight);
                break;
            case 3:
                replaceFaceWithPixelated(img, x, y, boxWidth, boxHeight, 5);
                break;
            case 4:
                replaceFaceWithBlackAndWhiteThreshold(img, x, y, boxWidth, boxHeight, 128);
                break;
            case 5:
                replaceFaceWithSketch(img, x, y, boxWidth, boxHeight);
                break;
            case 6:
                replaceFaceWithSepiaTone(img, x, y, boxWidth, boxHeight);
                break;
            case 7:
                drawLandmarksAndExpressions(img, detections[i]);  // Modified function call
                break;
        }
    }
}


function drawLandmarksAndExpressions(img, detection) {
    drawLandmarks(img, detection);

    if (shouldDrawExpressions) {
        drawExpressions([detection], x, y, textYSpace);
    }
}

function drawExpressions(detections, x, y, textYSpace) {
    if (detections.length > 0 && detections[0].expressions) {
      const { neutral, happy, angry, sad, disgusted, surprised, fearful } = detections[0].expressions;
      textFont('Helvetica Neue');
      textSize(14);
      noStroke();
      fill(44, 169, 225);
  
      text("neutral:       " + nf(neutral * 100, 2, 2) + "%", x, y);
      text("happiness: " + nf(happy * 100, 2, 2) + "%", x, y + textYSpace);
      text("anger:        " + nf(angry * 100, 2, 2) + "%", x, y + textYSpace * 2);
      text("sad:            " + nf(sad * 100, 2, 2) + "%", x, y + textYSpace * 3);
      text("disgusted: " + nf(disgusted * 100, 2, 2) + "%", x, y + textYSpace * 4);
      text("surprised:  " + nf(surprised * 100, 2, 2) + "%", x, y + textYSpace * 5);
      text("fear:           " + nf(fearful * 100, 2, 2) + "%", x, y + textYSpace * 6);
    }
  }
  
function drawLandmarks(img, detection) {
    if (detection.landmarks && detection.landmarks.positions) {
        let points = detection.landmarks.positions;
        for (let i = 0; i < points.length; i++) {
            img.stroke(44, 169, 225);
            img.strokeWeight(3);
            img.point(points[i]._x, points[i]._y);
        }
    }
}



function keyPressed() {
    // Check if the 'D' key is pressed
    if (key === 'd' || key === 'D') {
        faceReplacementIndex = (faceReplacementIndex + 1) % 8; 
        // Set filter based on the selected filter
        switch (faceReplacementIndex) {
            case 0:
                currentFilterText = "Original Image";
                break;
            case 1:
                currentFilterText = "Blurred";
                break;
            case 2:
                currentFilterText = "Color Converted";
                break;
            case 3:
                currentFilterText = "Pixelated";
                break;
            case 4:
                currentFilterText = "Black and White Threshold";
                break;
            case 5:
                currentFilterText = "Erode + Grey Scale";
                break;
            case 6:
                currentFilterText = "Sepia Tone";
                break;
            case 7:
                currentFilterText = "Expression Dectector";
                break;
        }

        faceapi.detect(gotResults);
    }
}

// Functions to replace detected face with filter
function replaceFaceWithSepiaTone(img, x, y, width, height) {
    let faceImage = img.get(x, y, width, height);
    faceImage = applySepiaTone(faceImage);
    img.image(faceImage, x, y);
}

function replaceFaceWithBlackAndWhiteThreshold(img, x, y, width, height, threshold) {
    let faceImage = img.get(x, y, width, height);
    faceImage = blackAndWhiteThresholdImage(faceImage, threshold);
    img.image(faceImage, x, y);
}

function replaceFaceWithBlurred(img, x, y, width, height) {
    let faceImage = img.get(x, y, width, height);
    faceImage.filter(BLUR, 10); 
    img.image(faceImage, x, y);
}

function replaceFaceWithColorConverted(img, x, y, width, height) {
    let faceImage = img.get(x, y, width, height);
    faceImage = convertToTCbCr(faceImage);
    img.image(faceImage, x, y);
}

function replaceFaceWithPixelated(img, x, y, width, height, pixelSize) {
    let faceImage = img.get(x, y, width, height);
    faceImage.resize(floor(faceImage.width / pixelSize), floor(faceImage.height / pixelSize));
    // Scale it back to the original size
    faceImage.resize(width, height);
    img.image(faceImage, x, y, width, height);
}

function replaceFaceWithSketch(img, x, y, width, height) {
    let faceImage = img.get(x, y, width, height);
    // Setting the image with the following filter
    faceImage.filter(GRAY);
    faceImage.filter(ERODE);
    faceImage.filter(INVERT);

    faceImage.resize(width, height);
    img.image(faceImage, x, y, width, height);
}


// Function to apply Sepia Tone effect to an image
function applySepiaTone(inputImage) {
    // Clone the inputImage to avoid modifying the original image
    let sepiaImage = inputImage.get();
    sepiaImage.loadPixels();

    // Process each pixel
    for (let i = 0; i < sepiaImage.pixels.length; i += 4) {
        let r = sepiaImage.pixels[i];
        let g = sepiaImage.pixels[i + 1];
        let b = sepiaImage.pixels[i + 2];

        // Sepia Tone formula
        let tr = 0.393 * r + 0.769 * g + 0.189 * b;
        let tg = 0.349 * r + 0.686 * g + 0.168 * b;
        let tb = 0.272 * r + 0.534 * g + 0.131 * b;

        // Ensure values are within the valid range (0-255)
        tr = min(255, tr);
        tg = min(255, tg);
        tb = min(255, tb);

        // Update the pixel values
        sepiaImage.pixels[i] = tr;
        sepiaImage.pixels[i + 1] = tg;
        sepiaImage.pixels[i + 2] = tb;
    }

    sepiaImage.updatePixels();
    return sepiaImage;
}
  