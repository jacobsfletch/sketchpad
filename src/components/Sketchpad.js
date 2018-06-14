import React, { Component } from 'react'
import { connect } from 'react-redux'

import ArrowIcon from '../../icons/arrow'

//import Input from '../../fields/input'
import DoodleForm from '../../forms/doodle'

import './index.css'

const mapStateToProps = state => {
	return {
		viewportSize: state.specs.viewportSize
	}
}

class DoodleView extends Component {

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
			viewportSize: {
				width: 0,
				height: 0
			},
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
			this.setState({ viewportSize: nextProps.viewportSize })
			this.setCanvasSize()
		}
	}

	setCanvasSize() {
		const canvasWidth = this.canvasRef.clientWidth
		const canvasHeight = this.canvasRef.clientHeight
		this.canvasRef.width = canvasWidth
		this.canvasRef.height = canvasHeight
		this.setState({
			canvasSize: {
				width: canvasWidth,
				height: canvasHeight
			},
			canvasActive: false
		})
	}

	componentDidMount() {
		this.setState({ viewportSize: this.props.viewportSize })
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
		const toolbeltClasses = this.state.canvasActive
			? 'sketchpad-toolbelt active'
			: 'sketchpad-toolbelt'
		const titleClasses = (this.state.canvasActive && !this.state.doodleSent)
			? 'sketchpad-title deactive'
			: 'sketchpad-title'
		const confirmClasses = this.state.doodleSent
			? 'sketchpad-confirm'
			: 'sketchpad-confirm deactive'

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
				<p className={confirmClasses}>Your doodle has been sent!</p>
				<p className={titleClasses}>Start drawing</p>
				<div className={toolbeltClasses}>
					<button onClick={(e) => this.setCanvasSize()}>&nbsp;clear&nbsp;</button>
					<a onClick={(e) => this.sendSketch(e)}>
						<p className="button-title">Send To Me</p>
						<ArrowIcon />
					</a>
				</div>
				<DoodleForm status={this.state.formActive} />
			</div>
		)
	}
}

export default connect(mapStateToProps)(DoodleView)
