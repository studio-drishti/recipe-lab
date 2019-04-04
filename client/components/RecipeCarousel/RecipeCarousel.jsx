import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';

export default class Step extends PureComponent {
  static displayName = 'RecipeCarousel';
  static propTypes = {
    photos: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { photos } = this.props;
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
      <div>
        {photos.length > 0 && (
          <Swiper {...swiperParams}>
            {photos.map(photo => (
              <img key={photo.filename} src={photo.url} />
            ))}
          </Swiper>
        )}
      </div>
    );
  }
}
