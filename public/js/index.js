var socket = io();

socket.on('connection', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnect from server');
});

var updateFormsList = function(forms, error){
    if(error){
        $('#container').html('<p>' + error + '</p>');
        return;
    }
    var ul = $('<ul></ul>');
    forms.forEach((form) => {
        var li = $('<li></li>');
        var a = $('<a href="' + form._id +'"></a>');
        var name = $('<p></p>').text(form.name);
        var email = $('<p id="emailP"></p>').text(form.email);
        a.append(name);
        a.append(email);
        li.append(a);
        ul.append(li);
    });
    $('#container').html(ul);
};

$(document).on('click', '#form #saveButton', function(e){
    e.preventDefault();
    console.log('submitted');
    var nameTextBox = $('[name=name]');
    var emailTextBox = $('[name=email]');
    var cityTextBox = $('[name=city]');
    var ageTextBox = $('[name=age]');
    var genderRadio = $('input[name=gender]:checked', '#form').val();
    var facultyTextBox = $('[name=faculty]');
    socket.emit('saveForm', {
        name: nameTextBox.val(),
        email: emailTextBox.val(),
        city: cityTextBox.val(),
        age: ageTextBox.val(),
        gender: genderRadio,
        faculty: facultyTextBox.val()
    }, function(callback, error){
        if(error){
            alert(error.message);
            console.log(error.message);
            return;
        }
        console.log(callback);
    });
    
});

$(document).on('click', '#web-app #options #button-container #view-students', function(e){
    e.preventDefault();
    socket.emit('getAllForms', function(forms, error) {
        if(error){
            console.log(error);
            return;
        }
        updateFormsList(forms);
    });
});

$(document).on('click', '#web-app #options #button-container #add-student', function(e){
    e.preventDefault();
    var html = '<div id="form"><input name="name" type="text" placeholder="Name" autofocus autocomplete="off" id="nameField"/><br><input name="email" type="text" placeholder="Email" autocomplete="off" id="emailField"/><br><input name="city" type="text" placeholder="City" autocomplete="off" id="cityField"/><br><input name="age" type="text" placeholder="Age" autocomplete="off"id="ageField"/><br><input type="radio" name="gender" value="male" checked id="maleButton"><p>Male</p><input type="radio" name="gender" value="female" id="femaleButton"><p>Female</p><br><input name="faculty" type="text" placeholder="Faculty" autocomplete="off" id="facultyField"/><br><button id="saveButton">SAVE</button></div>';
    $('#container').html(html);
});

$(document).on('click', '#container ul li', function(e){
    e.preventDefault();
    var formID = $(this).children('a').attr('href');
    socket.emit('getForm', formID, function(form){
        var data = '<div id="formView"><p>Name: '+ form.name + '</p><p>Email: '+ form.email + '</p><p>City: ' + form.city + '</p><p>Age: ' + form.age + '</p><p>Gender: ' + form.gender + '</p><p>Faculty: ' + form.faculty + '</p></div>';
        $('#container').html(data);
        $(document).attr("title", form.name + " | Students");
    });
});

$('#search-bar').on('input', function() {
    var input = ($(this).val());
    socket.emit('search', input, function(forms, error) {
        if(!error){
            if(forms.length === 0){
                var message = 'No Students Found';
                updateFormsList(undefined, message);
                return;
            }
            updateFormsList(forms);
            return;
        } else {
            console.log(error);
        }
    });
});