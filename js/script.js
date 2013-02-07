(function () {
	var quotes = document.querySelectorAll('article ul li').length;
	var current = null;
	var hearts = [];
	var nextTimeout = null;
	var nextInterval = null;

	function loadQuote(e) {
		if (e && e.preventDefault)
			e.preventDefault();

		var next = Math.ceil(Math.random() * quotes);

		current = $('#q' + next).html();

		window.location = "#q" + next;

		$('#share-fb').attr('href', ['http://www.facebook.com/sharer.php?s=100',
				'p%5Btitle%5D='+ encodeURIComponent(current),
				'p%5Bsummary%5D=Luvnotes by Piccsy Playground',
				'p%5Burl%5D='+ encodeURIComponent(window.location),
				'p%5Bimages%5D%5B0%5D='+ encodeURIComponent(window.location.origin + window.location.pathname + '/gfx/hearticon.png')].join('&'));

		$('#share-tw').attr('href', ['http://www.twitter.com/share?text='+ encodeURIComponent(current),
				'via=ilovepiccsy',
				'url='+ encodeURIComponent(window.location)].join('&'));
	}

	function submit(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}

		$('.submit .dialog-container').css('display', 'block');
	}

	function share(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}

		$('.share-page .dialog-container').css('display', 'block');
	}

	function floatHearts(e) {
		if (e.pageX) {
			for (var i = 0; i < 5; i++) {
				var node = $('<div class="float-heart">');
				$('#hearts').append(node);

				hearts.push({
					'x': e.pageX + Math.random() * 5,
					'y': e.pageY - Math.random() * 5,
					'vx': Math.random() * 4 - 2,
					'vy': Math.random() * 1 - 1,
					'life': 30 + Math.random() * 30,
					'dom': node
				});
			}
		}
	}

	function animateHearts() {
		for (var i = 0; i < hearts.length; i++) {
			hearts[i].x += hearts[i].vx;
			hearts[i].y += hearts[i].vy;
			hearts[i].vy -= 0.1;
			hearts[i].life--;

			hearts[i].dom.css('top', hearts[i].y);
			hearts[i].dom.css('left', hearts[i].x);
			hearts[i].dom.css('opacity', hearts[i].life / 60);
			hearts[i].dom.css('display', 'block');
		}

		hearts = hearts.filter(function (a) {
			if (a.life <= 0) {
				a.dom.remove();

				return false;
			}
			else {
				return true;
			}
		});

		requestAnimationFrame(animateHearts);
	}

	function animateNext() {
		if (nextTimeout) {
			clearTimeout(nextTimeout);

			if (nextInterval)
				clearInterval(nextInterval);
		}

		nextInterval = setInterval(function() {
			$('.next img').toggleClass('float');
		}, 300);
	}

	function stopAnimateNext() {
		if (nextInterval)
			clearInterval(nextInterval);

		$('.next img').removeClass('float');
	}

	function heartbeat() {
		var heart = $('.heart img');
		heart.addClass('beat');
		setTimeout(function () { heart.removeClass('beat') }, 100);
		setTimeout(function () { heart.addClass('beat') }, 300);
		setTimeout(function () { heart.removeClass('beat') }, 400);
	}

	$(function () {
			$('#next').click(loadQuote);
			$('.next').hover(
				animateNext,
				stopAnimateNext
			);
			$('#submit').click(submit);
			$('.dialog').click(function (e) { e.stopPropagation() });
			$(document).click(function (e) { $('.dialog-container').css('display', 'none') });

			$('#share-page-link').click(share);

			$('#form').submit(function (e) {
				e.preventDefault();

				var sub = $('#form input[type="submit"]');
				sub.attr('disabled', 'disabled');

				$.ajax({
					'type': 'POST',
					'data': {'note': $('#form textarea[name="note"]').val()},
					'url': e.target.action
				}).done(function (data) {
					data = JSON.parse(data);

					if (data.success) {
						sub.attr('value', 'Thank you!');
						setTimeout(function() { $('.dialog-container').css('display', 'none'); sub.val('Add a luvnote'); sub.removeAttr('disabled') }, 500);
					}
					else {
						sub.attr('value', 'Try Again!');
						sub.removeAttr('disabled');
					}
				});

				return false;
			});

			var re = /#q\d+/;
			if (window.location.hash.match(re) === null)
				loadQuote()

			$(document).click(floatHearts);

			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
			window.requestAnimationFrame = raf;

			//requestAnimationFrame(animateHearts);
			setInterval(heartbeat, 1200);
			nextTimeout = setTimeout(animateNext, 5000);
	});
})();
