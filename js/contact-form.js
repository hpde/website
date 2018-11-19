
$(document).ready(function () {
  "use strict";
	generateCaptcha();
	$('#captcha-refresh').on('click', function() {
		generateCaptcha();
	});

  // Contact form submit
  $('form.contactForm').submit(function() {
    var f = $(this).find('.form-group'),
      ferror = false,
      emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

    f.children('input').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;

          case 'email':
            if (!emailExp.test(i.val())) {
              ferror = ierror = true;
            }
            break;

          case 'checked':
            if (! i.is(':checked')) {
              ferror = ierror = true;
            }
            break;

          case 'regexp':
            exp = new RegExp(exp);
            if (!exp.test(i.val())) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
	
    f.children('textarea').each(function() { // run all inputs

      var i = $(this); // current input
      var rule = i.attr('data-rule');

      if (rule !== undefined) {
        var ierror = false; // error flag for current input
        var pos = rule.indexOf(':', 0);
        if (pos >= 0) {
          var exp = rule.substr(pos + 1, rule.length);
          rule = rule.substr(0, pos);
        } else {
          rule = rule.substr(pos + 1, rule.length);
        }

        switch (rule) {
          case 'required':
            if (i.val() === '') {
              ferror = ierror = true;
            }
            break;

          case 'minlen':
            if (i.val().length < parseInt(exp)) {
              ferror = ierror = true;
            }
            break;
        }
        i.next('.validation').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
      }
    });
    if (ferror) return false;
    else var str = $(this).serialize();

    $('#errormessage').addClass("show");
    $('#errormessage').html("Testing");
	
    $.ajax({
      type: "POST",
      url: "contactform/contactform.php",
      data: str,
      success: function(msg) {
        // alert(msg);
        if (msg == 'OK') {
          $('#sendmessage').addClass("show");
          $('#errormessage').removeClass("show");
          $('.contactForm').find("input, textarea").val("");
        } else {
          $('#sendmessage').removeClass("show");
          $('#errormessage').addClass("show");
          $('#errormessage').html(msg);
        }

      }
    });
    return false;
  });
});

function generateCaptcha(){
	var a = Math.ceil(Math.random() * 9)+ '';
	var b = Math.ceil(Math.random() * 9)+ '';
	var c = Math.ceil(Math.random() * 9)+ '';
	var d = Math.ceil(Math.random() * 9)+ '';
	var e = Math.ceil(Math.random() * 9)+ '';

	var code = a + b + c + d + e;
	$('#captcha-container').html(code);
	$('#captcha-value').val(code);
}

function isCaptchaValid(){
	var realCaptcha =   $('#captcha-value').val();
	var inputCaptcha = $('#captcha-input').val();
	if(realCaptcha == inputCaptcha)
		return true;
	return false;
}
$.fn.goValidate = function() {
	var $form = this,
		$inputs = $form.find(':input').not('[name="captcha-input"]');

	var validators = {
		name: {
			regex: /^[A-Za-z]{3,}$/
		},
		pass: {
			regex: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
		},
		email: {
			regex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
		}
	};
	var validate = function(klass, value) {
		var isValid = true,
			error = '';

		if (!value && /required/.test(klass)) {
			error = 'This field is required';
			isValid = false;
		} else {
			klass = klass.split(/\s/);
			$.each(klass, function(i, k){
				if (validators[k]) {
					if (value && !validators[k].regex.test(value)) {
						isValid = false;
						error = validators[k].error;
					}
				}
			});
		}
		return {
			isValid: isValid,
			error: error
		}
	};
	var showError = function($input) {
		var klass = $input.attr('class'),
			value = $input.val(),
			test = validate(klass, value);

		$input.removeClass('invalid');
		$('#form-error').addClass('hide');

		if (!test.isValid) {
			$input.addClass('invalid');

			if(typeof $input.data("shown") == "undefined" || $input.data("shown") == false){
				$input.popover('show');
			}

		}
		else {
			$input.popover('hide');
		}
	};

	$inputs.on('shown.bs.popover', function () {
		$(this).data("shown",true);
	});

	$inputs.on('hidden.bs.popover', function () {
		$(this).data("shown",false);
	});

	$form.submit(function(e) {

		$inputs.each(function() { /* test each input */
			if ($(this).is('.required') || $(this).hasClass('invalid')) {
				showError($(this));
			}
		});

		if ($form.find('.invalid').length) { /* form is not valid */
			e.preventDefault();
		}

		if(!isCaptchaValid()){
			$('#captcha-input').popover('show');
			e.preventDefault();
		}
		else
			$('#captcha-input').popover('hide');
	});
	return this;
};


$('form').goValidate();
