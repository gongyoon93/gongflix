import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getPlayingMovies, getRatedMovies, getUpcomingMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Detail from "../Detail";
import loader_img from "../loading.gif";

const Wrapper = styled.div`
  background: black;
  margin-bottom: 50px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
`;

const Loader = styled.div`
  height: 100vh;
  background-image: url(${loader_img});
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center center;
  background-color: rgb(4,2,4);
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative; 
  flex-direction: column;
  margin-top: -200px;
`;

const Slider = styled.div`
    position: relative;
    margin-bottom: 200px;
    :last-child {
      margin-bottom: 240px;
    }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  border-radius: 10px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,
    borderRadius: 15,
    overflow: 'hidden',
    transition: {
      delay: 0.5,
      duaration: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    // scaleY: 2.5,
    // y: -10,
    transition: {
      delay: 0.5,
      duaration: 0.2,
      type: "tween",
    },
  },
};

const PlayingTitle = styled.h4`
    font-size:30px;
    margin: 20px 0;
    padding: 0 20px; 
`;

const ArrowBtn = styled.div`
  width: 50px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ArrowRightBtn = styled(ArrowBtn)`
  right: 0;
`;


const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

interface IRouterMatch {
  movieId: string;
  type: string;
}

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<IRouterMatch>("/gongflix/movies/:movieId/:type");
  const { data: playingData, isLoading: playingLoading } = useQuery<IGetMoviesResult>(
    ["movies", "Playing"],
    getPlayingMovies
  );
  
  const { data: ratedData, isLoading: ratedLoading } = useQuery<IGetMoviesResult>(
    ["movies", "Rated"],
    getRatedMovies
  );
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery<IGetMoviesResult>(
    ["movies", "Upcoming"],
    getUpcomingMovies
  );
  const isLoading = playingLoading || ratedLoading || upcomingLoading;
  const [playingIndex, setPlayingIndex] = useState(0);
  const [playingLeaving, setPlayingLeaving] = useState(false);
  const [ratedIndex, setRatedIndex] = useState(0);
  const [ratedLeaving, setRatedLeaving] = useState(false);
  const [upcomingIndex, setUpcomigIndex] = useState(0);
  const [upcomingLeaving, setUpcomingLeaving] = useState(false);
  const increaseIndex = (type:number) => {
    const data = type === 0 ? playingData : type === 1 ? ratedData : upcomingData;
    const leaving = type === 0 ? playingLeaving : (type === 1 ? ratedLeaving : upcomingLeaving);
    if (data) {
      if (leaving) return;
      toggleLeaving(type);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      type === 0 ? setPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1)) : type === 1 ? setRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1)) : setUpcomigIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = (type:number) => {type === 0 ? setPlayingLeaving((prev) => !prev) : (type === 1 ? setRatedLeaving((prev) => !prev) : setUpcomingLeaving((prev) => !prev))};
  const onBoxClicked = (movieId: number, type: number) => {
    history.push(`/gongflix/movies/${movieId}/${type}`);
    document.body.style.overflow = "hidden";
  };
  const onOverlayClick = () => {
    history.push("/gongflix/movies");
     document.body.style.overflow = "unset";
    }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(playingData?.results[0].backdrop_path || "")}
          >
            <Title>{playingData?.results[0].title}</Title>
            <Overview>{playingData?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving(0)}>
                  <PlayingTitle>상영중인 작품</PlayingTitle>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={playingIndex}
                  >
                    {playingData?.results
                      .slice(1)
                      .slice(offset * playingIndex, offset * playingIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "playing"}
                          key={movie.id + "playing"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id, 0)}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <ArrowRightBtn onClick={() => {increaseIndex(0)}}>
                  <FiChevronRight style={{ fontSize: 30 }} />
                </ArrowRightBtn>
              </Slider>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving(1)}>
                  <PlayingTitle>Top Rated 작품</PlayingTitle>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={ratedIndex}
                  >
                    {ratedData?.results
                      .slice(offset * ratedIndex, offset * ratedIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "rated"}
                          key={movie.id + "rated"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id, 1)}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <ArrowRightBtn onClick={() => {increaseIndex(1)}}>
                  <FiChevronRight style={{ fontSize: 30 }} />
                </ArrowRightBtn>
              </Slider>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving(2)}>
                  <PlayingTitle>개봉 예정 작품</PlayingTitle>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={upcomingIndex}
                  >
                    {upcomingData?.results
                      .slice(offset * upcomingIndex, offset * upcomingIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "upcoming"}
                          key={movie.id + "upcoming"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(movie.id, 2)}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <ArrowRightBtn onClick={() => {increaseIndex(2)}}>
                  <FiChevronRight style={{ fontSize: 30 }} />
                </ArrowRightBtn>
              </Slider>
          </SliderWrapper>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
              <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}></Overlay>
              <Detail/>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;