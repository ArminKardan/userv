const chokidar = require('chokidar');

// Initialize the watcher, ignoring the `.next` directory
const watcher = chokidar.watch('.', {
    ignored: [/(^|[\/\\])\.next/, /(^|[\/\\])\.git/], // Array of regex patterns to ignore
    persistent: true,             // Keep the process alive
    ignoreInitial: true           // Ignore the initial file add events
});

// Event listener for when a file changes

let changed = false

watcher
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        changed = true
    })
    .on('add', path => {
        console.log(`File ${path} has been added`);
        changed = true
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        changed = true
    });

// Optionally, watch for directory changes
watcher
    .on('addDir', path => {
        console.log(`Directory ${path} has been added`);
        changed = true
    })
    .on('unlinkDir', path => {
        console.log(`Directory ${path} has been removed`);
        changed = true
    });


setInterval(() => {

    if(!changed)
        return
    console.log("running push minimized...")
    const { exec } = require('child_process');

    // Replace 'your_program.exe' with the actual path to your .exe file
    const exePath = './push.exe';

    // Use PowerShell to launch the .exe minimized
    exec(`powershell -command "Start-Process '${exePath}' -WindowStyle Minimized"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return;
        }
        console.log(`Stdout: ${stdout}`);
    });

    changed = false


}, 60000);

console.log('Watching for file changes...');
