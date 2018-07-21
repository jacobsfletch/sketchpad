import React, { Component } from 'react'

import './Sketchpad.css'

class Sketchpad extends Component {

	constructor(props) {
		super(props)

		// bind the context of user events to their event handlers
		this.measureViewportSize = this.measureViewportSize.bind(this)
		this.measureCanvasSize = this.measureCanvasSize.bind(this)
		// this.onOrientationChange = this.onOrientationChange.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		this.onDown = this.onDown.bind(this)
		this.onMove = this.onMove.bind(this)
		this.onUp = this.onUp.bind(this)

		// initialize generals
		this.isTouchDevice = false
		// this.canvasActive = false
		// this.pixelRatio = 0
		this.orientationTicker = 0

		// initialize cursor stuff
		// this.isMouseDown = false
		// this.touchMoveTicker = 0
		// this.lastCursorX = 0
		// this.lastCursorY = 0
		// this.touchStart = 0

		// initialize drawing styles
		this.lineWidth = 10
		this.lineColor = 'black'

		this.userWheeled = {
			ticker: 0,
			deltaY: 0
		}

		this.userTouchMoved = {
			ticker: 0,
			thisSrroll: 0,
			nextScroll: 0
		}

		this.startCoords = {
			x: 0,
			y: 0
		}

		// initialize local state
		this.state = {
			viewportSize: {
				width: 0,
				height: 0
			}
		}
	}

	componentDidMount() {
		// Check the pixel ratio of the isTouchDevice
		// this.pixelRatio = 1/window.devicePixelRatio

		// Check if touch device, so we know which events to interact with
		if('ontouchstart' in window || navigator.msMaxTouchPoints) {
			this.isTouchDevice = true
		}

		// Measure viewport and canvas
		this.measureCanvasSize()
		this.measureViewportSize()

		// Establish canvas context
		this.ctx = this.canvasRef.getContext('2d')

		// Create event listeners
		window.addEventListener('resize', this.measureViewportSize, false)
		// window.addEventListener('orientationchange', this.onOrientationChange, false)
		window.addEventListener('touchmove', this.onTouchMove, {passive: false})
	}

	measureCanvasSize() {
		// this.canvasActive = false
		this.canvasRef.width = this.canvasRef.clientWidth
		this.canvasRef.height = this.canvasRef.clientHeight
	}

	measureViewportSize(e) {
		this.setState({
			viewportSize: {
				width: window.innerWidth,
				height: window.innerHeight
			}
		})
	}

	// onOrientationChange(e) {
	// 	e.preventDefault()
	// 	this.orientationTicker++
	// }

	// END INITIALIZATION

	onDown(e) {
		// Prevent default mouse reaction
		e.preventDefault()

		// Activate canvas and open the onMove mouse event
		this.canvasActive = true
		this.isMouseDown = true

		// Define line styles (must be defined before every draw)
		this.ctx.lineJoin = 'round'
		this.ctx.lineCap = 'round'
		this.ctx.lineWidth = this.lineWidth
		this.ctx.strokeStyle = this.lineColor

		// Begin drawing a new line by passing
		// the second argument as true
		this.drawLine(e, true)
	}

	onMove(e) {
		// Open the onMove mouse event to draw the line
		if (this.isMouseDown) { this.drawLine(e) }
	}

	onUp() {
		// Close the onMove mouse event
		this.isMouseDown = false
	}

	onTouchMove(e) {
		e.preventDefault()
		// Tick the onTouchMove tracker
		this.touchMoveTicker++
	}

	getCursorPosition(e) {
		// Returns the x and y coordinates of the
		// touch position relative to the viewport
		const x = e.touches && e.touches[0] ? e.touches[0].pageX : e.clientX
		const y = e.touches && e.touches[0] ? e.touches[0].pageY : e.clientY
		return { x, y }
	}

	drawLine(e, isNewLine) {
		// Establish connection with canvas
		this.ctx.beginPath()
		// Retrieve the current cursor position
		const cursor = this.getCursorPosition(e)
		// Determine if its the first point in the line segment
		// and track the coordinate accordingly
		const lastCursorX = isNewLine ? cursor.x - 1 : this.lastCursorX
		const lastCursorY = isNewLine ? cursor.y - 1 : this.lastCursorY
		// Move and draw the next point in the line segment
		// the previous-most point in which the cursor came from
		this.ctx.moveTo(lastCursorX, lastCursorY)
		this.ctx.lineTo(cursor.x, cursor.y)
		// Apply the stroke styles
		this.ctx.stroke()
		// Remember the current  cursor position for the next draw
		this.lastCursorX = cursor.x
		this.lastCursorY = cursor.y
	}

	render() {
		return (
			<div className={this.canvasActive ? 'sketchpad active' : 'sketchpad'}>
				<canvas
					ref={(canvas) => { this.canvasRef = canvas }}
					className='sketchpad-canvas'
					onMouseDown={this.onDown}
					onMouseMove={this.onMove}
					onMouseOut={this.onUp}
					onMouseUp={this.onUp}
					onTouchStart={this.onDown}
					onTouchMove={this.onMove}
					onTouchEnd={this.onUp}
				/>
			</div>
		)
	}
}

export default Sketchpad
