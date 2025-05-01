const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get('id');
const messageDetailsContainer = document.getElementById('messageDetails');
const starredBtn = document.getElementById('starredBtn');
const deleteBtn = document.getElementById('deleteBtn');

// Helper function to format dates
function dateFormatter(date) {
    const d = new Date(date);
    return isNaN(d.getTime())
        ? 'N/A'
        : d.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          });
}

// API functions (reused from dashboard-contacts.js)
async function deleteMessage(id) {
    try {
        const response = await fetch(`http://localhost:3000/contacts/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete contact');
        return { success: true };
    } catch (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Failed to delete contact' };
    }
}

async function updateContact(id, updatedObj) {
    try {
        const response = await fetch(`http://localhost:3000/contacts/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedObj),
        });
        if (!response.ok) throw new Error('Failed to update contact');
        return { success: true, data: await response.json() };
    } catch (error) {
        console.error('Update error:', error);
        return { success: false, error: 'Failed to update contact' };
    }
}

// Fetch and display contact details
async function fetchMessageDetails() {
    if (!contactId) {
        Swal.fire({
            title: 'Error!',
            text: 'No message ID provided.',
            icon: 'error',
            confirmButtonText: 'Go Back',
        }).then(() => {
            window.location.href = '/admin/contacts.html';
        });
        return;
    }

    try {
        // Fetch the contact
        const contactResponse = await fetch(`http://localhost:3000/contacts/${contactId}`);
        if (!contactResponse.ok) {
            throw new Error(`Failed to fetch contact: ${contactResponse.status} ${contactResponse.statusText}`);
        }
        const contact = await contactResponse.json();

        // Update the read status to true if it is currently false
        if (contact.read === false) {
            const updateResult = await updateContact(contactId, { read: true });
            if (!updateResult.success) {
                console.warn('Failed to update read status:', updateResult.error);
                // Optionally show a warning to the user, but don't block the UI
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning',
                    text: 'Failed to mark message as read, but you can still view it.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }

        let user = {};
        if (contact.userId) {
            try {
                const userResponse = await fetch(`http://localhost:3000/users/${contact.userId}`);
                if (userResponse.ok) {
                    user = await userResponse.json();
                }
            } catch (userError) {
                console.warn('Failed to fetch user details, continuing with contact only:', userError);
            }
        }

        // Update date in header if available
        if (contact.date) {
            document.getElementById('messageDate').textContent = dateFormatter(contact.date);
        }

        messageDetailsContainer.innerHTML = `
            <div class="detail-item">
                <strong>Name</strong> ${contact.firstName || ''} ${contact.lastName || ''}
            </div>
            <div class="detail-item">
                <strong>Email</strong> ${contact.email || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Phone</strong> ${contact.phone || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Subject</strong> ${contact.subject || 'N/A'}
            </div>
            <div class="detail-item">
                <strong>Message</strong> ${contact.message || 'No message content'}
            </div>
        `;

        // Update the star button based on current status
        starredBtn.innerHTML = contact.starred
            ? '<i class="fas fa-star starred-icon"></i> Unstar'
            : '<i class="far fa-star"></i> Star';

        // Star button event handler
        starredBtn.addEventListener('click', async () => {
            const newStarredStatus = !contact.starred;
            const updateResult = await updateContact(contactId, { starred: newStarredStatus });
            if (updateResult.success) {
                // Update UI
                contact.starred = newStarredStatus;
                starredBtn.innerHTML = newStarredStatus
                    ? '<i class="fas fa-star starred-icon"></i> Unstar'
                    : '<i class="far fa-star"></i> Star';
                
                Swal.fire({
                    icon: 'success',
                    title: 'Star Updated',
                    text: `Message ${newStarredStatus ? 'starred' : 'unstarred'} successfully.`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: updateResult.error || 'Failed to update starred status.',
                });
            }
        });

        // Delete button event handler
        deleteBtn.addEventListener('click', async () => {
            const { isConfirmed } = await Swal.fire({
                title: 'Are you sure?',
                text: 'This will delete this message permanently!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete!',
                cancelButtonText: 'Cancel',
            });

            if (isConfirmed) {
                const result = await deleteMessage(contactId);
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Message removed.',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = '/admin/contacts.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: result.error || 'Failed to delete message.',
                    });
                }
            }
        });

    } catch (error) {
        console.error('Error fetching message details:', error.message);
        Swal.fire({
            title: 'Error!',
            text: `Failed to load message details: ${error.message}`,
            icon: 'error',
            confirmButtonText: 'Go Back',
        }).then(() => {
            window.location.href = '/admin/contacts.html';
        });
    }
}

document.addEventListener('DOMContentLoaded', fetchMessageDetails);