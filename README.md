## **Copy from current multitimer repository, will be updated soon (which means eventually)**

Original copy follows:

# MIE MultiTimer
The brand new multitimer meant to be a modern rewrite of the old timer bringing new features and a new look.
![image](https://media.github.mieweb.com/user/145/files/5f160e1c-22ae-4388-b309-d31a48cad430)

## Access
There are currently three instances of the multitimer up and avaiable to use. They are available at the two links below:

* Zeus QA version: https://zeus-qa.med-web.com/public/multitimer/index.html
* Zeus version: https://zeus.med-web.com/~tbaugher/multitimer/index.html
* Testing verison: https://zeus.med-web.com/~tbaugher/multitimer-testing/index.html

The *Zeus QA* version is the official
version of the MultiTimer, but it shouldn't be any more distinguishable than the *Zeus* version, but it's staying for "legacy" purposes at the moment. 

As the names suggest, I deploy to *Testing* more often, which will have both new features and bugs; *Zeus* is going to be more stable. 
You should be able to use both
interchangably since they should both have access to the same `localstorage`, therefore timers made in *Zeus* should show up in *Testing*,
and vice versa.

## Dev Installation
### Running a local server
Use the below steps to install and run the timer on your local machine:
* Clone the repo to your local machine
* Run `npm install` to install npm dependencies
* Run `npm run dev` to start the local server

By default the server will run on `127.0.0.1:<some port>`, which works to some extent, however importing Outlook meetings doesn't work.
Change `127.0.0.1:<port>` to `localhost:<port>` in the browser to enable this functionality.

### Building the Timer
If you're inclined, run `npm run build` to build to the `dist/` directory, and test to make sure that the timer runs correctly from there before pushing.

### Deploy Script
Finally, documentation on the deploy script `deploy.sh`:
* The script only runs on `zeus.med-web.com` (via `/etc/hostname`)
* Running `./deploy.sh` will build to `dist/` and copy its contents to the *Testing* path
* Running `./deploy.sh --release` will do the same as with *Testing* for *Release*
