// Declaring global variables
let video;
let canvasList = [];
// Capture buttons
let unfreezeButton;
let isCapturing = false;
let capturedImage;
// Sliders to control thresholding
let redSlider, greenSlider, blueSlider;
let tcbrThresholdSlider;
let hsvThresholdSlider;
// Face detection
let faceCanvas;
let detections = [];
let faceapi;

//Others
let pixelSize = 5;
let faceReplacementIndex = 0;

// Image captions for grid
let captions = [
    ["Original Image", "Grayscale Image", "Pixelated Image", "Red Channel", "Green Channel", "Blue Channel", "Red Thresholded", "Green Thresholded", "Blue Thresholded", "B&W Thresholded", "TCbCr Image", "HSV Image", "Face Detection", "Threshold TCbCr", "Threshold HSV"]
];


function setup() {
    createCanvas(160 * 3, 160 * 5);

    //Creating the video and setting the size for each grid 
    video = createCapture(VIDEO, function () {
        video.size(160, 120);
        for (let i = 0; i < 4 * 5; i++) {
            canvasList.push(createGraphics(160, 120));
        }
        
        // Save Image button
         let saveImageButton = select('#saveImageButton');
         saveImageButton.mousePressed(saveImage);

        // Capture button
        let captureButton = select('#captureButton');
        captureButton.mousePressed(captureAndApplyFilters);

        // Uncapture Button
        let unfreezeButton = select('#unfreezeButton');
        unfreezeButton.mousePressed(uncaptureAndUnfreeze);

    // Create a container for top sliders
    let topSliderContainer = select('#topSliderContainer');
    topSliderContainer.class('slider-container');
    // Slider intensity
    redSlider = createSlider(0, 180, 90);
    greenSlider = createSlider(0, 180, 90);
    blueSlider = createSlider(0, 180, 90);

    topSliderContainer.child(redSlider);
    topSliderContainer.child(greenSlider);
    topSliderContainer.child(blueSlider);

    // Create a container for bottom sliders
    let bottomSliderContainer = select('#bottomSliderContainer');
    bottomSliderContainer.class('slider-container');
    // Slider intensity
    tcbrThresholdSlider = createSlider(0, 255, 90);
    hsvThresholdSlider = createSlider(0, 255, 90);

    bottomSliderContainer.child(tcbrThresholdSlider);
    bottomSliderContainer.child(hsvThresholdSlider);

    faceCanvas = createGraphics(160, 120);
        const faceOptions = {
            withLandmarks: true,
            withExpressions: true,
            withDescriptors: true,
            minConfidence: 0.5
          };

        faceapi = ml5.faceApi(video, faceOptions, faceReady);
        //Hide the video
        video.hide();

    });

    // Change filter when 'D' key is pressed
    window.addEventListener('keydown', function (e) {
        if (e.key === 'd' || e.key === 'D') {
            faceapi.detect(gotResults);
        }
    });


    // Activate capture button with "C" key press
    window.addEventListener('keydown', function (e) {
        if (e.key === 'c' || e.key === 'C') {
            captureAndApplyFilters();
        }
    });

    // Activate uncapture button with "V" key press
    window.addEventListener('keydown', function (e) {
        if (e.key === 'v' || e.key === 'V') {
            uncaptureAndUnfreeze();
        }
    });

    // Activate save image button with "V" key press
    window.addEventListener('keydown', function (e) {
        if (e.key === 's' || e.key === 'S') {
            saveImage();
        }
    });    
}

function faceReady() {
    faceapi.detect(gotResults)
    console.log('Face model ready!');
}

function gotResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // call the draw() function to display the grid upon detection
    detections = result;
    draw(); 
}


function draw() {
    background(255);

    if (video.loadedmetadata) {
        // Capture the current video frame
        let scaledImage = createImage(160, 120);
        scaledImage.copy(video, 0, 0, video.width, video.height, 0, 0, scaledImage.width, scaledImage.height);

        // Display original image
        displayImage(scaledImage, 0, 0, captions[0][0]);

        // Display grayscale image
        let grayscaleImage = convertToGrayscale(scaledImage);
        displayImage(grayscaleImage, 1, 0, captions[0][1]);

        // Display pixalated image
        let pixelatedImage = convertToPixelate(scaledImage, pixelSize);
        displayImage(pixelatedImage, 2, 0, captions[0][2]);

        // Display individual channels
        let channels = splitIntoChannels(scaledImage);
        displayImage(channels[0], 0, 1, captions[0][3]);
        displayImage(channels[1], 1, 1, captions[0][4]);
        displayImage(channels[2], 2, 1, captions[0][5]);

        // Display thresholded images
        let redThresholdedImage = applyThreshold(channels[0], redSlider.value());
        let greenThresholdedImage = applyThreshold(channels[1], greenSlider.value());
        let blueThresholdedImage = applyThreshold(channels[2], blueSlider.value());
        displayImage(redThresholdedImage, 0, 2, captions[0][6]);
        displayImage(greenThresholdedImage, 1, 2, captions[0][7]);
        displayImage(blueThresholdedImage, 2, 2, captions[0][8]);

        // Display B&W thresholded image
        let bAndWThresholdedImage = blackAndWhiteThresholdImage(scaledImage, 128);
        displayImage(bAndWThresholdedImage, 0, 3, captions[0][9]);

        // Display converted images
        let tcbrImage = convertToTCbCr(scaledImage);
        displayImage(tcbrImage, 1, 3, captions[0][10]);
        let hsvImage = convertToHSV(scaledImage);
        displayImage(hsvImage, 2, 3, captions[0][11]);

        // Trigger face detection in live
        if (frameCount % 10 === 0) { 
            faceapi.detect(gotResults);
        }

        // Display face detection results in grid
        faceCanvas.image(scaledImage, 0, 0);
        if (detections) {
            detectAndDrawFaces(faceCanvas);
        }
        displayImage(faceCanvas, 0, 4, captions[0][12]);

        // Display thresholded tcbrImage
        let tcbrThreshold = tcbrImageThreshold(scaledImage, tcbrThresholdSlider.value());
        displayImage(tcbrThreshold, 1, 4, captions[0][13]);

        // Display thresholded hsvImage
        let hsvThreshold = hsvImageThreshold(scaledImage, hsvThresholdSlider.value());
        displayImage(hsvThreshold, 2, 4, captions[0][14]);

        // Display filter text
        fill(0);
        textAlign(CENTER);
        textSize(16);
        text(`Face Detection: ${currentFilterText}`, width / 2, height - 20);

    }
}




function displayImage(img, col, row, caption) {
    let index = row * 3 + col;

    // Clear the canvas before drawing the new image
    canvasList[index].clear();

    let x = col * 0;
    let y = row * 0;
    // Draw the image on the canvas
    canvasList[index].image(img, 0, 0, 158, 118); // Leave 1-pixel border

    // Draw the caption array
    let captionX = x + 160 / 2; 
    let captionY = y + 120 - 5; 
    canvasList[index].textAlign(CENTER);
    canvasList[index].textSize(10);
    canvasList[index].fill(255);
    canvasList[index].text(caption, captionX, captionY);

    // Draw the canvas on the main canvas
    image(canvasList[index], col * 160, row * 140);
}



function captureAndApplyFilters() {
    if (!isCapturing) {
        // Pause the video to capture the current frame
        video.pause();

        // Loop through all the grids
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
                if (col !== 2) {
                    let capturedImage = canvasList[row * 3 + col].get();
                }
            }
        }

        // Set capturing to true
        isCapturing = true;
    } else {
        // Resume the video after resetting frames
        video.play();
        for (let i = 0; i < canvasList.length; i++) {
            if (canvasList[i]) {
                canvasList[i].clear();
            }
        }

        // Set capturing to false
        isCapturing = false;
    }
}

function uncaptureAndUnfreeze() {
    // Resume the video after resetting frames
    video.play();

    // Clear the canvasList
    for (let i = 0; i < canvasList.length; i++) {
        if (canvasList[i]) {
            canvasList[i].clear();
        }
    }

    // Set capturing to false
    isCapturing = false;

    // Unfreeze the video
    unfreeze();
}


function unfreeze() {
    video.loop(); 
}

function saveImage() {
    // Call video pause to get the frame
    video.pause();

    // Create a graphics object to hold the entire grid
    let fullGridImage = createGraphics(width, height);

// Loop through all the grids to capture all the grid
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
        let capturedImage = canvasList[row * 3 + col].get();
        fullGridImage.image(capturedImage, col * 160, row * 140);
    }
}
    // Save the full grid image as a file
    fullGridImage.save("full_grid_image.png");
    video.play();
}


/* 

The difference in thresholding results for each channel is intentional and controlled by individual slider values. This allows for customized manipulation of each color channel independently, providing flexibility in image processing and emphasizing certain color components based on the user-defined thresholds.

The thresholding result for the colourspace is implemented with a different approach than the ones for the RGB. The adjustment of intensity for each channel individually can lead to a more nuanced thresholding compared to the RGB Thresholding where each channel was thresholded independently. The impact of noise level on the colourspace and RBG channel is also different as it depends onf the characteristic of each images to produce a certain aspects of thresholding.
Overall the colourspace thresholding include a more intensed-based thresholding due to the sophisticated approach. Hence producing different outcome of thresholding for both functions.

One of the main challenges faced in the project was implementing a pixelation filter on the face detection box. Initially, a function for pixelation was created and called to replace the face detection box, but the displayed image appeared blurred instead of pixelated.  To troubleshoot, the pixelation filter was tested on a normal grid, and it worked as expected. This indicated that the problem might be related to the dimensions, as the grid had different dimensions from the face detection box.

Upon reviewing the replaceFaceWithPixelated function, it was discovered that the issue might be related to scaling. Resizing the face image to a smaller size for pixelation and then back to the original dimensions resolved the problem, resulting in the desired pixelation effect on the face detection box.

As for the project itself, I successfully completed the initial requirements, including the incorporation of four distinct filters for face detection. Not content with stopping there, I extended the project by introducing two additional filters - "Erode + Grey Scale" and "Sepia Tone." These extra features can be seamlessly toggled using the 'D' key, providing users with more creative options for transforming their images.

To enhance user experience and engagement, I implemented a live grid system. This allows users to interact with the grid in real-time, providing a dynamic and responsive interface. Additionally, I integrated a text indicator below the grid, displaying the current filter in use. This feature offers users clarity and insight into the applied filter, contributing to a more user-friendly experience.

One unique aspect of my project is the ability to capture images on-demand. By pausing the frame while the face detection continues to operate, users can capture moments and save their transformed images. This feature adds an extra layer of functionality, making the application more versatile and user-oriented. I ahve also added a new button that calls for a function in which allows the grid to be saved as an image, which allows the application to act more like a photobooth for users to take picture and save it. I have also utilise the face detect and added in a few more interesting filter to enhance the user experience.

*/
