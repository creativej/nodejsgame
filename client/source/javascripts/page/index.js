var app = app || {};

(function($, window, app) {
  $(function(){
    var
        userList = app.components.userList($('#userlist')),
        socket = io.connect("http://localhost:8001"),
        room = app.Room($, app)
        ;

    room.init(socket);

    room.on('disconnect', function(e, user) {
        userList.remove(user);
        room.removeUser(user);
        console.log('disconnect');
    });

    socket.on('userlist', function(users) {
        var currentUser = room.getCurrentUser();
        userList.set(users);
        userList.setCurrentUser(currentUser);

        $.each(users, function(idx, userData) {
            var user = room.getUser(userData.hash);
            if (!user) {
                user = app.user($, app, socket, userData);
                room.addUser(user);
            }
        });


        socket.on('changed', function(userData) {
            var user = room.getUser(userData.hash);

            if (!user.isActive) {
                return;
            }

            if (user.hash != room.getCurrentUser().hash) {
                user.setMouse(userData.mouse);
            }
        });

        socket.on('mouseclick', function(userData, elementPath) {
            var user = room.getUser(userData.hash);

            if (!user.isActive) {
                return;
            }

            var mouse = userData.mouse;
            // instance.getMouse().showClick(mouse);
            elementPath.reverse();

            var $dom = $('body');
            $.each(elementPath, function(idx, element) {
                $dom = $dom.children("*:eq(" + element.pos + ")");
            });
            console.log($dom);
            console.log($dom.length);
            $dom.click();
        });
    });

    socket.on('activated', function(userData) {
        var
            user = app.user($, app, socket, userData),
            currentUser = room.getCurrentUser()
            ;

        if (userData.hash === currentUser.hash) {
            $('body').addClass('activated');
            $('.stage .title').text(userData.name + ' in da house!');
            currentUser = user;
            currentUser.activate(room);
        } else {
            userList.add(userData);
            room.addUser(user);
        }

    });

    $('.enter').on('click', function() {
        var currentUser = room.getCurrentUser();

        currentUser.name = $.trim($('.user-input').val()) || '[unknown]';

        socket.emit('enter', currentUser);
    });


    // $(Playground).on('isActive', function(e, user){
    //   $('body').removeClass('isVisitor');
    //   $("#" + user.data.hash).addClass('active');
    // });

    // SimpleEvent.on(Playground.users, 'added', function(user){
    //   $('#userlist ul').append('<li id="'+user.hash+'">'+user.hash+'</li>');

    //   SimpleEvent.on(user, 'mouse.changed', updateMouse);
    // });

    // SimpleEvent.on(Playground.users, 'removed', function(user){
    //   $('#' + user.hash).remove();
    // });

    // $form = $('form.playground');
    // $form.on('click', '.btn', function(){
    //   Playground.user.joinOrCreate(
    //     $form.find('input[name="playground"]').val(),
    //     $form.find('input[name="password"]').val()
    //   );
    // });
  });
}($, window, app));
