/**
 * This function will remove the container class on the page wrapper for join pages. This is to allow full width banner.
 */
function removeContainer() {
    if (document.getElementsByClassName('join').length !== 0) {
        document.getElementById('page-wrapper').classList.remove('container');
    }
}

/**
 * This function will show or hide form sign up fields when toggle is checked.
 */
function toggleStyles() {
    const checkbox  = document.getElementById('form-toggle');
    const signUp    = document.getElementById('sign-up');
    const login     = document.getElementById('login');
    const firstName = document.getElementById('firstNameField');
    const lastName  = document.getElementById('lastNameField');
    const password2 = document.getElementById('password2Field');

    checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            login.classList.remove('active');
            signUp.classList.add('active');
            firstName.classList.remove('hidden');
            lastName.classList.remove('hidden');
            password2.classList.remove('hidden');
        } else {
            signUp.classList.remove('active');
            login.classList.add('active');
            firstName.classList.add('hidden');
            lastName.classList.add('hidden');
            password2.classList.add('hidden');
        }
    });
}

/**
 * Export join process front end functions.
 */
export default function joinProcessInteraction() {
    removeContainer();
    toggleStyles();
}
