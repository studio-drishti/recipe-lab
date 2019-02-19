import React, { PureComponent } from 'react';
import Swiper from 'react-id-swiper';

export default class Step extends PureComponent {
  static displayName = 'StepCarousel';

  render() {
    const swiperParams = {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      spaceBetween: 20
    };

    return (
      <Swiper {...swiperParams}>
        <img
          src={'https://loremflickr.com/530/300/food,cooking,spaghetti?s=1'}
        />
        <img
          src={'https://loremflickr.com/530/300/food,cooking,spaghetti?s=2'}
        />
        <img
          src={'https://loremflickr.com/530/300/food,cooking,spaghetti?s=3'}
        />
      </Swiper>
    );
  }
}
