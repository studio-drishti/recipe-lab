import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import { MdDeleteForever } from 'react-icons/md';

import css from './RecipeCarousel.css';
import IconButtonGroup from '../IconButtonGroup';
import IconButton from '../IconButton';

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
        type: 'bullets',
        dynamicBullets: true,
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      getSwiper: swiper => {
        this.swiper = swiper;
      }
    };

    return (
      <div className={css.carousel}>
        {photos.length > 0 && (
          <Swiper {...swiperParams}>
            {photos.map(photo => (
              <div
                key={photo.filename}
                style={{ backgroundImage: `url(${photo.url})` }}
                className={css.slide}
              >
                {/* <img src={photo.url} /> */}
                <IconButtonGroup className={css.actions}>
                  <IconButton>
                    <MdDeleteForever />
                  </IconButton>
                </IconButtonGroup>
              </div>
            ))}
          </Swiper>
        )}
      </div>
    );
  }
}
