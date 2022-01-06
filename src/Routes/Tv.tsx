import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getPopularSeries, getRatedSeries, IGetSeriesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import loader_img from "../loading.gif";
import TvDetail from "../TvDetail";
import videoImg from "../defaultVideo.jpg";

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
    url(${props => props.bgPhoto === "" ? videoImg : props.bgPhoto});
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
  background-image: url(${props => props.bgPhoto === "" ? videoImg : props.bgPhoto});
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
  tvId: string;
  type: string;
}

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<IRouterMatch>("/gongflix/tv/:tvId/:type");
  const { data: popularData, isLoading: popularLoading } = useQuery<IGetSeriesResult>(
    ["tv", "Popular"],
    getPopularSeries
  );  
  const { data: ratedData, isLoading: ratedLoading } = useQuery<IGetSeriesResult>(
    ["tv", "Rated"],
    getRatedSeries
  );
  const isLoading = popularLoading || ratedLoading;
  const [popularIndex, setPopularIndex] = useState(0);
  const [popularLeaving, setPopularLeaving] = useState(false);
  const [ratedIndex, setRatedIndex] = useState(0);
  const [ratedLeaving, setRatedLeaving] = useState(false);
  const increaseIndex = (type:number) => {
    const data = type === 0 ? popularData : ratedData;
    const leaving = type === 0 ? popularLeaving : ratedLeaving;
    if (data) {
      if (leaving) return;
      toggleLeaving(type);
      const totalSeries = data.results.length - 1;
      const maxIndex = Math.floor(totalSeries / offset) - 1;
      type === 0 ? setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1)) : setRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = (type:number) => {type === 0 ? setPopularLeaving((prev) => !prev) : setRatedLeaving((prev) => !prev)};
  const onBoxClicked = (tvId: number, type: number) => {
    history.push(`/gongflix/tv/${tvId}/${type}`);
    document.body.style.overflow = "hidden";
  };
  const onOverlayClick = () => {
    history.push("/gongflix/tv");
     document.body.style.overflow = "unset";
    }
  return (
    <Wrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Banner
            bgPhoto={popularData?.results[0].backdrop_path === null ? "" : makeImagePath(popularData?.results[0].backdrop_path || "")}
          >
            <Title>{popularData?.results[0].name}</Title>
            <Overview>{popularData?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
              <Slider>
                <AnimatePresence initial={false} onExitComplete={() => toggleLeaving(0)}>
                  <PlayingTitle>인기 작품</PlayingTitle>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={popularIndex}
                  >
                    {popularData?.results
                      .slice(1)
                      .slice(offset * popularIndex, offset * popularIndex + offset)
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + "popular"}
                          key={tv.id + "popular"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(tv.id, 0)}
                          transition={{ type: "tween" }}
                          bgPhoto={tv.backdrop_path === null ? "" : makeImagePath(tv.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
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
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + "rated"}
                          key={tv.id + "rated"}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          onClick={() => onBoxClicked(tv.id, 1)}
                          transition={{ type: "tween" }}
                          bgPhoto={tv.backdrop_path === null ? "" : makeImagePath(tv.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
                <ArrowRightBtn onClick={() => {increaseIndex(1)}}>
                  <FiChevronRight style={{ fontSize: 30 }} />
                </ArrowRightBtn>
              </Slider>
          </SliderWrapper>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
              <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}></Overlay>
              <TvDetail />
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;