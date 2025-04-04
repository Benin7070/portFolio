(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });

    //learn More Button
    $('.learn-more-btn').click(function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('#portfolio').offset().top - 45
        }, 1500, 'easeInOutExpo');
    });
    
    //contact-me-button
    $('.contact-me-btn').click(function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('#contact').offset().top - 45
        }, 1500, 'easeInOutExpo');
    });

    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            }
        }
    });
    
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);



document.addEventListener("DOMContentLoaded", function () {
    let popup = document.querySelector(".video-popup");
    let popupIframe = popup.querySelector(".popup-iframe");
    let leftArrow = document.querySelector(".left-arrow");
    let rightArrow = document.querySelector(".right-arrow");
    let videoButtons = document.querySelectorAll(".play-video");
    let currentIndex = -1;

    // Open Video Popup
    document.addEventListener("click", function (event) {
        let button = event.target.closest(".play-video");

        if (button) {
            let videoSrc = button.getAttribute("data-video");
            let videosArray = Array.from(videoButtons);
            currentIndex = videosArray.indexOf(button);

            if (videoSrc) {
                showPopup(videoSrc);
            }
        }
    });

    function showPopup(videoSrc) {
        popup.style.display = "flex";
        document.querySelector(".portfolio").classList.add("blur-bg");

        // Set Vimeo video source
        popupIframe.src = videoSrc + "&autoplay=1"; // Auto-plays the video
        popup.classList.add("active");

        updateArrows();
    }

    // Close Popup
    popup.addEventListener("click", function (event) {
        if (!popupIframe.contains(event.target) && !event.target.classList.contains("nav-arrow")) {
            closePopup();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "s") {
            closePopup();
        }
    });

    function closePopup() {
        popup.classList.remove("active");
        setTimeout(() => {
            popup.style.display = "none";
            popupIframe.src = "";
        }, 400);
        document.querySelector(".portfolio").classList.remove("blur-bg");
    }

    // Navigation
    function navigateVideo(direction) {
        let videosArray = Array.from(videoButtons);
        let newIndex = currentIndex + direction;
    
        if (newIndex >= 0 && newIndex < videosArray.length) {
            let newVideoSrc = videosArray[newIndex].getAttribute("data-video");
    
            // Apply exit animation
            let exitAnimation = direction === 1 ? "slideOutLeft" : "slideOutRight";
            let enterAnimation = direction === 1 ? "slideInRight" : "slideInLeft";
    
            popupIframe.style.animation = `${exitAnimation} 0.4s ease-in-out`;
    
            setTimeout(() => {
                popupIframe.src = newVideoSrc + "&autoplay=1"; // Change video
    
                // Hide iframe momentarily
                popupIframe.style.opacity = "0";
                popupIframe.style.animation = ""; // Remove previous animation
    
                setTimeout(() => {
                    popupIframe.style.animation = `${enterAnimation} 0.4s ease-in-out`;
                    popupIframe.style.opacity = "1"; // Fade-in new video
                    currentIndex = newIndex;
                    updateArrows();
                }, 100); // Small delay to avoid flickering
            }, 400); // Wait for exit animation to finish
        }
    }
    

    leftArrow.addEventListener("click", function (event) {
        event.stopPropagation();
        navigateVideo(-1);
    });

    rightArrow.addEventListener("click", function (event) {
        event.stopPropagation();
        navigateVideo(1);
    });

    function updateArrows() {
        leftArrow.style.display = currentIndex > 0 ? "block" : "none";
        rightArrow.style.display = currentIndex < videoButtons.length - 1 ? "block" : "none";
    }

    // Keyboard Controls
    document.addEventListener("keydown", function (event) {
        if (popup.style.display === "flex") {
            switch (event.key) {
                case "ArrowLeft":
                    navigateVideo(-1);
                    break;
                case "ArrowRight":
                    navigateVideo(1);
                    break;
            }
        }
    });
});


//generating content for the services page
document.addEventListener("DOMContentLoaded", async function () {
    const container2 = document.getElementById("services-container");

    try {
        const response = await fetch("/api/services");
        const services = await response.json();

        const fragment = document.createDocumentFragment();

        services.forEach(service => {
            let serviceDiv = document.createElement("div");
            serviceDiv.className = "col-lg-6 wow fadeInUp";
            serviceDiv.setAttribute("data-wow-delay", `${service.delay}`);

            serviceDiv.innerHTML = `
                 <div class="service-item">
                    <div class="service-icon">
                        <i class="${service.class}"></i>
                    </div>
                    <div class="service-text">
                        <h3>${service.heading}</h3>
                        <p style="font-size:90%">
                        ${service.content}
                        </p>
                    </div>
                </div>
            `;

            fragment.appendChild(serviceDiv);
        });

        // Append all elements to the container at once
        container2.appendChild(fragment);
    } catch (error) {
        console.error("Error fetching service data:", error);
    }
});


