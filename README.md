Globe 
================

This project is a 3D globe visualization using Three.js and additional libraries to display arcs and particles on a globe. The visualization highlights random locations in the US or Europe, drawing arcs to predetermined target locations in Africa and animating heart-shaped particles at the target locations.

Features
--------

-   Randomly generates arcs between the US/Europe and target locations in Africa.
-   Animates heart-shaped particles at the target locations.
-   Provides a custom 3D globe view with interactive controls.

Getting Started
---------------

### Prerequisites

-   A modern web browser with JavaScript enabled.

### Installation

You can use this code directly in your HTML file by including the necessary dependencies and scripts using JSDelivr.

### Usage

1.  Include the necessary libraries and the script in your HTML file:

html

Copy code

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Globe Visualizer</title>
    <script type="module"> import { Globe } from 'https://cdn.jsdelivr.net/gh/codeandwander/nala-globe@latest/globe.js';

        document.addEventListener('DOMContentLoaded', () => {
            const globe = new Globe('globeViz');
        }); </script>
    <style> #globeViz {
            width: 100%;
            height: 100vh;
            display: block;
        } </style>
</head>
<body>
    <div id="globeViz"></div>
</body>
</html>
```

1.  Ensure your JavaScript file (`globe.js`) is available in your GitHub repository and correctly referenced in the import statement. Replace `yourusername` and `your-repo` with your actual GitHub username and repository name.

### How It Works

-   **Globe Class**: The core of the visualization, initializing the globe, generating data, and managing animations.
-   **getRandomLocation(region)**: Generates random coordinates within specified regions (US or Europe).
-   **generateData()**: Creates arcs and particles data for the visualization.
-   **createHeartParticleCanvas()**: Sets up the heart particle canvas using SVG data.
-   **createParticle()**: Creates individual particles for animation.
-   **resetParticles()**: Resets the particle animation.
-   **handleParticles()**: Updates and draws particles on the canvas.
-   **animateParticles()**: Handles the particle animation loop.
-   **createHeartParticles()**: Creates heart-shaped particles for the 3D globe.
-   **createWorld()**: Initializes the 3D globe with arcs and custom layers.
-   **startParticleAnimationAtDestination()**: Starts particle animations at the target destinations.
-   **loadLandData()**: Loads land data for the 3D globe.
-   **addResetViewListener()**: Adds a listener to reset the globe's point of view after interaction.

### Customization

You can customize the behavior and appearance of the visualization by modifying the class properties and methods. For example, you can change the target locations, arc colors, particle shapes, and animation durations to fit your needs.

Acknowledgments
---------------

-   [Three.js](https://threejs.org/)
-   [three-globe](https://github.com/vasturiano/three-globe)
-   [TopoJSON](https://github.com/topojson/topojson)

Feel free to customize and expand this README as necessary for your project.