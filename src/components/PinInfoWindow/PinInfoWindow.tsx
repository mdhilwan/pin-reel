import useMapContext from "@/components/Context/MapContext";
import {InfoWindow} from "@react-google-maps/api";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";

export default function PinInfoWindow() {
  const {focusedPlace, setFocusedPlace} = useMapContext();
  return <>
    {focusedPlace && (
      <InfoWindow
        position={{lat: focusedPlace.lat, lng: focusedPlace.lng}}
        onCloseClick={() => setFocusedPlace(null)}
      >
        <div className="ps-1.5 pb-1.5">
          <h1
            className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 max-w-48 overflow text-ellipsis">
            {focusedPlace.name}
          </h1>
          <Swiper
            style={{
              // @ts-expect-error target custom swiper color variables
              "--swiper-navigation-color": "#000",
              "--swiper-pagination-color": "#fff",
              "--swiper-navigation-size": "30px"
            }}
            spaceBetween={10}
            slidesPerView={1}
            pagination={{clickable: true}}
            navigation
            modules={[Pagination, Navigation]}
            className="relative w-50 lg:w-75 h-50"
          >
            {focusedPlace.reels.map((reel: string, index: number) => (
              <SwiperSlide key={index}>
                {({isActive}) => (
                  <a href={reel} target="_blank" rel="noopener noreferrer">
                    <img
                      src={focusedPlace.images[index]}
                      className={`w-full aspect-square object-cover rounded-tl-lg rounded-tr-lg ${isActive ? 'opacity-100' : 'opacity-60'}`}
                      alt={`Reel ${index + 1}`}
                    />
                  </a>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex w-full divide-x divide-gray-300">
            <a
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 border-e-0 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-none transition-colors rounded-bl-lg"
              target="_blank"
              href={`https://www.google.com/maps/dir/?api=1&destination=${focusedPlace.lat},${focusedPlace.lng}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   viewBox="0 0 16 16">
                <path fillRule="evenodd"
                      d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8z"/>
                <path fillRule="evenodd"
                      d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
              </svg>
              <span className="hidden lg:inline">Maps</span>
            </a>
            <a
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 border-e-0 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-none transition-colors"
              target="_blank"
              href={focusedPlace.reels[0]}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path
                  d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
              <span className="hidden lg:inline">Instagram</span>
            </a>
            <a
              className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-none transition-colors cursor-pointer rounded-br-lg"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: focusedPlace.name,
                    text: `Check out this place: ${focusedPlace.name}`,
                    url: window.location.href,
                  }).catch(err => {
                    console.log('Share failed:', err);
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-link-45deg" viewBox="0 0 16 16">
                <path
                  d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path
                  d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
              </svg>
              <span className="hidden lg:inline">Share</span>
            </a>
          </div>
        </div>
      </InfoWindow>
    )}</>
}