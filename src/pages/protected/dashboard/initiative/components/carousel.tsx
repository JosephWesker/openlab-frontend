import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/swiper-bundle.css'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { useState } from 'react'
import type { Initiative } from '../schemas/initiativeSchema'
import { useHoverVideo } from '@/hooks/userHoverVídeo'
import CardMedia from '@mui/material/CardMedia'

export default function Carousel({ initiative }: { initiative: Initiative }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const { videoRef, showControls, handleMouseEnter, handleMouseLeave } = useHoverVideo({ controls: true })

  function isVideoUrl(url: string): boolean {
    const cleanUrl = url.split('?')[0] // Remove parameters for validation
    return /\.(mp4|webm|ogg)$/i.test(cleanUrl)
  }

  return (
    <>
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="initiative-carousel mb-2 h-40 sm:h-60 md:h-80 lg:h-120"
      >
        <SwiperSlide
          onMouseEnter={isVideoUrl(initiative.img) ? handleMouseEnter : undefined}
          onMouseLeave={isVideoUrl(initiative.img) ? handleMouseLeave : undefined}
        >
          {isVideoUrl(initiative.img) ?
            <CardMedia
              component="video"
              src={initiative.img}
              ref={videoRef}
              controls={showControls}
              autoPlay={false}
              playsInline
              loop
              className="rounded-xl w-full h-full object-cover"
            />
          :
            <CardMedia
              component="img"
              image={initiative.img}
              className="rounded-xl w-full h-full object-cover"
              alt=""
            />
          }
        </SwiperSlide>
        {initiative.multimedia.map((image: string, index: number) => (
          <SwiperSlide
            key={index}
            onMouseEnter={isVideoUrl(image) ? handleMouseEnter : undefined}
            onMouseLeave={isVideoUrl(image) ? handleMouseLeave : undefined}
          >
            {isVideoUrl(image) ?
              <CardMedia
                component="video"
                src={image}
                ref={videoRef}
                controls={showControls}
                autoPlay={false}
                playsInline
                loop
                className="rounded-xl w-full h-full object-cover"
              />
            :
              <CardMedia
                component="img"
                image={image}
                className="rounded-xl w-full h-full object-cover"
                alt=""
              />
            }
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="initiative-carousel-nav h-30 lg:h-30"
      >
        <SwiperSlide
        className='justify-center'
        onMouseEnter={isVideoUrl(initiative.img) ? handleMouseEnter : undefined}
        onMouseLeave={isVideoUrl(initiative.img) ? handleMouseLeave : undefined}
        >
          {isVideoUrl(initiative.img) ? (
            <CardMedia
              component="video"
              src={initiative.img}
              autoPlay={false}
              muted
              playsInline
              loop
              className="rounded-xl w-full h-full object-cover"
            />
          ) : (
            <CardMedia
              component="img"
              image={initiative.img}
              className="rounded-xl w-full h-full object-cover"
              alt=""
            />
          )}
        </SwiperSlide>
        {initiative.multimedia.map((image: string, index: number) => (
          <SwiperSlide
            key={index}
            onMouseEnter={isVideoUrl(initiative.img) ? handleMouseEnter : undefined}
            onMouseLeave={isVideoUrl(initiative.img) ? handleMouseLeave : undefined}
          >
            {isVideoUrl(image) ?
              <CardMedia
                component="video"
                src={image}
                ref={videoRef}
                controls={showControls}
                autoPlay={false}
                playsInline
                loop
                className="rounded-xl w-full h-full object-cover"
              />
            :
              <CardMedia
                component="img"
                image={image}
                className="rounded-xl w-full h-full object-cover"
                alt=""
              />
            }
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}