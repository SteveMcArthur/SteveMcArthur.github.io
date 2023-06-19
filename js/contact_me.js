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
    });
/*     $("#sendMessageButton").on("click", function(event){
        $(this).attr("disabled",true);
    }); */
    
    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            alert("submit error");
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();

            $.ajax({
                type: 'POST',
                url: "https://email-webservice.onrender.com/email/addemail",
                //url: "http://localhost:3000/email/addemail",
                dataType: "JSON",
                data: {
                    "subject": name+" sent you an enquiry via stevemcarthur.co.uk",
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "message": message,
                    'form_api_token':'wzx70479xl1q'
                },
                cache: false,
                complete: function(){
                   
                },
                success: function() {
                    // Success message
                    if(!justHidden){
                        $('#success').show();
                    }
                    justHidden = false
                    //clear all fields
                    $("#contactForm").trigger("reset");
                    $("#sendMessageButton").removeClass("disabled");
          
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
                    //$("#sendMessageButton").removeAttr("disabled");
         
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
