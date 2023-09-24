import readline from 'readline';
import { auth } from './config.js';

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

reader.question("your uid? ", async uid => {
    uid = uid.trim();

    if (!uid) {
        console.log("Uh uh. that's not a valid uid");
        process.exit(1);
    }

    auth.setCustomUserClaims(uid, {
        admin: true
    }).then(() => {
        console.log("You are now an admin.");
    }).catch((reason) => {
        console.log(reason);
    })

    reader.close();
})