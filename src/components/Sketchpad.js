import React, { Component } from 'react'

import './Sketchpad.css'

class Sketchpad extends Component {

	constructor(props) {
		super(props)
		this.onDown = this.onDown.bind(this)
		this.onMove = this.onMove.bind(this)
		this.onUp = this.onUp.bind(this)
		this.setCanvasSize = this.setCanvasSize.bind(this)
		this.pixelRatio = 1/window.devicePixelRatio
		this.lineWidth = 10
		this.lineColor = 'black'
		this.state = {
			formActive: false,
			lastCursorX: 0,
			lastCursorY: 0,
			canvasActive: false,
			doodleSent: false,
			touchStart: 0,
			viewportSize: {},
			canvasSize: {
				width: 0,
				height: 0
			},
			startCoords: {
				x: 0,
				y: 0
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.viewportSize !== nextProps.viewportSize) {
			const newState = {...this.state}
			newState.viewportSize = nextProps.viewportSize
			this.setState({...newState})
			this.setCanvasSize()
		}
	}

	setCanvasSize() {
		const newState = {...this.state}
		newState.canvasSize = {
			width: this.canvasRef.clientWidth,
			height: this.canvasRef.canvasHeight
		}
		newState.canvasActive = false
		this.setState({...newState})
	}

	componentDidMount() {
		this.setCanvasSize()
		this.ctx = this.canvasRef.getContext('2d')
	}

	getCursorPosition(e) {
		const x = e.touches && e.touches[0] ? e.touches[0].pageX : e.clientX
		const y = e.touches && e.touches[0] ? e.touches[0].pageY : e.clientY
		const adjustedX = x - ((this.state.viewportSize.width - this.state.canvasSize.width) / 2)
		const adjustedY = y - ((this.state.viewportSize.height - this.state.canvasSize.height) / 2)
		return {
			x: adjustedX,
			y: adjustedY
		}
	}

	onDown(e) {
		e.preventDefault()
		if (this.state.formActive) { return }
		this.setState({
			canvasActive: true,
			isMouseDown: true
		})
		this.ctx.lineJoin = 'round'
		this.ctx.lineCap = 'round'
		this.ctx.lineWidth = this.lineWidth
		this.ctx.strokeStyle = this.lineColor
		this.drawLine(e, true)
	}

	onMove(e) {
		if (this.state.isMouseDown) { this.drawLine(e) }
	}

	onUp() {
		this.setState({ isMouseDown: false })
	}

	sendSketch() {
		this.setState({ formActive: true })
	}

	drawLine(e, isFirst) {
		const cursor = this.getCursorPosition(e)
		this.ctx.beginPath()
		const lastCursorX = isFirst ? cursor.x - 1 : this.state.lastCursorX
		const lastCursorY = isFirst ? cursor.y - 1 : this.state.lastCursorY
		this.ctx.moveTo(lastCursorX, lastCursorY)
		this.ctx.lineTo(cursor.x, cursor.y)
		this.ctx.stroke()
		this.setState({
			lastCursorX: cursor.x,
			lastCursorY: cursor.y
		})
	}

	render() {
		return (
			<div className={this.state.canvasActive ? 'sketchpad active' : 'sketchpad'}>
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
