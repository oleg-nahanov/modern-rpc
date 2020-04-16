
((w, f) => {
	const $_ = function $_ (s, p = document) {
		const el = p.querySelectorAll(s)
		return el.length > 1 ? el : el[0]
	}

	w.$_ = $_
	w.onw = f()
})(this, () => {

	function Slider(sel, opt) {
		const slider = (typeof(sel) === 'string') ? $_(sel) : sel,
		wrapper = slider.firstElementChild.firstElementChild,
		items = Array.from(wrapper.children)

		let wW = parseFloat(getComputedStyle(wrapper).width),
		iW = parseFloat(getComputedStyle(items[0]).width),
		pos = 0, trans = 0, idx = 0, step = iW / wW * 100,
		idxMax = items.length - 1, _items = [],
		config = {
			arrows: !1,
			dots: !1
		}

		for (let key in opt) if (key in config) config[key] = opt[key]

        items.forEach((item, index) => {
            _items.push({i: item, p: index, t: 0})
        })

        const position = {
            getItemMin: (i = 0) => {
                _items.forEach((item, index) => {
                    if (item.p < _items[i].p) i = index
                })
                return i
            },
            getItemMax: (i = 0) => {
                _items.forEach((item, index) => {
                    if (item.p > _items[i].p) i = index
                })
                return i
            },
            getMin: () => _items[position.getItemMin()].p,
            getMax: () => _items[position.getItemMax()].p
        }


        const move = (dir, n = 0) => {
            if (dir === 'next') {
                pos ++
                if ((pos + wW / iW - 1) > position.getMax()) {
                    n = position.getItemMin()
                    _items[n].p = position.getMax() + 1
                    _items[n].t += _items.length * 100
                    _items[n].i.style.transform = 'translateX(' + _items[n].t + '%)'
                }
                trans -= step
                idx ++
                if (idx > idxMax) idx = 0
            }
            if (dir === 'prev') {
                pos --
                if (pos < position.getMin()) {
                    n = position.getItemMax()
                    _items[n].p = position.getMin() - 1
                    _items[n].t -= _items.length * 100
                    _items[n].i.style.transform = 'translateX(' + _items[n].t + '%)'
                }
                trans += step
                idx --
                if (idx < 0) idx = idxMax
            }
           
            wrapper.style.transform = 'translateX(' + trans + '%)'
        }

        // const tplArrows = () => {
        // 	return {
        // 		next: `<a class="slider__control slider__control_left" href="#" role="button"></a>`,
        // 		prev: `<a class="slider__control slider__control_right" href="#" role="button"></a>`
        // 	}
        // }

        /*const _controlClick = e => {
            if (e.target.classList.contains('slider__control')) {
                e.preventDefault()
                var dir = e.target.classList.contains('slider__control_right') ? 'next' : 'prev'
                move(dir)
            }
        }*/

        const setUp = () => {
        	if (typeof(config.dots) === 'object') {
        		const btns = $_('li', config.dots)

        		btns.forEach((el, i) => {
					i = parseInt(el.dataset.index)
					el.classList.contains('active') && goTo(i)
					el.addEventListener('click', (e) => {
						goTo(i)
						onw.setActive(el, btns)
					})
				})
        	}

        	if (config.arrows === !0) {
        		const left = document.createElement('button')
        		const right = document.createElement('button')
        		left.classList.add('slider-control', 'prev')
        		right.classList.add('slider-control', 'next')
        		left.addEventListener('click', () => move('prev'))
        		right.addEventListener('click', () => move('next'))
        		slider.closest('div').appendChild(left)
        		slider.closest('div').appendChild(right)
        	} else if (typeof(config.arrows === 'object')) {
        		//console.log('custom arrows')
        	}
        }

        const goTo = ix => {
			items.forEach(i => i.dataset.index == ix ? onw.setActive(i) : onw.deActive(i))
			ix -- 
			if (ix < 0) ix = idxMax

            let i = 0, dir = (ix > idx) ? 'next' : 'prev'

        	dir = (ix == 0 && idx == idxMax) ? 'next' :
            (ix == idxMax && idx == 0) ? 'prev' : dir

            while (ix !== idx && i <= idxMax) {
                move(dir)
                i ++
            }
        }

        setUp()

        return {
            next: () => move('next'),
            prev: () => move('prev'),
            goTo: ix => goTo(ix)
        }
	}

	/* Common onw methods */
	function setActive(e, o, c = 'active') {
		o && o.forEach(el => deActive(el))
		e.classList.add(c)
	}

	function deActive(e, c = 'active') {
		e.classList.contains(c) && e.classList.remove(c)
	}

	async function sendData(url, func, form, data, fake = false) {
		const formData = new FormData(form)
		for (let name in data) formData.append(name, data[name])
		const opts = fake ? {} : {
			method: 'POST',
			body: formData
		}
		const response = await fetch(url, opts)
		const dat = await response.json()
		func(dat)
	}
	//================================

	return {
		Slider: Slider,
		setActive: setActive,
		deActive: deActive,
		sendData: sendData
	}
})