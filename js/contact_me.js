/*global $*/
// Contact Form Scripts
$(function() {

    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
    
    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();

            $.ajax({
                url: "https://getsimpleform.com/messages/ajax?form_api_token=74603f5b7f9af3a58f61049a60b94ded",
                dataType: "jsonp",
                data: {
                    "Title": name+" sent you an enquiry via stevemcarthur.co.uk",
                    "Name": name,
                    "Phone": phone,
                    "Email": email,
                    "Details": message
                },
                cache: false,
                success: function() {
                    // Success message
                    $("#success").html("<div class='alert alert-success'>");
                    $("#success > .alert-success").html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $("#success > .alert-success")
                        .append("<strong>Your message has been sent. </strong>");
                    $("#success > .alert-success")
                        .append("</div>");

                    //clear all fields
                    $("#contactForm").trigger("reset");
                    $("#success").addClass("show");
                },
                error: function() {
                    // Fail message
                    $("#success").html("<div class='alert alert-danger'>");
                    $("#success > .alert-danger").html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
                        .append("</button>");
                    $("#success > .alert-danger").append("<strong>Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!");
                    $("#success > .alert-danger").append("</div>");
                    //clear all fields
                    $("#contactForm").trigger("reset");
                    $("#success").addClass("show");
                },
            });
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$("#name").focus(function() {
    $("#success").html("").removeClass("show");
});
