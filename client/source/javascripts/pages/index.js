//= require libs/jquery-1.7.1.min

(function($, window) {
    $(function() {
        $('.enter').on('click', function() {
            var name = $.trim($('.user-input').val()) || '[unknown]';

            // socket.emit('enter', currentUser);
        });
    });
}($, window));
