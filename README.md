# MIE MultiTimer

![image](https://media.github.mieweb.com/user/145/files/e0d28cbc-16b8-4135-970a-524a22c4a3e5)

*Image subject to change in look*

# Overview

The MultiTimer acts as a means to track time in any MIE-related work in a seamless way directly within the browser. Featuring customizable timers, search options, helpful logging controls for each timer, a meeting importer, among other features, users should be able to quickly track and log their time for any issue.

The second, more modern, rewrite of the original rewrite, this version is meant to be a cleanup of the original while also using modern frameworks to create a more seamless, and hopefully more managable developer experience, while being able to implement features faster, push forward less bugs, and be more readable. 

## Access
There are currently three instances of the multitimer up and avaiable to use. They are available at the two links below:

* Zeus QA version: https://zeus-qa.med-web.com/public/multitimer/index.html
* Zeus version: https://zeus.med-web.com/~tbaugher/multitimer/index.html
* Zeus Testing verison: https://zeus.med-web.com/~tbaugher/multitimer-testing/index.html

The *Zeus QA* version is the official location of the MultiTimer, featuring the most stable version of the application. The *Zeus* version as a mirror, and should effectively be the same as *Zeus QA*. *Zeus Testing* is used for my test deployments in case the dev environment gives me a different experience than when it gets deployed. As a note, localstorage is the same on both *Zeus Testing* and *Zeus*, so you'll see the same timers and other data carried over between the two.

When I decide to deploy a new version, I deploy to each site ordering from *Zeus Testing*, to *Zeus*, and finally *Zeus QA*. If any new special features are being deployed, or if users need to be made aware of something on the next deployment, I'll make an announcement on the official channels.

## Dev Installation

Development uses vite to run a local server on your machine, which you access through your browser. Frontend code is written up using Vue, Typescript, and Sass, with formatting help with eslint and prettier. When using VSCode, your editor should recommend the associated extensions when opening the project.

### Install

* Clone the master repo to your local machine
* Run `npm install` to install npm dependencies

# Run the local developement server

Run `npm run dev` to run the development server on your machine.

By default the server will run on `127.0.0.1:<some port>`, which works to some extent, however importing Outlook meetings doesn't work.
Change `127.0.0.1:<port>` to `localhost:<port>` in the browser to enable this functionality.

### Building the Timer
If you're inclined, run `npm run build` to build to the `dist/` directory. Useful if you want to push the contents of this directory to a server to see how it serves the contents up.

### Deploy Script
Use `deploy.sh` to deploy to the various instances listed above. The script only runs on `zeus.med-web.com` (checks this via `/etc/hostname`), so log in there to use it.

* Run `./deploy.sh` to build and push to *Zeus Testing*. Good for testing, and should be done first to test it all works.
* Run `./deploy.sh --release` to build and push to *Zeus*.
* Run `./deploy.sh --qa` to build and push to *Zeus QA*.
