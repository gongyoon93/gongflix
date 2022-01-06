import styled from "styled-components";
import {motion, useViewportScroll} from "framer-motion"
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import {getSeriesDetail, getSeriesVideo, IGetSeriesVideoResult, ISeriesDetail } from "./api";
import YouTube from "react-youtube";
import { makeImagePath } from "./utils";
import { useEffect, useState } from "react";
import Scrollbar from "react-scrollbars-custom";
import { AiFillStar } from "react-icons/ai";
import { BiMoviePlay} from "react-icons/bi";
import videoImg from "./defaultVideo.jpg";

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position : absolute;
    width: 40vw;
    height: 70vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
    border-radius: 15px;
`;

const BigCover = styled.div<{bgPhoto:string}>`
    width: 100%;
    height: 400px;
    background-position: center center;
    background-size: cover;
    background-image: linear-gradient(to top, black, transparent),url(${props => props.bgPhoto === "" ? videoImg : props.bgPhoto});
`;

const BigTitle = styled.h3`
    color: ${props => props.theme.white.lighter};
    text-align: center;
    font-size: 36px;
    position: relative;
    padding: 10px 100px;
`;

const BigOverview = styled.p`
    padding: 20px;
    color: ${props => props.theme.white.lighter};
    position: relative;
`;

const BigOthers = styled.p`
  padding: 20px;
  color: ${props => props.theme.white.lighter};
  position: relative;
  font-size: 16px;
`;

const BigMovieWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const BigMovieContents = styled.div`
  width: 100%;
  height: 100%;
`;

const BigMovieAverage = styled.div`
    position: absolute;
    top: 17px;
    right: 20px;
    color: ${props => props.theme.white.lighter};
    background-color: ${props => props.theme.red};
    border:1px solid ${props => props.theme.red};
    padding: 5px 10px;
    border-radius:5px;
    font-weight:800;
    display:flex;
    align-items: center;
`;

const GenreContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding:0 20px;
`;

const GenreBox = styled.div`
    color: ${props => props.theme.white.lighter};
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 10px;
    :nth-child(1) {
      background-color: #EA5C2B;
      border:1px solid #EA5C2B;
    }
    :nth-child(2) {
      background-color: #FF7F3F;
      border:1px solid #FF7F3F;
    }
    :nth-child(3) {
      background-color: #F6D860;
      border:1px solid #F6D860;
    }
    :nth-child(4) {
      background-color: #95CD41;
      border:1px solid #95CD41;
    }
    :last-child {
      margin-right: 0;
    }
`;

interface IRouterMatch {
  tvId: string;
  type: string;
}

const VideoList = styled.ul`
  margin: 10px 10px;
  padding: 20px 20px;
  width: 100%-20px;
  background-color:${props => props.theme.black.darker};
  border-radius: 5px;
  
`;

const OtherVideo = styled.li`
  margin-bottom: 15px;
  cursor: pointer;
  :last-child {
    margin-bottom: 0;
  }
  &:hover{
    text-decoration: underline;
  }
  svg {
    position: relative;
    top: 2px;
    left: 5px;
    color: red;
    /* transition: opacity 1s; */
  }
`;


function TvDetail() {
    const history = useHistory();
    const {scrollY} = useViewportScroll();
    const bigTvMatch = useRouteMatch<IRouterMatch>(["/gongflix/tv/:tvId/:type",`/gongflix/search/tv/:tvId`]);
    const { data: videoData, isLoading: videoLoading } = useQuery<IGetSeriesVideoResult>(
      ["tv", "Video"],  
      () => getSeriesVideo(bigTvMatch?.params.tvId || "")
    );
    const { data: detailData, isLoading: detailLoading } = useQuery<ISeriesDetail>(
      ["tv", "Detail"],
      () => getSeriesDetail(bigTvMatch?.params.tvId || "")
    );
    const [videoKey, setVideoKey] = useState("");
    return (
        
                <BigMovie style={{top:scrollY.get() + 200}}
                layoutId={bigTvMatch?.params.tvId + (bigTvMatch?.params.type === "0" ? "popular" : bigTvMatch?.params.type === "1" ? "rated" : "search")}
              >
                  <BigMovieWrapper>
                    {bigTvMatch && 
                      <>
                        {videoData?.results.length !== 0 ? <YouTube videoId={videoKey === "" ? videoData?.results[0].key : videoKey} opts={{width:"100%"}}/> : <BigCover bgPhoto={detailData?.backdrop_path === null || detailData?.backdrop_path === undefined ? "" : makeImagePath(detailData?.backdrop_path+"")}/>}
                        <Scrollbar style={{width:"100%", height: "100%"}}>
                        <BigMovieContents>
                            <BigMovieAverage><AiFillStar />&nbsp;{detailData?.vote_average}</BigMovieAverage>
                            <BigTitle>{detailData?.name}</BigTitle>
                            <BigOverview>{detailData?.overview}</BigOverview>
                            {detailData?.genres.length !== 0 && (<GenreContainer>{detailData?.genres.map((genre) => <GenreBox>{genre.name}</GenreBox>)}</GenreContainer>)}
                            <BigOthers>시즌 : {detailData?.number_of_seasons} 개 / 에피소드 : {detailData?.number_of_episodes} 화</BigOthers>
                            {videoData?.results.length !== 0 &&
                              <VideoList>
                              {videoData?.results.map((video,videoIndex) => <OtherVideo onClick={() => {setVideoKey(video.key)}}>{`${videoIndex+1}. ${video.name}`} {((video.key === videoKey) || (videoIndex === 0 && videoKey === "")) && 
                              <BiMoviePlay/>}</OtherVideo>)}
                              </VideoList>
                            }
                        </BigMovieContents>
                        </Scrollbar>
                      </>
                    }
                  </BigMovieWrapper>
                </BigMovie>
              
    );
}

export default TvDetail;