

let pp = document.querySelector(".profile-image")
pp.src = "./assets/images/others/37fe057358bd77b11943809cb58b9af1.jpg"

const currentUserEmail = JSON.parse(localStorage.getItem('currentUser'));
console.log(currentUserEmail);

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
      console.log("hi");
      const username = document.querySelector("#ph-profilename")
      username.textContent = currentUser.name

      nameField.value = currentUser.name;
      emailField.value = currentUser.email;
      phoneField.value = currentUser.phone;
      passField.value = currentUser.password;
      imageField.value = currentUser.image;



      // updating user information
      saveButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const updatedUser = {
          id: currentUser.id,
          name: nameField.value,
          email: emailField.value,
          phone: phoneField.value,
          password: passField.value,
          role: currentUser.role,
          image: imageField.value,
        };
        
        const updateResult = await updateContact(7, {
          name: "UpdatedFirstName",
          email: "UpdatedLastName",
          phone: "New subject",
        });
       
        if (updateResult.success) {
          console.log("Success!", "user updated.", "success");
        } else {
          console.log("Error!", updateResult.error, "error");
        }

        // try {
          
        //   const updateResponse = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
        //     method: 'PATCH',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(updatedUser),
        //   });

        //   // const contentType = updateResponse.headers.get('content-type');
        //   const updatedData =  updateResponse.status;
        //   console.log(updatedData);

        //   if (updateResponse.ok) {
        //     console.log('Updated user:', updatedData);

        //     localStorage.setItem('currentUser', updatedUser.email);
        //     alert('User data updated successfully!');
        //     // window.location.href = 'index.html';
        //   } else {
            
        //     // No JSON body returned (e.g. 204), but request succeeded
        //     console.log('User updated successfully (no JSON returned)');
        //     // localStorage.setItem('currentUser', updatedUser.email);
        //     alert('User data updated but no json returned');
        //     // window.location.href = 'index.html';
        //   }

        // } catch (updateError) {
        //   console.error('Error updating user:', updateError);
        //   alert('Failed to update user data.');
        // }
      });


    } else {
      console.log('User not found.');
    }

  } catch (error) {
    console.error('Error fetching users:', error);
  }
}


fetchAndHandleUser();



async function updateContact(userId, updatedData) {
  try {
    const response = await fetch(
      `http://localhost:3000/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
 
    if (!response.ok) throw new Error("Failed to update contact");
 
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
