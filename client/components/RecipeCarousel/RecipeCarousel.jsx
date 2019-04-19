import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';

export default class RecipeCarousel extends PureComponent {
  static displayName = 'RecipeCarousel';
  static propTypes = {
    photos: PropTypes.arrayOf(PropTypes.object)
  };

  componentDidUpdate(prevProps) {
    if (this.swiper && prevProps.photos.length !== this.props.photos.length) {
      this.swiper.update();
      this.swiper.slideTo(this.props.photos.length - 1);
    }
  }

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
      spaceBetween: 20,
      getSwiper: swiper => {
        this.swiper = swiper;
      }
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
