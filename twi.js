// Load a Digital Elevation Model (DEM) dataset
var dem = ee.Image("USGS/SRTMGL1_003");

// Calculate slope in degrees
var slope = ee.Terrain.slope(dem);

// Load the shapefile for the region of interest (ROI)
var roi = ee.FeatureCollection(COX);

// Create an image with a single band representing the source pixels
var sourceImage = ee.Image(1).byte().paint(roi, 0);

// Calculate flow accumulation using cumulative cost
var flowAccumulation = sourceImage.cumulativeCost({
  source: sourceImage,
  maxDistance: 20000, // Adjust the maximum distance as needed
  geodeticDistance: false
});

// Calculate TWI
var twi = flowAccumulation.log().divide(slope.tan());

// Clip the TWI image to the region of interest
var twiClip = twi.clip(roi);

// Display the TWI image
Map.addLayer(twiClip, { min: -10, max: 10, palette: ['blue', 'white', 'green'] }, 'Topographic Wetness Index');

// Export the TWI image to Google Drive
Export.image.toDrive({
  image: twiClip,
  description: 'TWI_Image',
  folder: 'TWI_Export', // Specify the folder to save the exported image
  scale: 30, // Adjust the scale as needed
  region: roi.geometry() // Use the geometry of the ROI for exporting
});