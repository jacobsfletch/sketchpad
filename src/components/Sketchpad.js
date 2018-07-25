import React, { Component } from 'react'

import './Sketchpad.css'

class Sketchpad extends Component {

	constructor(props) {
		super(props)

		// bind the context of user events to their event handlers
		this.onResize = this.onResize.bind(this)
		// this.onOrientationChange = this.onOrientationChange.bind(this)
		this.onTouchMove = this.onTouchMove.bind(this)
		this.onDown = this.onDown.bind(this)
		this.onMove = this.onMove.bind(this)
		this.onUp = this.onUp.bind(this)

		// initialize generals
		this.isTouchDevice = false
		// this.pixelRatio = 0
		this.orientationTicker = 0

		// initialize cursor stuff
		this.isMouseDown = false
		// this.touchMoveTicker = 0
		this.lastCursorX = 0
		this.lastCursorY = 0

		// initialize drawing styles
		this.lineWidth = 10
		this.lineColor = 'black'

		// initialize local state
		this.state = {
			canvasActive: false,
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

		// Measure viewport, which also sets the canvas size
		// equal to the referenced canvas element in the DOM
		this.onResize()

		// Establish canvas context
		this.ctx = this.canvasRef.getContext('2d')

		// Create event listeners
		window.addEventListener('resize', this.onResize, false)
		// window.addEventListener('orientationchange', this.onOrientationChange, false)
		window.addEventListener('touchmove', this.onTouchMove, {passive: false})
	}

	onResize() {
		this.setState({
			canvasActive: false,
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
		//e.preventDefault()

		// Open the onMove mouse event
		this.isMouseDown = true

		// Define line styles (must be defined before every draw)
		this.ctx.lineJoin = 'round'
		this.ctx.lineCap = 'round'
		this.ctx.lineWidth = this.lineWidth
		this.ctx.strokeStyle = this.lineColor

		// Activate the canvas
		this.activateCanvas()

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

	activateCanvas() {
		const newState = {...this.state}
		newState.canvasActive = true
		this.setState(newState)
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

	downloadDrawing(e) {
		const dataURL = this.canvasRef.toDataURL('image/png');
		e.target.href = dataURL;
	}

	colorChange(e) {
		this.lineColor = e.target.value
	}

	widthChange(e) {
		this.lineWidth = e.target.value
		this.lineWidthInputValue = `${this.lineWidth}px`
	}

	render() {
		const computedCanvasSize = this.canvasRef ? this.canvasRef.getBoundingClientRect() : {}
		return (
			<div className={this.state.canvasActive ? 'sketchpad active' : 'sketchpad'}>
				<div className="sketchpad-onboard">
					<h3>Drawing Anything</h3>
					<p>Begin by clicking or touching anywhere in the viewport.</p>
				</div>
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
					width={computedCanvasSize.width}
					height={computedCanvasSize.height}
				/>
				<div className={this.state.canvasActive ? 'sketchpad-controls' : 'sketchpad-controls inactive'}>
					<button className="button-clear" onClick={(e) => this.onResize()}>Clear</button>
					<a download className="button-download" onClick={(e) => this.downloadDrawing(e)}>Download</a>
					<input type="color" onChange={(e) => this.colorChange(e)} />
					<input type="number" max="1000" placeholder="Line Weight" value={this.lineWidthInputValue} onChange={(e) => this.widthChange(e)} />
				</div>
			</div>
		)
	}
}

export default Sketchpad
