/* Home page */
((w, d) => {
	let data = []

	const stock_url = 'assets/data/stock.json',
	form_url = 'assets/data/fake.json',
	getStockTpl = data => {
		return {
			items: `${data.map(item => `
				<div data-index="${item.id}" class="stock-item${item.active ? ' active' : ''}">
					<div class="stock-in">
						<div class="stock-title">${item.title}</div>
						<div class="stock-desc">${item.description}</div>
						<div class="stock-image"><img src="${item.image}" alt="${item.title}"></div>
						<div class="slider stock-item-articles"><div><ul class="stock-articles">
							${item.articles.map(article => `<li><span>${article}</span></li>`).join('')}
						</ul></div></div>
					</div>
				</div>`).join('')}`, 
			nav: `${data.map(item => `
				<li data-index="${item.id}"${item.active ? ' class="active"' : ''}>${item.name}</li>`).join('')}`
		}
	},
	setStock = url => {
		async function load() {
			const response = await fetch(url)
			data = await response.json()
			build(data)
		}

		function build(data) {
			const wrap = $_('#stock-wrapper'), 
			nav = $_('#stock-nav'), tpl = getStockTpl(data)
			wrap.innerHTML = tpl.items
			nav.innerHTML = tpl.nav

			new onw.Slider('.stock-slider', {dots: nav})

			$_('.stock-item').forEach(el => {
				new onw.Slider($_('.stock-item-articles', el), {
					arrows: {
						next: '',
						prev: ''
					}
				})
			})
		}

		data.length ? build(data) : load()
	},
	formHandler = response => {
		console.log(response)
		//...
	},
	setVideo = el => {
		const video = $_(el), 
		src = video.dataset.src,
		play = () => {
			video.setAttribute('src', src)
			onw.setActive($_('.v-cont'))
			onw.setActive($_('.video'))
			video.play()
		},
		stop = () => {
			video.pause()
			onw.deActive($_('.v-cont'))
			onw.deActive($_('.video'))
		}

		video.addEventListener('timeupdate', () => video.ended && stop())

		return {play: play, stop: stop}
	}

	setStock(stock_url)

	const video = setVideo('.vid')
	$_('.play-video').addEventListener('click', () => video.play())
	$_('.stop-video').addEventListener('click', () => video.stop())


	new onw.Slider('.com-slider', {arrows: !0})
	new onw.Slider('.work-slider', {arrows: !0})
	new onw.Slider('.samples-slider', {arrows: !0})

	const modal = new tingle.modal({
		footer: !0,
		stickyFooter: !1,
		cssClass: ['recall']
	})

	modal.addFooterBtn('', 'close-btn', () => modal.close())
	modal.setContent($_('.modal-recall').innerHTML)
	$_('.mod-recall').addEventListener('click', () => modal.open())


	$_('.form').forEach(form => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			onw.sendData(form_url, response => formHandler(response),
				form, {/* key: 'value',.. */}, true //= for fake response
			)
		})
	})

})(window, document)