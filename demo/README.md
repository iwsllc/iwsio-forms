# @iwsio/forms DEMO

## Getting Started
To run this demo:
 1. Setup the forms package.
    1. Open a terminal to the root path of this repository.
    1. `npm ci`
    1. `npm run build`
 1. Install demo dependencies
    1. `cd demo`
    1. `npm ci`
 1. We need to link things up for the demo to work properly in dev mode using the local version of the forms package. (Run this from the demo directory).
    1. `npm run link`
 1. Start the demo
    1. `cd demo`
    1. `npm start`

This may seem like a lot, but what we're doing essentially is installing dependencies for both the demo and the forms package, building the forms package, and then we're linking `react` in the package to the demo's installed version of `react`, which is required for this to work properly locally. Finally, we're booting it up! 
