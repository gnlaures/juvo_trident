var pageNumber = 1, pageSize = 10;
jQuery(document).ready(function($) {
	loadHomes();
	loadRecentlyViewedProperties();
});
let lastSortOrder = null;
function loadHomes() {
	const sortOrderElement = document.getElementById('OrderSortSearch');
    let sortOrder = '';
    if (sortOrderElement) {
        sortOrder = sortOrderElement.value;
	    if (lastSortOrder !== sortOrder) {
	        pageNumber = 1;
	        lastSortOrder = sortOrder;
			jQuery('#prop-view').empty();
	    }
	} else {
		return;
	}
	const urlParams = new URLSearchParams(window.location.search);
	let data = {
        sortOrder: sortOrder,
        page_num: pageNumber,
		display_type: 'search'
    };
	for (var key in jsparams) {
	  	if (jsparams.hasOwnProperty(key)) {
			var val = jsparams[key];
			data[key] = val;
	  	}
	}
	jQuery('#loading').show();
	jQuery('#loadMoreButton').hide();
	$.ajax({
		url: searchMainUrl,
		contentType: "application/json",
		dataType: 'json',
		data: data,
		type: 'GET',
		success: function (result) {
			$('#loading').hide();
			const data = result;
			if (data.length > 0) {
				let preloadCounter = 0;
				data.forEach(function(value, index) {
					jQuery('#prop-view').append(value.homes);
					if (index === 0) {
                        $(value.homes).find('img').each(function() {
                            if (preloadCounter < 2) {
                                preloadImage(this.src);
                                preloadCounter++;
                            }
                        });
                    }
				});
				pageNumber++;
				if (data.length >= pageSize) {
					jQuery('#loadMoreButton').show();
				} 
			}
			window.document.dispatchEvent(new Event("DOMContentLoaded", {
				bubbles: true,
				cancelable: true
			}));
		}
	});
}
function preloadImage(imageUrl) {
    var link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
}
function loadRecentlyViewedProperties() {
	const sortOrderElement = document.getElementById('OrderSortSearch');
    if (sortOrderElement) {
	    let viewedProperties = JSON.parse(localStorage.getItem('recentlyViewedProperties')) || [];
	    let propertyIds = viewedProperties.map(p => p.id).join(',');
	    let containerRV = jQuery('.recently-viewed-properties .elementor-widget-container .elementor-shortcode');
	    $.ajax({
	        url: searchRecentlyViewedUrl,
	        type: 'POST',
	        data: {display_type: 'viewed', propertyIds: propertyIds, page_num: 1, page_size: 10},
	        success: function(response) {
	            containerRV.html(response.data);
	        },
	        error: function(xhr, status, error) {
	            console.error("Error in AJAX Request: ", error);
	        }
	    });
	} else {
		return;
	}
}