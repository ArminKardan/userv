

export default async () => {
    process.on('SIGINT', async function () {
        process.exit(0) // if you don't close yourself this will run forever
    });
}
