const urlServer = 'https://capstone-team-3.herokuapp.com/api/tickets';

const DeleteModal = new bootstrap.Modal(document.getElementById('deleteRequestModal'));
const Notification = new bootstrap.Toast(document.getElementById('notification'), {autohide: true});

function dateFormatter(value, row) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(value));    
}

function addressFormatter(value) {
    return `<a class="actionButton map" href="https://www.google.com/maps/place/${value}" target="_blank" title="Go to maps"><i class="fa fa-map-marker-alt"></i></a> ${value}`;
}
    
function actionsFormatter(value, row) {
    return [
        `<a class="actionButton update" href="javascript:openUpdateDialog('${row._id}')" title="Update Request"><i class="fa fa-edit"></i></a>`,
        `<a class="actionButton remove" href="javascript:openDeleteDialog('${row._id}', '${row.number}', '${row.requestor}', '${dateFormatter(row.createdAt)}')" title="Delete Request"><i class="fa fa-trash-alt"></i></a>`
    ].join('');
}

function detailFormatter(index, row) {
    return [
        `<span class="detailLabel">Date</span><span class="detailValue">${dateFormatter(row['createdAt'])}</span>`,
        `<span class="detailLabel">#</span><span class="detailValue"><strong>${row['number']}</strong></span>`,
        `<span class="detailLabel">Requestor</span><span class="detailValue">${row['requestor']}</span>`,
        `<span class="detailLabel">Email</span><span class="detailValue">${row['email']}</span>`,
        `<span class="detailLabel">Phone</span><span class="detailValue">${!row['phone'] ? '' : row['phone']}</span>`,
        `<span class="detailLabel">Details</span><span class="detailValue">${row['details']}</span>`,
        `<span class="detailLabel">Address</span><span class="detailValue">${addressFormatter(row['address'])}</span>`,
        `<span class="detailLabel">Priority</span><span class="detailValue">${row['priority']}</span>`,
        `<span class="detailLabel">Status</span><span class="detailValue">${row['status']}</span>`,
        `<span class="detailLabel">Last update</span><span class="detailValue">${dateFormatter(row['updatedAt'])}</span>`,
        `<span class="detailLabel">Actions</span><span class="detailValue">${actionsFormatter(null, row)}</span>`,        
    ].join('<br>');
}

function openUpdateDialog(id) {
    console.log('update ' + id)
} 

function openDeleteDialog(id, number, requestor, date) {
    document.getElementById('requestToDeleteDetail').innerHTML = `Request #<strong>${number}</strong> made by ${requestor} on ${date}.`
    document.getElementById('btnDeleteRequest').onclick = () => deleteRequest(id);
    DeleteModal.show();
}

function deleteRequest(id) {
    $.ajax({
        method: 'delete',
        url: urlServer + '/' + id                
        }).then(function (response) {
            // handle success
            console.log(response);            
            $('#ticketsTable').bootstrapTable('removeByUniqueId', id);
            displayNotification({
                title: 'Delete',
                content: 'The request has been removed from the database.'
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);            
            displayNotification({
                title: 'Delete',
                content: error.message
            });
        });
}

function displayNotification({ title, content }, status, timeToLive = 3 * 6000) {
    $('#notificationTitle').html(title);
    $('#notificationContent').html(content);
    Notification.show();    
}

let bodyHeight = $('body').height();

