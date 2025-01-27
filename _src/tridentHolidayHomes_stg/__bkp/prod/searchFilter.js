function clearSearchFilter() {
    Object.keys(localStorage).forEach((key)=>{
        if (key.startsWith('thh-')) {
            localStorage.removeItem(key);
        }
    })
}
function clearDestinationViaTab(event) {
    event.preventDefault();
    var formDiv = document.querySelector('#formFilterAccommodation');
    var destinationInput = formDiv.querySelector('input.destination');
    if (destinationInput) {
        $(destinationInput).val('').trigger('change');
    }
    window.location.href = event.currentTarget.href;
}
function clearDatesViaTab(event) {
    event.preventDefault();
    var formDiv = document.querySelector('#formFilterAccommodation');
    var dateRangeInput = formDiv.querySelector('input#travel-period');
    var dateFromInput = formDiv.querySelector('input#dateFrom');
    var dateToInput = formDiv.querySelector('input#dateTo');
    if (dateRangeInput) {
        $(dateRangeInput).val('').trigger('change');
    }
    if (dateFromInput) {
        $(dateFromInput).val('').trigger('change');
    }
    if (dateToInput) {
        $(dateToInput).val('').trigger('change');
    }
    window.location.href = event.currentTarget.href;
}
function clearOccupantsViaTab(event) {
    event.preventDefault();
    var formDiv = document.querySelector('#formFilterAccommodation');
    var occupancyInput = formDiv.querySelector('input#occupancy-box');
    var adultNumInput = formDiv.querySelector('input#AdultNum');
    var childrenNumInput = formDiv.querySelector('input#ChildrenNum');
    if (occupancyInput) {
        $(occupancyInput).val('').trigger('change');
    }
    if (adultNumInput) {
        $(adultNumInput).val('').trigger('change');
    }
    if (childrenNumInput) {
        $(childrenNumInput).val('').trigger('change');
    }
    window.location.href = event.currentTarget.href;
}
function clearFilterViaTab(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.href = event.currentTarget.href;
}
function formatOutput(optionElement) {
    if (optionElement.title == 'city') {
        var $state = jQuery('<span class="filterWeight600">' + optionElement.text + '</span>');
        return $state;
    } else {
        return optionElement.text;
    }
}
function addLeadingZero() {
    var dayNumbers = $('.calendar-table td');
    dayNumbers.each(function() {
        var dayNumber = $(this).text().trim();
        if (dayNumber.length === 1) {
            $(this).text('0' + dayNumber);
        }
    });
}
function hidePrevButtonIfCurrentMonth() {
    var currentMonthYear = moment().format('MMMM YYYY');
    var displayedMonthYear = $('.daterangepicker .left .calendar-table th.month').text().trim();
    if (currentMonthYear === displayedMonthYear) {
        $('.prev').addClass('unclickable');
        $('.prev span').addClass('hidden-calendar');
    } else {
        $('.prev').removeClass('unclickable');
        $('.prev span').removeClass('hidden-calendar');
    }
}
jQuery(document).ready(function($) {
    var screenwidth = $("body").width();
    if (!$('body').hasClass('home')) {
        clearSearchFilter();
        $('#map_canvas').addClass('mapHomePage');
        $('#map_canvas').removeClass('mapOtherPage');
    }
    $('form#formFilterAccommodation').submit(function(e) {
        for (var a in localStorage) {
            if (a.indexOf('thh-') != -1 && localStorage[a]) {
                $(this).append('<input type="hidden" name="'+a+'" value="'+localStorage[a]+'" />');
            }
        }
        var dateFrom = $('#dateFrom').val();
        var dateTo = $('#dateTo').val();
        var startDate = moment(dateFrom, 'YYYY-MM-DD');
        var endDate = moment(dateTo, 'YYYY-MM-DD');
        if (startDate.isValid() && endDate.isValid()) {
            $('input[name="daterange"]').val(startDate.format('DD/MM/YYYY') + ' - ' + endDate.format('DD/MM/YYYY'));
        }
        return true;
    });
    $('.destination').select2({
        placeholder: "Property or Location",
        templateResult: formatOutput,
        allowClear: true
    });
    if (screenwidth <= 767) {
        $('.desktopDestination').remove();
        $('.select2-container, .selection, .select2-selection.select2-selection--single, .select2-selection__rendered, .select2-selection__placeholder, .destination, .select2-search, .select2-search__field').on('click', function (e) {
            $(".select2-container--open").find(".select2-search__field").focus();
        });
    }
    if (screenwidth > 767) {
        $('.select2-container').on('click', function (e) {
            $('.desktopDestination').toggle();
            $("#inputSearch").focus();
            if ($('.desktopDestination').is(':visible')) {
                $("#inputSearch").val('');
                $("#inputSearch").trigger('input');
            }
        });
        $('.destinationLefttabs > a').click(function() {
            $('.destinationLefttabs > a').removeClass('active');
            $(this).addClass('active');
            $('.desktopDestination .rightDiv').hide();
            $('.desktopDestination .'+$(this).data('destid')).show();
        });
        $('.countyBlock a').click(function() {
            $('.destination').val($(this).data('destid')).trigger('change');
            $('.desktopDestination').hide();
            $("#inputSearch").val('');
        });
        $("#inputSearch").on('input', function () {
            var filter = $(this).val();
            if (filter.length > 0) {
                $('.destinationLefttabs').hide();
                $('.desktopDestination .rightDiv').show();
                $('.desktopDestination').addClass('searchview');
            } else {
                $('.destinationLefttabs').show();
                $('.desktopDestination').removeClass('searchview');
                $('.destinationLefttabs a.active').trigger('click');
            }
            $(".countyBlock ul li, .countyBlock h4:not('.maindest')").each(function () {
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).hide();
                } else {
                    $(this).show()
                }
            });
        });
        $(document).on('click', function (e) {
            if ($(e.target).closest(".desktopDestination").length === 0 && $(e.target).closest(".select2-container").length === 0) {
                if ($('.desktopDestination').is(':visible')) {
                    $(".desktopDestination").hide();
                    $("#inputSearch").val('');
                }
            }
        });
    }
    moment.updateLocale('en', {
        week: { dow: 1 }
    });
    var startDate = $('#dateFrom').val();
    var endDate = $('#dateTo').val();
    var isValidStartDate = moment(startDate, 'YYYY-MM-DD', true).isValid();
    var isValidEndDate = moment(endDate, 'YYYY-MM-DD', true).isValid();
    var dateRangePickerOptions = {
        "autoApply": true,
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT"
            ],
            "monthNames": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
        },
        "linkedCalendars": false,
        "showCustomRangeLabel": false,
        "minDate": moment().add(2, 'days'),
        "maxDate": moment().add(24, 'months'),
        opens: 'left',
        isOutsideRange: function(date) {
            return date < moment() || date > moment().add(24, 'months');
        },
        "autoUpdateInput": false
    };
    if (isValidStartDate && isValidEndDate) {
        dateRangePickerOptions.startDate = moment(startDate).format('DD/MM/YYYY');
        dateRangePickerOptions.endDate = moment(endDate).format('DD/MM/YYYY');
    }
    $('input[name="daterange"]').daterangepicker(dateRangePickerOptions, function(start, end, label) {
        if (start.isValid() && end.isValid()) {
            $('#dateFrom').val(start.format('YYYY-MM-DD'));
            $('#dateTo').val(end.format('YYYY-MM-DD'));
            $('input[name="daterange"]').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
        } else {
            $('#dateFrom').val('');
            $('#dateTo').val('');
            $('input[name="daterange"]').val('');
        }
        addLeadingZero();
        hidePrevButtonIfCurrentMonth();
        checkRowsAndHide();
    });
    $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
        $('#dateFrom').val(picker.startDate.format('YYYY-MM-DD'));
        $('#dateTo').val(picker.endDate.format('YYYY-MM-DD'));
    });
    function addLeadingZero() {
        var dayNumbers = $('.calendar-table td');
        dayNumbers.each(function() {
            var dayNumber = $(this).text().trim();
            if (dayNumber.length === 1) {
                $(this).text('0' + dayNumber);
            }
        });
    }
    function hidePrevButtonIfCurrentMonth() {
        var currentMonthYear = moment().format('MMMM YYYY');
        var displayedMonthYear = $('.daterangepicker .left .calendar-table th.month').text().trim();
        if (currentMonthYear === displayedMonthYear) {
            $('.prev').addClass('unclickable');
            $('.prev span').addClass('hidden-calendar');
        } else {
            $('.prev').removeClass('unclickable');
            $('.prev span').removeClass('hidden-calendar');
        }
    }
    function setupMutationObserver() {
        var targetNode = $('.daterangepicker')[0];
        var config = { attributes: false, childList: true, subtree: true };
        var callback = function(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addLeadingZero();
                    hidePrevButtonIfCurrentMonth();
                    checkRowsAndHide();
                }
            }
        };
        var observer = new MutationObserver(callback);
        if (targetNode) {
            observer.observe(targetNode, config);
        }
    }
    setupMutationObserver();
    function checkRowsAndHide() {
        $('.calendar-table tbody tr').each(function() {
            var allOff = true;
            $(this).find('td').each(function() {
                if (!$(this).hasClass('off') || !$(this).hasClass('ends')) {
                    allOff = false;
                    return false;
                }
            });
            if (allOff) {
                $(this).addClass('displaynone');
            }
        });
    }
    $('input[name="daterange"]').on('show.daterangepicker', function() {
        addLeadingZero();
        hidePrevButtonIfCurrentMonth();
        checkRowsAndHide();
    });
    $('input.deletable').wrap('<span class="deleteicon"></span>').after($('<span>x</span>').click(function() {
        $(this).prev('input').val('').trigger('change');
    }));
    $('input.add_dates').wrap('<span class="deleteicon"></span>').after($('<span>x</span>').click(function() {
        $(this).prev('input').val('').trigger('change');
        $('#dateFrom').val('');
        $('#dateTo').val('');
    }));
    $('input#occupancy-box').wrap('<span class="deleteicon"></span>').after($('<span>x</span>').click(function() {
        $(this).prev('input').val('').trigger('change');
        $('#AdultNum').val('1');
        $('#ChildrenNum').val('0');
    }));
    function updateElementsSTabs() {
        let elementsUpdated = false;
        if ($('#rentalContent').length) {
            $('#rentalContent').addClass("rentalContentFixed");
            elementsUpdated = true;
        }
        if ($('#mapSection').length) {
            $('#mapSection').addClass("mapHideClass");
            elementsUpdated = true;
        }
        if (elementsUpdated) {
            observerSTabs.disconnect();
        }
    }
    var observerSTabs = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                updateElementsSTabs();
            }
        });
    });
    observerSTabs.observe(document.body, { childList: true, subtree: true });
    function tabOneAction() {
        $('.tabOne').addClass("active");
        $('.tabTwo').removeClass("active");
        $('#rentalContent').addClass("rentalContentFixed");
        $('#mapSection').removeClass("mapSectionFixed").addClass("mapHideClass");
    }
    function tabTwoAction() {
        $('.tabTwo').addClass("active");
        $('.tabOne').removeClass("active");
        $('#rentalContent').removeClass("rentalContentFixed");
        $('#mapSection').addClass("mapSectionFixed").removeClass("mapHideClass");
    }
    $(".tabOne").on("click touchstart", tabOneAction);
    $(".tabTwo").on("click touchstart", tabTwoAction);
    $('.tabOne').addClass("active");
    $('.tabTwo').removeClass("active");
});
document.addEventListener("DOMContentLoaded", function() {
    const inputContainingDateFrom = document.querySelector("#dateFrom");
    const inputContainingDateTo = document.querySelector("#dateTo");
    if (inputContainingDateFrom) {
        const urlParams = new URLSearchParams(window.location.search);
        const dateRangeParams = urlParams.get('daterange');
        if (dateRangeParams === null || dateRangeParams.trim() === '') {
            const dateRangeValue = document.querySelector("#travel-period");
            if (dateRangeValue) {
                dateRangeValue.value = '';
            }
        }
    }
});
jQuery(document).ready(function ($) {
    jQuery(document.body).on('click', function (event) {
        var head = jQuery(event.target).closest('.c-mobileSearchDestination__list__item__head');
        if (head.length) {
            var item = head.closest('.c-mobileSearchDestination__list__item');
            item.toggleClass('is-active');
            event.stopPropagation();
        }
    });
    jQuery(document.body).on('click', '.js-closeMobileFilterDestination', function () {
        jQuery('.c-mobileFilterDestination').removeClass('is-active');
    });
    jQuery(document.body).on('click', '.js-openMobileFilterDestination', function () {
        jQuery('.c-mobileFilterDestination').addClass('is-active');
        setTimeout(() => {
            $("#mobileFilerDestination").focus();
        }, 400);
    });
    jQuery(document.body).on('click', '.c-mobileSearchDestination__list__item__content__block a', function (event) {
        var linkContent = jQuery(this).attr('aria-label');
        var id = jQuery(this).data("destid");
        $(".destination").val(id);
        function changeInputValues(element) {
            setTimeout(function () {
                jQuery(element).each(function () {
                    if (jQuery(this).is('input')) {
                        jQuery(this).val(linkContent);
                        jQuery(this).attr('placeholder', linkContent);
                    } else {
                        jQuery(this).text(linkContent);
                    }
                });
            }, 0);
        }
        changeInputValues('.c-mobileSearchDestination__filter');
        changeInputValues('.select2-selection__placeholder');
        changeInputValues('.select2-search__field');
    });
});
jQuery(document).ready(function($) {
    function checkIfAllHidden($container, $base) {
        var allHidden = true;
        $container.find($base).each(function() {
            if ($(this).css('display') !== 'none') {
                allHidden = false;
                return false;
            }
        });
        return allHidden;
    }
    $("#mobileFilerDestination").on("input", function() {
        var searchTerm = $(this).val().toLowerCase();
        if (searchTerm.length > 0) {
            $(".c-mobileSearchDestination__list__item").addClass("is-active");
        } else {
            $(".c-mobileSearchDestination__list__item").removeClass("is-active");
        }
        $(".c-mobileSearchDestination__list__item__content__block a").each(function() {
            var $link = $(this);
            var linkText = $link.text().toLowerCase();
            if (linkText.includes(searchTerm)) {
                $link.show();
            } else {
                $link.hide();
            }
        });
        $(".c-mobileSearchDestination__list__item__content__block").each(function() {
            var $contentBlock = $(this);
            if (checkIfAllHidden($contentBlock, 'a')) {
                $contentBlock.hide();
            } else {
                $contentBlock.show();
            }
        });
        $(".c-mobileSearchDestination__list__item").each(function() {
            var $contentBlock = $(this);
            if (checkIfAllHidden($contentBlock, '.c-mobileSearchDestination__list__item__content__block')) {
                $contentBlock.hide();
            } else {
                $contentBlock.show();
            }
        });
    });
});