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

    var justHidden = false;
    $("[data-hide]").on("click", function(event){
        $("#" + $(this).attr("data-hide")).hide();
        justHidden = true;
        event.stopPropagation();
    })
    
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
                url: "https://designerhart.co.uk/email?form_api_token=74603f5b7f9af3a58f61049a60b94ded",
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
                    if(!justHidden){
                        $('#success').show();
                    }
                    justHidden = false
                    //clear all fields
                    $("#contactForm").trigger("reset");
          
                },
                error: function() {
                    // Fail message
                    $("#failed > span").text(name);
                    if(!justHidden){
                        $('#failed').show();
                    }
                    justHidden = false;
                    //clear all fields
                    //$("#contactForm").trigger("reset");
         
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
    $("#success,#failed").hide();
});
