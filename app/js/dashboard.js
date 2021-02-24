const urlServer = '../api/tickets';

const DeleteModal = new bootstrap.Modal(document.getElementById('deleteRequestModal'));
const Notification = new bootstrap.Toast(document.getElementById('notification'), { autohide: true });

const MOBILE_XTRESSHOLD = 580;
const SCREEN_YOFFSET = 235; // pixels
let MOBILE_YOFFSET = 60;

function dateFormatter(value, row) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(value)).replace(',', ' ');    
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
            displayNotification('Delete', 'The service request has been removed succesfully.');
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

function displayNotification(title, content, isError = false) {
    $('#notification').removeClass('notificationError');        
    $('#notificationTitle').html(title);
    $('#notificationContent').html(content);
    if (isError) {
        $('#notification').addClass('notificationError');        
    }
    Notification.show();    
}

let bodyHeight = null;

function adjustTableHeight(forced = false) {
    let newHeight = window.innerHeight;
    if (bodyHeight !== newHeight || forced) {
        bodyHeight = newHeight;
        newHeight -= SCREEN_YOFFSET;
        if (window.innerWidth < MOBILE_XTRESSHOLD) newHeight -= MOBILE_YOFFSET;
        $('.fixed-table-container').height(newHeight);        
    }
}

window.addEventListener('resize', adjustTableHeight);
// run adjustment at the begining
$(() => {
    adjustTableHeight();
});