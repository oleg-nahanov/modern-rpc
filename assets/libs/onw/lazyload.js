/* Using:
<img class="lazy" src="thumb.gif" data-src="real-img.jpg" data-srcset="real-img@1x.jpg 1x, real-img@2x.jpg 2x">
<div class="lazy-background"> with added class ".visible" for styling
<div data-bg="image.jpg">
*/

(function(d) {
	var lazyImages = [].slice.call(d.querySelectorAll('img.lazy')); 
	var lazyBackgrounds = [].slice.call(d.querySelectorAll('.lazy-background'));
	var lazyBackgroundsData = [].slice.call(d.querySelectorAll('[data-bg]'));
	var lazyIframes = [].slice.call(d.querySelectorAll('iframe.lazy'));

	if ('IntersectionObserver' in window) {

		let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					let lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					if(lazyImage.dataset.srcset) lazyImage.srcset = lazyImage.dataset.srcset;
					lazyImage.classList.remove('lazy');
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		});
		lazyImages.forEach(function(lazyImage) {
			lazyImageObserver.observe(lazyImage);
		});

		let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					lazyBackgroundObserver.unobserve(entry.target);
				}
			});
		});
		lazyBackgrounds.forEach(function(lazyBackground) {
			lazyBackgroundObserver.observe(lazyBackground);
		});

		let lazyBackgroundDataObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					let lazyBackgroundData = entry.target;
					lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
					lazyBackgroundDataObserver.unobserve(lazyBackgroundData);
				}
			});
		});
		lazyBackgroundsData.forEach(function(lazyBackgroundData) {
			lazyBackgroundDataObserver.observe(lazyBackgroundData);
		});

		let lazyIframeObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					let lazyIframe = entry.target;
					lazyIframe.src = lazyIframe.dataset.src;
					lazyIframe.classList.remove('lazy');
					lazyIframeObserver.unobserve(lazyIframe);
				}
			});
		});
		lazyIframes.forEach(function(lazyIframe) {
			lazyIframeObserver.observe(lazyIframe);
		});

	} else {

		lazyImages.forEach(function(lazyImage) {
			lazyImage.src = lazyImage.dataset.src;
			if(lazyImage.dataset.srcset) lazyImage.srcset = lazyImage.dataset.srcset;
		});
		lazyBackgrounds.forEach(function(lazyBackground) {
			lazyBackground.classList.add('visible');
		});
		lazyBackgroundsData.forEach(function(lazyBackgroundData) {
			lazyBackgroundData.style.backgroundImage = 'url(' + lazyBackgroundData.dataset.bg + ')';
		});
		lazyIframes.forEach(function(lazyIframe) {
			lazyIframe.src = lazyIframe.dataset.src;
		});

	}

})(document);

