import React, { Component } from 'react'

import Sketchpad from './Sketchpad.js';

class App extends Component {
	constructor(props) {
		super(props)
		// bind the context of user events to their event handlers
		this.setViewportSize = this.setViewportSize.bind(this)
		this.onOrientationChange = this.onOrientationChange.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		// initialize global variables
		this.isTouchDevice = false
		this.orientationTicker = 0

		this.touchMoveTicker = 0
		this.lastScrollY = 0

		this.userWheeled = {ticker: 0, deltaY: 0}
		this.userTouchMoved = {
			ticker: 0,
			thisSrroll: 0,
			nextScroll: 0,
			lastScrollY: 0
		}
		this.state = {
			viewportSize: {}
		}
	}

	componentDidMount() {
		this.checkIfTouchDevice()
		this.setViewportSize()
		window.addEventListener('resize', this.setViewportSize, false)
		window.addEventListener('orientationchange', this.onOrientationChange, false)
		window.addEventListener('touchmove', this.onTouchMove, {passive: false})
	}

	checkIfTouchDevice() {
		if('ontouchstart' in window || navigator.msMaxTouchPoints) {
			this.isTouchDevice = true
		}
	}

	onOrientationChange(e) {
		e.preventDefault()
		this.orientationTicker++
	}

	setViewportSize(e) {
		this.setState({
			viewportSize: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		})
	}

	onTouchMove(e) {
		e.preventDefault()
		this.touchMoveTicker++
		this.lastScrollY = e.touches[0].pageY
	}

	render() {
		return (
			<Sketchpad viewportSize={this.state.viewportSize}/>
		)
	}
}

export default App
