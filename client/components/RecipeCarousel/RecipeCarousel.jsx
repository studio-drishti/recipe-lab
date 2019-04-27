import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-id-swiper/lib/ReactIdSwiper.full';
import { MdDeleteForever } from 'react-icons/md';
import { Mutation } from 'react-apollo';
import classnames from 'classnames';

import css from './RecipeCarousel.css';
import IconButtonGroup from '../IconButtonGroup';
import IconButton from '../IconButton';
import RecipePhotoDeleteMutation from '../../graphql/RecipePhotoDelete.graphql';

export default class RecipeCarousel extends PureComponent {
  static displayName = 'RecipeCarousel';
  static propTypes = {
    photos: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    removePhoto: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    // TODO: if photos length has decreased, slideTo the next photo instead of end of slideshow
    if (this.swiper && prevProps.photos.length !== this.props.photos.length) {
      this.swiper.update();
      this.swiper.slideTo(this.props.photos.length - 1);
    }
  }

  render() {
    const { photos, className, removePhoto } = this.props;
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
      <div className={classnames(css.carousel, className)}>
        {photos.length > 0 && (
          <Swiper {...swiperParams}>
            {photos.map((photo, i) => (
              <div
                key={photo.filename}
                style={{ backgroundImage: `url(${photo.url})` }}
                className={css.slide}
              >
                {/* <img src={photo.url} /> */}
                <IconButtonGroup className={css.actions}>
                  <Mutation
                    mutation={RecipePhotoDeleteMutation}
                    onCompleted={data => {
                      if (data.recipePhotoDelete === true) {
                        removePhoto(i);
                      }
                    }}
                  >
                    {deletePhoto => (
                      <IconButton
                        onClick={() => {
                          deletePhoto({
                            variables: {
                              photoId: photo.id
                            }
                          });
                        }}
                      >
                        <MdDeleteForever />
                      </IconButton>
                    )}
                  </Mutation>
                </IconButtonGroup>
              </div>
            ))}
          </Swiper>
        )}
      </div>
    );
  }
}
