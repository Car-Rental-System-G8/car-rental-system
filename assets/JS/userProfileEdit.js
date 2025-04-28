

const currentUserEmail = localStorage.getItem('currentUser');

let nameField = document.querySelector("#name");
let emailField = document.querySelector("#email");
let phoneField = document.querySelector("#phone");
let passField = document.querySelector("#password");
let imageField = document.querySelector("#image");
let saveButton = document.querySelector(".save-button");

async function fetchAndHandleUser() {
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const currentUser = users.find(user => user.email === currentUserEmail);

    if (currentUser) {
      // show user profile information
      const username = document.querySelector("#ph-profilename")
      username.textContent = currentUser.name

      nameField.value = currentUser.name;
      emailField.value = currentUser.email;
      phoneField.value = currentUser.phone;
      passField.value = currentUser.password;
      imageField.src = currentUser.image;
      
     

      // updating user information
      saveButton.addEventListener('click', async function () {
        event.preventDefault();

        const updatedUser = {
          name: nameField.value,
          email: emailField.value,
          phone: phoneField.value,
          password: passField.value,
          image: imageField.src,
        };

        try {
          const updateResponse = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser),
          });

          const updatedData = await updateResponse.json();
          console.log('Updated user:', updatedData);
          localStorage.setItem('currentUser', updatedUser.email);
          alert('User data updated successfully!');
          window.location.href = 'index.html'

        } catch (updateError) {
          console.error('Error updating user:', updateError);
          alert('Failed to update user data.');
        }
      });

    } else {
      console.log('User not found.');
    }

  } catch (error) {
    console.error('Error fetching users:', error);
  }
}


fetchAndHandleUser();
