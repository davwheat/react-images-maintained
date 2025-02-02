# React Images

A mobile-friendly, highly customizable, carousel component for displaying media in ReactJS.

Maintained fork of [jossmac/react-images](https://github.com/jossmac/react-images).

### Getting Started

Start by installing `react-images-maintained`

```bash
npm install react-images-maintained
```

or

```bash
yarn add react-images-maintained
```

**If you were using `0.x` versions:** library was significantly rewritten for `1.x` version and contains several breaking changes.
The best way to upgrade is to read the docs and follow the examples.

### Using the Carousel

Import the carousel from `react-images-maintained` at the top of a
component and then use it in the render function.

```jsx
import React from 'react';
import Carousel from 'react-images-maintained';

const images = [{ src: 'path/to/image-1.jpg' }, { src: 'path/to/image-2.jpg' }];

class Component extends React.Component {
  render() {
    return <Carousel views={images} />;
  }
}
```

### Using the Modal

Import the modal and optionally the modal gateway from
`react-images-maintained` at the top of a component and then use it in
the render function.

The `ModalGateway` will insert the modal just before the
end of your `<body />` tag.

```jsx
import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images-maintained';

const images = [{ src: 'path/to/image-1.jpg' }, { src: 'path/to/image-2.jpg' }];

class Component extends React.Component {
  state = { modalIsOpen: false };
  toggleModal = () => {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen }));
  };
  render() {
    const { modalIsOpen } = this.state;

    return (
      <ModalGateway>
        {modalIsOpen ? (
          <Modal onClose={this.toggleModal}>
            <Carousel views={images} />
          </Modal>
        ) : null}
      </ModalGateway>
    );
  }
}
```
