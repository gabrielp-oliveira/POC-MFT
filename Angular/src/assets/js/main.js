
'use strict';

var App = {

	html: $('#html'),
	body: $('#body'),

	init: function() {
		
		$(function() { App.onReady(); });
		
	},

	/* calls automagically the template init function */
	onReady: function() {
	    
	    this.initCommon();

	},

	initCommon: function() {

		// modal to set delivery dates
		App.setDeliveryDates();

		// custom select
		// $('.js-custom--select').selectric({
		//     maxHeight: 300,
		//     disableOnMobile: false,
		//     nativeOnMobile: false,
		//     arrowButtonMarkup    : '<b class="button"><span class="icon icon-arrow-down"></span></b>',
		//     optionsItemBuilder: '<span>{text}</span>',
			
		// });

		$('#selectOrders1').trigger("onchange");
		// custom sliders
		$(".js-range-slider").ionRangeSlider({
	       type: "double",
	       grid: true,
	       values: ['$0','$25','$50','$75','$100'],
	       // prefix: "$",
	       grid_num: 1,
	       hide_min_max: true,
	       hide_from_to: true
		});

		// product detail
		App.html.delegate( ".js-product-detail", "click", function(e) {
			e.preventDefault();

			Product.showDetail( $(this).data('guid') );

		});
	},

	setDeliveryDates: function(){

		let $this = $('.js-modal-delivery');

		$('.js-modal-delivery').on('click', function(){

		});

		$.magnificPopup.open({
			mainClass: 'modal-small',
			fixedContentPos: false,
			prependTo: $this.after(),
			items: {
				src: '#js-modal-delivery',
				type: 'inline'
			}
		});
	}
};


var Product = {
	showDetail: function(ID) {

	},	
}


App.init();

