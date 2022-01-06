import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchInfo, ISearchInfoResult } from "../api";
import { makeImagePath } from "../utils";
import loader_img from "../loading.gif";
import Scrollbar from "react-scrollbars-custom";
import { AnimatePresence, motion } from "framer-motion";
import movieImg from "../movieIcon.png";
import tvImg from "../tvIcon.png";
import videoImg from "../defaultVideo.jpg";
import TvDetail from "../TvDetail";
import Detail from "../Detail";

const Loader = styled.div`
  background-image: url(${loader_img});
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center center;
  background-color: rgb(4,2,4);
`;

const Wrapper = styled.div`
    background-color: ${props => props.theme.black};
    display: flex;
    justify-content: center;
    align-items: center;
    width:100vw;
    height:100vh;
`;

const Container = styled.div`
    border-radius:15px;
    padding:20px;
    width: 70vw;
    min-height: 400px;
    height: auto;
    max-height: calc(100vh - 300px);
    background-color: ${props => props.theme.black.lighter};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    overflow:auto;
    position: absolute;
`;

const Item = styled(motion.div)<{bgPhoto:string}>`
    height: 300px;
    background-image: url(${props => props.bgPhoto === "" ? videoImg : props.bgPhoto});
    background-color: ${props => props.theme.black};
    background-position: center center;
    background-size: cover;
    border-radius:15px;
    position: relative;
    cursor: pointer;
`;

const IconMovie = styled.div`
    position: absolute;
    width: 100%;
    height:100%;
    left: 15px;
    top: 15px;
    background-image: url(${movieImg});
    background-size: 45px 45px;
    background-repeat: no-repeat;
`;

const IconTv = styled.div`
    position: absolute;
    width: 100%;
    height:100%;
    left: 10px;
    top: 10px;
    background-image: url(${tvImg});
    background-size: 60px 50px;
    background-repeat: no-repeat;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.veryDark};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 23px;
  }
`;

const infoVariants = {
    normal: {
        opacity: 0,
        // ease: "easeOut", duration: 0.2, type: "tween"
     },
    hover: {
      opacity: 1,
      transition: {
        delay: 0.5,
        duaration: 0.2,
        type: "tween",
      },
    },
  };

const NoContentsContainer = styled.div`
    border-radius:15px;
    padding:20px;
    width: 70vw;
    height: 400px;
    background-color: ${props => props.theme.black.lighter};
    display: flex;
    justify-content: center;
    align-items: center;
    
`;

const NoContents = styled.h2`
    text-align: center;
    line-height: 100%;
`;

interface IRouterMatch {
    movieId: string;
    tvId: string;
    type: string;
  }

  const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const {data: infoData, isLoading: infoLoading} = useQuery<ISearchInfoResult>("search",() => getSearchInfo(keyword || ""));
    const bigSearchMatch = useRouteMatch<IRouterMatch>([`/gongflix/search/movies/:movieId`,`/gongflix/search/tv/:tvId`]);
    console.log(bigSearchMatch);
    const history = useHistory();
    const onBoxClicked = (id: number, mediaType: string, event:React.MouseEvent<HTMLDivElement>) => {
        if(mediaType === 'movie'){
            history.push(`/gongflix/search/movies/${id}?keyword=${keyword}`);
        }
        if(mediaType === 'tv'){
            history.push(`/gongflix/search/tv/${id}?keyword=${keyword}`);
        }
        // document.body.style.overflow = "hidden";
      };
    const onOverlayClick = () => {
        history.push(`/gongflix/search?keyword=${keyword}`);
        //  document.body.style.overflow = "unset";
        }
    return (
        <Wrapper>
            {infoLoading ? <Loader /> : <>
          {infoData?.results.length === 0 ? <NoContentsContainer>검색된 내용이 없습니다.</NoContentsContainer> :
            <Container>
                {infoData?.results.map((info) => (
                
                    <Item key={info.id + "search"} layoutId={info.id + "search"} onClick={(event) => {onBoxClicked(info.id, info.media_type,event)}} bgPhoto={info.backdrop_path === null || info.backdrop_path === undefined ? "" : makeImagePath(info.backdrop_path+"")} whileHover="hover" initial="normal" animate={{overflow:"hidden"}}>
                        {info.media_type === "movie" ? <IconMovie /> : info.media_type === "tv" ? <IconTv /> : null}
                        <Info variants={infoVariants}>
                            <h4>{info.media_type === "tv" ? info.name : info.title}</h4>
                          </Info>
                    </Item>
                )
                )}
            </Container>}
            <AnimatePresence>
            {bigSearchMatch ? (
              <>
              <Overlay onClick={onOverlayClick} exit={{opacity:0}} animate={{opacity:1}}></Overlay>
              {bigSearchMatch.params.tvId === undefined ? 
              <Detail/> 
              : <TvDetail/>}
              </>
            ) : null}
            </AnimatePresence>
          </>
        }
        </Wrapper>
    );
}

export default Search;