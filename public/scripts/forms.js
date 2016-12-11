		$('#sign-up-button').click(function() {
                    $('#form-signup').fadeIn(300);
                    $('#form-login').fadeOut();
                    $('#page-header').css('opacity','0.3');
                    $('#info').css('opacity','0.3');
                    $('#page-footer').css('opacity','0.3');
                });
               
                $('#log-in-button').click(function() {
                    $('#form-login').fadeIn(300);
                    $('#form-signup').fadeOut();
                    $('#page-header').css('opacity','0.3');
                    $('#info').css('opacity','0.3');
                    $('#page-footer').css('opacity','0.3');
                });
                
                $('#close-form-login').click(function() {
                    $('#form-login').fadeOut();
                    $('#page-header').css('opacity','1');
                    $('#info').css('opacity','1');
                    $('#page-footer').css('opacity','1');
                });
                
                $('#close-form-signup').click(function() {
                    $('#form-signup').fadeOut();
                    $('#page-header').css('opacity','1');
                    $('#info').css('opacity','1');
                    $('#page-footer').css('opacity','1');
                });