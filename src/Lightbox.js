import React, { Component, PropTypes } from 'react';
import blacklist from 'blacklist';
import classSet from 'classnames';
import useSheet from 'react-jss';
import jss from 'jss';
import camelCase from 'jss-camel-case';
import px from 'jss-px';
import nested from 'jss-nested';
import vendorPrefixer from 'jss-vendor-prefixer';

jss.use(camelCase());
jss.use(nested());
jss.use(px());
jss.use(vendorPrefixer());

import Fade from './Fade';
import Icon from './Icon';
import Portal from './Portal';

import defaultStyles from './styles/default';
import Transition from 'react-addons-transition-group';

class Lightbox extends Component {
	static theme(themeStyles) {
		let extStyles = Object.assign({}, defaultStyles);
		for (var key in extStyles) {
			if (key in themeStyles) {
				extStyles[key] = Object.assign({}, defaultStyles[key], themeStyles[key]);
			}
		}
		return extStyles;
	}
	constructor() {
		super();

		this.close = this.close.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrev = this.gotoPrev.bind(this);
		this.handleImageClick = this.handleImageClick.bind(this);
		this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
		this.handleResize = this.handleResize.bind(this);
	}
	componentWillReceiveProps (nextProps) {
		if (nextProps.isOpen && nextProps.enableKeyboardInput) {
			if (typeof window !== 'undefined') window.addEventListener('keydown', this.handleKeyboardInput);
			if (typeof window !== 'undefined') window.addEventListener('resize', this.handleResize);
			this.handleResize();
		} else {
			if (typeof window !== 'undefined') window.removeEventListener('keydown', this.handleKeyboardInput);
			if (typeof window !== 'undefined') window.removeEventListener('resize', this.handleResize);
		}

		if (nextProps.isOpen) {
			document.body ? document.body.style.overflow = 'hidden' : null;
		} else {
			document.body ? document.body.style.overflow = null : null;
		}
	}

	close () {
		this.props.backdropClosesModal && this.props.onClose && this.props.onClose();
	}
	gotoNext (event) {
		if (this.props.currentImage === (this.props.images.length - 1)) return;
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.props.onClickNext();
	}
	gotoPrev (event) {
		if (this.props.currentImage === 0) return;
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.props.onClickPrev();
	}
	handleImageClick (e) {
		e.stopPropagation();
		if (!this.props.onClickShowNextImage) return;

		this.gotoNext();

	}
	handleKeyboardInput (event) {
		if (event.keyCode === 37) {
			this.gotoPrev();
		} else if (event.keyCode === 39) {
			this.gotoNext();
		} else if (event.keyCode === 27) {
			this.props.onClose();
		} else {
			return false;
		}
	}
	handleResize () {
		this.setState({
			windowHeight: (typeof window !== 'undefined') ? window.innerHeight : 0
		});
	}

	renderArrowNext () {
		if (this.props.currentImage === (this.props.images.length - 1)) return;
		const { classes } = this.props.sheet;
		const elementClass = classSet(classes.arrow, classes.arrowNext);

		return (
			<button title="Next (Right arrow key)" type="button" className={elementClass} onClick={this.gotoNext} onTouchEnd={this.gotoNext}>
				<Icon type="arrowRight" />
			</button>
		);
	}
	renderArrowPrev () {
		if (this.props.currentImage === 0) return;
		const { classes } = this.props.sheet;
		const elementClass = classSet(classes.arrow, classes.arrowPrev);

		return (
			<button title="Previous (Left arrow key)" type="button" className={elementClass} onClick={this.gotoPrev} onTouchEnd={this.gotoPrev}>
				<Icon type="arrowLeft" />
			</button>
		);
	}
	renderCloseButton () {
		if (!this.props.showCloseButton) return;
		const { classes } = this.props.sheet;

		return (
			<div className={classes.closeBar}>
				<button title="Close (Esc)" className={classes.closeButton} onClick={this.props.onClose}>
					<Icon type="close" />
				</button>
			</div>
		);
	}
	renderBackdrop () {
		if (!this.props.isOpen) return;
		const { classes } = this.props.sheet;

		return (
			<Fade key="backdrop" duration={200} className={classes.backdrop} onTouchEnd={this.close} onClick={this.close} />
		);
	}
	renderDialog () {
		if (!this.props.isOpen) return;
		const { classes } = this.props.sheet;

		return (
			<Fade key="dialog" duration={250} className={classes.container}>
				<span className={classes.contentHeightShim} />
				<div className={classes.content}>
					<div className={classes.stage}>
						{this.renderCloseButton()}
						{this.renderImages()}
						<span className={classes.figureShadow} />
					</div>
				</div>
				{this.renderArrowPrev()}
				{this.renderArrowNext()}
			</Fade>
		);
	}
	renderFooter (caption) {
		const { currentImage, images, showImageCount } = this.props;
		const { classes } = this.props.sheet;

		if (!caption && !showImageCount) return;

		const imageCount = showImageCount ? <div className={classes.footerCount}>{currentImage + 1} of {images.length}</div> : null;
		const figcaption = caption ? <figcaption className={classes.footerCaption}>{caption}</figcaption> : null;

		return (
			<div className={classes.footer}>
				{imageCount}
				{figcaption}
			</div>
		);
	}
	renderImages () {
		const { images, currentImage } = this.props;
		const { classes } = this.props.sheet;
		const { windowHeight } = this.state;

		if (!images || !images.length) return;

		let srcset, sizes;
		if (images[currentImage].srcset) {
			srcset = images[currentImage].srcset.join();
			sizes = '100vw';
		}

		return (
			<figure key={'image' + currentImage} className={classes.figure} style={{ maxWidth: this.props.width }}>
				<img
					className={classes.image}
					onClick={this.handleImageClick}
					onTouchEnd={this.handleImageClick}
					sizes={sizes}
					src={images[currentImage].src}
					srcSet={srcset}
					style={{
						cursor: this.props.onClickShowNextImage ? 'pointer' : 'auto',
						maxHeight: windowHeight
					}}
				/>
				{this.renderFooter(images[currentImage].caption)}
			</figure>
		);
	}
	render () {
		const { classes } = this.props.sheet;
		const props = blacklist(this.props, 'backdropClosesModal', 'currentImage', 'enableKeyboardInput', 'images', 'isOpen', 'onClickNext', 'onClickPrev', 'onClose', 'showCloseButton', 'width');
		const portalStyles = this.props.isOpen ? classes.portal : {};

		return (
			<Portal {...props} className={portalStyles}>
				<Transition transitionName="div" component="div">
					{this.renderBackdrop()}
				</Transition>
				<Transition transitionName="div" component="div">
					{this.renderDialog()}
				</Transition>
			</Portal>
		);
	}
};

Lightbox.displayName = 'Lightbox';
Lightbox.propTypes = {
	backdropClosesModal: PropTypes.bool,
	currentImage: PropTypes.number,
	enableKeyboardInput: PropTypes.bool,
	images: PropTypes.arrayOf(
		PropTypes.shape({
			src: PropTypes.string.isRequired,
			srcset: PropTypes.array,
			caption: PropTypes.string
		})
	).isRequired,
	isOpen: PropTypes.bool,
	onClickShowNextImage: PropTypes.bool,
	onClickNext: PropTypes.func.isRequired,
	onClickPrev: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	showCloseButton: PropTypes.bool,
	showImageCount: PropTypes.bool,
	width: PropTypes.number,
};
Lightbox.defaultProps = {
	enableKeyboardInput: true,
	currentImage: 0,
	onClickShowNextImage: true,
	showCloseButton: true,
	showImageCount: true,
	width: 900,
};

export default useSheet(Lightbox, defaultStyles);