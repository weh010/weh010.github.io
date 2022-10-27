
/**
 * Create an alert dialog and append it to the body
 */
function initAlert() {
    let template = document.getElementsByTagName("template")[0];
    var dialog = template.content.cloneNode(true); // clone the dialog
    document.body.appendChild(dialog);
    document.querySelector("#dialog-id .alert").style.display = "block"; //display the alert message
}

/**
 * Create a confirm dialog and append it to the body
 */
function initComfirm() {
    let template = document.getElementsByTagName("template")[0];
    var dialog = template.content.cloneNode(true); // clone the dialog
    document.body.appendChild(dialog);
    document.querySelector("#dialog-id .confirm").style.display = "block"; // display the confirm message
    document.querySelector("#dialog-id #negative").style.display = "inline"; // display the negative button

}

/**
 * Create a prompt dialog and apped it to the body
 */
function initPrompt() {
    let template = document.getElementsByTagName("template")[0];
    var dialog = template.content.cloneNode(true); // clone the dialog
    document.body.appendChild(dialog);
    document.querySelector("#dialog-id .prompt").style.display = "block"; // display the confirm message
    document.querySelector("#dialog-id #negative").style.display = "inline"; // display the negative button
    document.querySelector("#dialog-id #name").style.display = "inline";

}



/**
 * Check the user click the positive or negative button of a confirm dialog
 * @returns true if positive hit, false otherwise
 */
function waitForConfirm() {
    return new Promise(resolve => {
        document.getElementById("negative").addEventListener('click', () => { resolve(false) }, { once: true })
        document.getElementById("positive").addEventListener('click', () => { resolve(true)}, { once: true })
        
        document.getElementById("dialog-id").addEventListener("click", () => {
        document.getElementById("dialog-id").remove();
        });

    }) // end promise
}

function waitForPrompt() {
    return new Promise(resolve => {
        // return null if negative button is clicked
        document.getElementById("negative").addEventListener('click', () => { resolve(null) }, { once: true })
        document.getElementById("positive").addEventListener('click', () => { 
            // get input content
            console.log(document.getElementById("name").value);
            var clean = DOMPurify.sanitize(document.getElementById("name").value);
            console.log(clean);
            resolve(clean);
        
        }, { once: true })
        
        document.getElementById("dialog-id").addEventListener("close", () => {
        document.getElementById("dialog-id").remove();
        });

    }) // end promise
}




export function dialogAlert() {
    initAlert();
    var dialog = document.getElementById("dialog-id");
    dialog.showModal();
    // positive button clicked, remove dialog
    document.getElementById("positive").addEventListener("click", () => {
        dialog.remove();
    });


}


export async function dialogConfirm() {
    initComfirm();
    var dialog = document.getElementById("dialog-id");
    dialog.showModal();

    const confirmed = await waitForConfirm();
    //console.log(confirmed);
    return confirmed;

}

export async function dialogPrompt() {
    initPrompt();
    var dialog = document.getElementById("dialog-id");
    dialog.showModal();
    const prompt = await waitForPrompt();
    //console.log(prompt);
    return prompt;
}