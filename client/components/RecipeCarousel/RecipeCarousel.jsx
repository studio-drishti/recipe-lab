import React, { PureComponent } from 'react';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';

export default class Step extends PureComponent {
  static displayName = 'RecipeCarousel';

  render() {
    const swiperParams = {
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
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
