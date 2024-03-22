(function($){
	$.fn.numberCounting = function(pOption){
		$.defaultOption = {
			items: $(this),
			counting: $(this).html(),
			terms: 10000,
			countingTime: 100,
			comma: false
		}
		pOption = $.extend(null, $.defaultOption, pOption);
		var counting = new Counting(pOption);
	}

	function Counting(myOption){
		this.options = {
			items: null,
			counting: null,
			terms: null,
			countingTime: null,
			comma:null
		}
		this.init(myOption);
	}

	Counting.prototype.init = function(myOption){
		this.options.items = myOption.items;
		this.options.counting = myOption.counting;
		this.options.terms = myOption.terms;
		this.options.countingTime = myOption.countingTime;
		this.options.comma = myOption.comma;
		this.numberStart();
	}

	Counting.prototype.numberStart = function(){
		var lStartNum = this.options.counting - this.options.terms;
		var lThis = this;
		var lTimer = null;
		this.options.items.html(lStartNum);
		numberUp();

		function numberUp(){
			var lNowNum = lThis.options.items.html();
			lNowNum = lThis.removeComma(lNowNum);
			if(lTimer) clearTimeout(lTimer);

			if(lThis.options.counting != lNowNum){
				lNowNum++;
				if(lThis.options.comma) lNowNum = lThis.numberComma(lNowNum);
				lThis.options.items.html(lNowNum);
				lTimer = setTimeout(numberUp, lThis.options.countingTime);
			}
		}
	}

	Counting.prototype.numberComma = function(pNum){
		var len, point, str;

		pNum = pNum + "";
		point = pNum.length % 3 ;
		len = pNum.length;

		str = pNum.substring(0, point);
		while (point < len) {
			if (str != "") str += ",";
			str += pNum.substring(point, point + 3);
			point += 3;
		}

		return str;
	}


	Counting.prototype.removeComma = function(pNum){
		n = parseInt(pNum.replace(/,/g,""));
		return n;

	}

})(jQuery)

