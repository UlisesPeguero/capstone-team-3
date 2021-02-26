const urlServer = '../api/tickets';

const DeleteModal = new bootstrap.Modal(document.getElementById('deleteRequestModal'));
const Notification = new bootstrap.Toast(document.getElementById('notification'), { autohide: true });
const RequestsTable = $('#table'); // jquery object to use with bootstrapTable
const RequestModal = $('#requestModal'); // jquery object  to use with bootstrap
const RequestForm = document.getElementById('requestForm'); // to work with HTMLElement

const NONE = 0;
const CREATE = 1;
const UPDATE = 2;

const MOBILE_XTRESSHOLD = 580;
const SCREEN_YOFFSET = 235; // pixels
let MOBILE_YOFFSET = 60;

// global
let action;

// table formatters

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

////////////////////

// Form

function setAction(_action) {
    // set action global
    action = _action;     
}

function openCreateDialog() {
    // set current action to update
    setAction(CREATE);
    // set title to create
    RequestModal.find('.modal-title').html('Create New Request');
    // reset form to clear previous data
    RequestForm.reset();   
}

function openUpdateDialog(id) {
    // set current action to update
    setAction(UPDATE);    
    // set title to create
    RequestModal.find('.modal-title').html('Edit Request');
    // get data from table using the id
    let data = RequestsTable.bootstrapTable('getRowByUniqueId', id);
    // populate form
    document.getElementById('_id').value = data._id;
    document.getElementById('number').value = data.number;
    document.getElementById('requestor').value = data.requestor;
    document.getElementById('email').value = data.email;
    document.getElementById('phone').value = data.phone;
    document.getElementById('details').value = data.details;
    document.getElementById('address').value = data.address;
    document.getElementById('priority').value = data.priority;
    document.getElementById('status').value = data.status;
    // jquery object to call modal 'show'
    RequestModal.modal('show');
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
            RequestsTable.bootstrapTable('removeByUniqueId', id);
            displayNotification('Delete', 'The service request has been removed succesfully.');
        })
        .catch(function (error) {
            // handle error
            console.log(error);            
            displayNotification({
                title: 'Delete',
                content: error.responseJSON.message
            });
        }).then(function () {
            DeleteModal.hide();
        });
}


function saveChanges() {
    let form = document.getElementById('requestForm');
    if (!form.reportValidity()) return; // reportValidity() checks if the form is valid, if not we stop the function
    
    let data = {
        requestor: document.getElementById('requestor').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        details: document.getElementById('details').value,
        address: document.getElementById('address').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
    };    
    
    if (action === CREATE) {
        post(data); // create a ticket
    } else if(action == UPDATE) {
        put(document.getElementById('_id').value, data); // update a ticket
    }
    // set action to none to avoid douplication of action
    setAction(NONE);
}

// send request to server POST /tickets
function post(ticketData) {
    $.ajax({
        method: 'post',
        url: urlServer,   // API url
        data: ticketData, // information from the Form
    }).then(function (response) {
        // handle success
        console.log(response);
        RequestsTable.bootstrapTable('append', response.ticket);
        RequestsTable.bootstrapTable('scrollTo', 'bottom');
        displayNotification('New', 'The service request has been created succesfully.');
    })
        .catch(function (error) { // if it fails
            console.log(error.responseJSON);
            displayNotification({
                title: 'Error Creating',
                content: error.responseJSON.message
            });
        }).then(function () {
            RequestModal.modal('hide');
        });    
}

// request server PUT /tickets/:id
function put(id, ticketData) {
    $.ajax({
        method: 'put',
        url: urlServer + '/' + id,
        data: ticketData
    }).then(function (response) {
        // handle success
        console.log(response);
        displayNotification('Edit', 'The service request has been updated succesfully.');
        RequestsTable.bootstrapTable('updateByUniqueId', {
            id: id,
            row: response.ticket
        });       
    })
        .catch(function (error) {
            // handle error
            console.log(error.responseJSON);
            console.log(error.responseJSON);
            displayNotification({
                title: 'Error Updating',
                content: error.responseJSON.message
            });
           
        }).then(() => {
            RequestModal.modal('hide');
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
